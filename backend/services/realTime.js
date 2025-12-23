import User from "../models/User.js";
import jwt from "jsonwebtoken";
import SessionManager from "./SessionManager.js";

export default function setupRealTime(io) {
  const recentViewerRequests = new Map();
  const pendingViewerRequests = new Map();
  const agentPermissions = new Map();

  // ✅ Persistent agent registry to track connected agents even after socket refresh
  const connectedAgents = new Map(); // { agentId: { userId, agentId, socketId, joinedAt } }

  // ✅ Track active sessions in memory for quick access
  const activeSessionsMap = new Map(); // { sessionId: { adminId, agentId, socketIds... } }

  // ✅ Helper: Build connected agents list (agents that are online in DB AND have active socket)
  async function buildConnectedAgentsList() {
    try {
      const onlineAgents = await User.find(
        { role: "agent", isOnline: true, status: "approved" },
        { _id: 1, userName: 1, email: 1, role: 1, isOnline: 1 }
      ).lean();

      return onlineAgents
        .filter((agent) => {
          const registryData = connectedAgents.get(agent._id.toString());
          const hasSocket = registryData && registryData.socketId;
          if (!hasSocket) {
            console.log(
              `⚠️ [BuildList] Agent ${agent._id} marked online but NO socket - filtering`
            );
          }
          return hasSocket;
        })
        .map((agent) => {
          const registryData = connectedAgents.get(agent._id.toString());
          return {
            agentId: agent._id,
            userId: agent._id,
            socketId: registryData?.socketId || null,
            joinedAt: registryData?.joinedAt || Date.now(),
            userName: agent.userName,
            email: agent.email,
          };
        });
    } catch (err) {
      console.error("[BuildConnectedAgentsList] Error:", err);
      return [];
    }
  }

  // ✅ Helper: Broadcast connected agents list to all admins
  async function broadcastConnectedAgentsList(reason = "update") {
    try {
      const agentsList = await buildConnectedAgentsList();
      io.emit("connected-agents-list", {
        agents: agentsList,
        timestamp: Date.now(),
        reason,
      });
      console.log(
        `✅ [BroadcastAgentsList] Sent ${agentsList.length} agents to admins (reason: ${reason})`
      );
    } catch (err) {
      console.error("[BroadcastAgentsList] Error:", err);
    }
  }

  // Production-ready tuning: TTL for queued requests and retry interval
  const PENDING_REQUEST_TTL = process.env.PENDING_REQUEST_TTL
    ? parseInt(process.env.PENDING_REQUEST_TTL, 10)
    : 60000; // default 60s
  const PENDING_DELIVERY_RETRY_MS = process.env.PENDING_DELIVERY_RETRY_MS
    ? parseInt(process.env.PENDING_DELIVERY_RETRY_MS, 10)
    : 2000; // default 2s

  // Periodically attempt to deliver pending viewer-requests and remove expired ones.
  const pendingScanner = setInterval(() => {
    try {
      // console.log("Hi Guys")
      const now = Date.now();
      for (const [agentId, adminMap] of pendingViewerRequests.entries()) {
        for (const [adminKey, req] of Array.from(adminMap.entries())) {
          // Expire old requests
          if (now - req.timestamp > PENDING_REQUEST_TTL) {
            adminMap.delete(adminKey);
            console.log(
              `🗑️ [PendingScanner] Expired queued request from ${
                req.adminId || adminKey
              } for agent ${agentId}`
            );
            continue;
          }

          // ✅ CRITICAL FIX: Search for agent socket directly, not just by room
          const agentIdStr = agentId.toString();
          let agentSocket = null;
          const allSockets = Array.from(io.sockets.sockets.values());

          // ✅ CRITICAL: Check BOTH userId AND agentId fields for proper agent matching
          for (const s of allSockets) {
            const uid = s.data.userId?.toString();
            const aid = s.data.agentId?.toString();

            if (uid === agentIdStr || aid === agentIdStr) {
              agentSocket = s;
              console.log(
                `✅ [PendingScanner] FOUND agent socket! id=${s.id}, userId=${uid}, agentId=${aid}`
              );
              break;
            }
          }

          const room = io.sockets.adapter.rooms.get(agentIdStr);

          if (agentSocket || (room && room.size > 0)) {
            let adminSocketId = req.adminSocketId;
            if (req.adminId) {
              const adminRoom = io.sockets.adapter.rooms.get(
                req.adminId.toString()
              );
              if (adminRoom && adminRoom.size > 0) {
                adminSocketId = adminRoom.values().next().value;
              }
            }

            // Emit to agent socket directly if found, otherwise use room
            if (agentSocket) {
              agentSocket.emit("viewer-request", {
                adminSocketId,
                adminId: req.adminId || null,
                reason: req.reason || null,
              });
              console.log(
                `✅ [PendingScanner] Delivered queued viewer-request from ${
                  req.adminId || adminKey
                } to agent socket ${agentSocket.id}`
              );
            } else {
              io.to(agentIdStr).emit("viewer-request", {
                adminSocketId,
                adminId: req.adminId || null,
                reason: req.reason || null,
              });
              console.log(
                `✅ [PendingScanner] Delivered queued viewer-request from ${
                  req.adminId || adminKey
                } to agent room ${agentId}`
              );
            }

            adminMap.delete(adminKey);
          }
        }

        // Clean up empty admin maps
        if (adminMap.size === 0) pendingViewerRequests.delete(agentId);
      }

      // ✅ NEW: Periodically clean up stale agent entries from persistent registry
      // Remove entries older than 5 minutes (unlikely to reconnect after that)
      const AGENT_REGISTRY_TTL = 5 * 60 * 1000; // 5 minutes
      for (const [agentId, agentData] of connectedAgents.entries()) {
        if (now - agentData.joinedAt > AGENT_REGISTRY_TTL) {
          connectedAgents.delete(agentId);
          console.log(
            `🗑️ [AgentRegistry] Removed stale agent ${agentId} (inactive for 5+ mins)`
          );
        }
      }
    } catch (err) {
      console.error(
        "[PendingScanner] Error while scanning pending viewer requests:",
        err
      );
    }
  }, PENDING_DELIVERY_RETRY_MS);

  // Clear scanner on process exit to avoid dangling timers
  process.on("exit", () => clearInterval(pendingScanner));
  process.on("SIGINT", () => {
    clearInterval(pendingScanner);
    process.exit();
  });

  // Track active screen sharers: { userId: { socketId, userName, startTime, mode } }
  const activeScreenSharers = new Map();

  io.on("connection", async (socket) => {
    try {
      // ✅ CRITICAL: Initialize socket.data immediately, BEFORE any event handlers
      socket.data = socket.data || {};

      const { role, userId, token, agentId } = socket.handshake.auth;

      // ✅ CRITICAL: Set userId FIRST before any room operations
      socket.data.userId =
        userId || (socket.data.auth && socket.data.auth.id) || null;
      socket.data.role =
        role || (socket.data.auth && socket.data.auth.role) || null;

      // OPTIONAL: verify token if you use JWT handshake (recommended)
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          // You can trust decoded.id and decoded.role — override if mismatch
          socket.data.auth = decoded;
          // Update userId from token if not provided in auth
          if (!socket.data.userId) {
            socket.data.userId = decoded.id || null;
          }
        } catch (err) {
          console.warn("Socket handshake JWT invalid:", err.message);
          // Optionally disconnect:
          // socket.disconnect(true);
        }
      }

      // ✅ CRITICAL: Set agentId for agents
      if (role === "agent") {
        socket.data.agentId = agentId || userId;
        console.log(
          `[Handshake] Agent socket ${socket.id} setting agentId=${socket.data.agentId}, userId=${socket.data.userId} from auth`
        );
      } else {
        socket.data.agentId = null; // admin must NEVER have agentId
      }

      // ✅ Ensure socket.data is fully initialized before room joins
      console.log(
        `[Handshake] Socket ${socket.id} initialized: userId=${socket.data.userId}, role=${socket.data.role}, agentId=${socket.data.agentId}`
      );

      // ✅ CRITICAL FIX: Join rooms on initial connection
      // Only agents should join agent rooms
      if (role === "agent") {
        if (socket.data.agentId || socket.data.userId) {
          const roomId = (socket.data.agentId || socket.data.userId).toString();
          socket.join(roomId);
          console.log(
            `[Handshake] Agent ${socket.data.agentId} joined room ${roomId}`
          );

          // ✅ CRITICAL: Register in persistent registry immediately on connection
          const agentIdStr = (
            socket.data.agentId || socket.data.userId
          ).toString();
          connectedAgents.set(agentIdStr, {
            userId: socket.data.userId,
            agentId: socket.data.agentId,
            socketId: socket.id,
            joinedAt: Date.now(),
            socketDataUserId: socket.data.userId,
            socketDataAgentId: socket.data.agentId,
          });
          console.log(
            `✅ [Handshake-Agent] Registered agent ${agentIdStr} in persistent registry on initial connection (total: ${connectedAgents.size})`
          );
        }
      } else if (role === "admin" || role === "superadmin") {
        // ✅ Admins join personal room
        if (socket.data.userId) {
          socket.join(socket.data.userId.toString());
          console.log(
            `[Handshake] Admin ${socket.data.userId} joined personal room ${socket.data.userId}`
          );
        }
      }

      console.log(
        `Socket connected: ${socket.id} — userId: ${socket.data.userId} role: ${socket.data.role}`
      );

      // ✅ Mark agent online on initial connection (only first socket)
      if (socket.data.role === "agent") {
        try {
          const idToMarkOnline = socket.data.userId || socket.data.agentId;
          await User.findByIdAndUpdate(idToMarkOnline, { isOnline: true });

          // Broadcast full agent list and connected agents list
          const agents = await User.find(
            { role: "agent", status: "approved" },
            { _id: 1, userName: 1, email: 1, role: 1, isOnline: 1 }
          ).lean();
          io.emit("agents-list-updated", { agents });

          // Broadcast connected agents (only those with active sockets)
          await broadcastConnectedAgentsList("agent-handshake-connected");
        } catch (e) {
          console.error("Error updating agent online status on handshake:", e);
        }
      } else if (
        socket.data.role === "admin" ||
        socket.data.role === "superadmin"
      ) {
        // ✅ Clear dedup entries when admin reconnects
        for (const key of Array.from(recentViewerRequests.keys())) {
          if (key.startsWith(`${socket.data.userId}:`)) {
            recentViewerRequests.delete(key);
            console.log(`🔥 [AdminReconnected] Cleared dedupe key: ${key}`);
          }
        }
      }

      // ✅ NOW register all event handlers AFTER socket.data is initialized
      socket.on("agent-ready", ({ agentId }) => {
        try {
          console.log(
            `🟢 Agent ready signal received from socket ${socket.id} for agentId: ${agentId}`
          );

          for (const [adminSocketId, adminSocket] of io.sockets.sockets) {
            if (adminSocket.data?.role === "admin") {
              console.log(`➡️ Auto viewer-request to agent ${agentId} `);
              io.to(agentId).emit("viewer-request", {
                adminId: adminSocket.data.userId,
              });
            }
          }

          // Ensure this event is only triggered by an agent (optional safety check)
          if (socket.data.role !== "agent") {
            console.warn(
              `⚠️ Non-agent tried sending agent-ready: ${socket.id}`
            );
            return;
          }

          // Notify all admins OR the specific admin who requested
          io.emit("agent-ready", {
            agentId,
            socketId: socket.id,
            message: "Agent is ready for communication.",
          });
        } catch (e) {
          console.error("Error handling agent-ready:", e);
        }
      });

      // Allow clients to explicitly join after connection (used by frontend)
      socket.on("join", async ({ userId, role, agentId }) => {
        try {
          if (!userId) return;

          // ✅ CRITICAL: Only update if handshake didn't provide these values
          if (!socket.data.userId) socket.data.userId = userId;
          if (!socket.data.role) socket.data.role = role;

          // ✅ CRITICAL FIX: For agents, ensure agentId is set from join event if not from handshake
          if (role === "agent" && !socket.data.agentId) {
            socket.data.agentId = agentId || userId;
            console.log(
              `[JOIN-Update] Agent socket ${socket.id} setting agentId=${socket.data.agentId} from join event`
            );
          }

          // ✅ CRITICAL: Only join rooms if not already joined from handshake
          const userIdStr = socket.data.userId.toString();
          const isAlreadyInUserRoom = socket.rooms.has(userIdStr);

          if (role === "admin" || role === "superadmin") {
            if (!isAlreadyInUserRoom) {
              socket.join(userIdStr);
              console.log(
                `[JOIN] Admin ${socket.id} (userId: ${socket.data.userId}) joined personal room ${userIdStr}`
              );
            } else {
              console.log(
                `[JOIN] Admin ${socket.id} already in room ${userIdStr}, skipping join`
              );
            }

            // --- SEND CONNECTED AGENTS LIST ---
            try {
              const agentsList = await buildConnectedAgentsList();
              socket.emit("connected-agents-list", {
                agents: agentsList,
                timestamp: Date.now(),
                reason: "admin-join",
              });
              console.log(
                `✅ [AdminJoin] Sent ${agentsList.length} connected agents to admin ${socket.data.userId}`
              );
            } catch (err) {
              console.error(
                "[AdminJoin] Failed to send connected agents list:",
                err
              );
            }

            // --- AUTO-REQUEST FOR ONLINE AGENTS ---
            try {
              setTimeout(async () => {
                try {
                  console.log(
                    `[AdminAutoConnect] Broadcasting to all ${connectedAgents.size} connected agents...`
                  );

                  // ✅ Only iterate connectedAgents (agents only, not admins)
                  for (const [
                    agentIdKey,
                    regData,
                  ] of connectedAgents.entries()) {
                    const payload = {
                      adminSocketId: socket.id,
                      adminId: socket.data.userId || userId || null,
                      reason: "admin-auto-reconnect",
                    };

                    io.to(agentIdKey).emit("viewer-request", payload);
                    console.log(
                      `➡️ [AdminAutoConnect] Sent viewer-request to agent ${agentIdKey} (socket: ${regData.socketId})`
                    );
                  }

                  io.emit("admin-reconnected", {
                    adminSocketId: socket.id,
                    adminId: socket.data.userId || userId || null,
                    reason: "admin-auto-reconnect",
                    timestamp: Date.now(),
                  });
                } catch (err) {
                  console.error("[AdminAutoConnect] Error broadcasting:", err);
                }
              }, 250);
            } catch (err) {
              console.error("[AdminAutoConnect] Schedule error:", err);
            }

            // ✅ NEW: Restore previous sessions for admin on reconnect
            try {
              const previousSessions =
                await SessionManager.getAdminActiveSessions(socket.data.userId);
              if (previousSessions && previousSessions.length > 0) {
                console.log(
                  `✅ [SessionRestore] Found ${previousSessions.length} previous session(s) for admin ${socket.data.userId}`
                );
                socket.emit("previous-sessions-available", {
                  sessions: previousSessions,
                  reason: "admin-reconnect",
                });
              }
            } catch (err) {
              console.error(
                "[SessionRestore] Error fetching previous sessions:",
                err
              );
            }

            io.emit("admin-ready", {
              adminAutoConnectPending: true,
              adminSocketId: socket.id,
              reason: "admin-joined",
            });
          }

          if (role === "agent") {
            const agentIdStr = socket.data.agentId.toString();
            if (!socket.rooms.has(agentIdStr)) {
              socket.join(agentIdStr);
              console.log(
                `[JOIN-AGENT] Agent socket ${socket.id} (userId: ${socket.data.userId}, agentId: ${socket.data.agentId}) joined room ${agentIdStr}`
              );
            }

            // ✅ Register in persistent registry on join event
            connectedAgents.set(agentIdStr, {
              userId: socket.data.userId,
              agentId: socket.data.agentId,
              socketId: socket.id,
              joinedAt: Date.now(),
              socketDataUserId: socket.data.userId,
              socketDataAgentId: socket.data.agentId,
            });
            console.log(
              `✅ [JOIN-AGENT] Registered agent ${agentIdStr} in persistent registry (total: ${connectedAgents.size})`
            );

            // ✅ Broadcast updated connected agents list to ALL admins
            try {
              await broadcastConnectedAgentsList("agent-joined");
            } catch (err) {
              console.error("[AgentJoinBroadcast] Error:", err);
            }
          } else {
            console.log(
              `✅ [JOIN-ADMIN] Admin socket ${socket.id} (userId: ${socket.data.userId}) joined`
            );
          }

          console.log(
            `Socket ${socket.id} joined personal room ${socket.data.userId} via join event (role=${role})`
          );

          // ✅ Clear dedup entries for this user when they rejoin
          for (const [key, _] of recentViewerRequests) {
            if (key.endsWith(`:${socket.data.userId}`)) {
              recentViewerRequests.delete(key);
              console.log(
                `✅ [Dedup-Join] Cleared old dedup entries for user ${socket.data.userId} on rejoin`
              );
            }
          }

          if (socket.data.role === "agent") {
            await User.findByIdAndUpdate(socket.data.userId, {
              isOnline: true,
            });
            const agents = await User.find(
              { role: "agent", status: "approved" },
              { _id: 1, userName: 1, email: 1, role: 1, isOnline: 1 }
            ).lean();
            io.emit("agents-list-updated", { agents });
          }

          // If this socket is an agent, flush any pending viewer requests
          if (role === "agent") {
            try {
              const lookupId = agentId || socket.data.userId;
              const pending = pendingViewerRequests.get(lookupId);
              if (pending && pending.size > 0) {
                console.log(
                  `✅ [PendingFlush] Delivering ${pending.size} queued viewer-request(s) to agent ${lookupId}`
                );
                for (const [adminKey, req] of pending.entries()) {
                  let adminSocketId = req.adminSocketId;
                  if (req.adminId) {
                    const adminRoom = io.sockets.adapter.rooms.get(
                      req.adminId.toString()
                    );
                    if (adminRoom && adminRoom.size > 0) {
                      adminSocketId = adminRoom.values().next().value;
                    }
                  }

                  socket.emit("viewer-request", {
                    adminSocketId,
                    adminId: req.adminId || null,
                    reason: req.reason || null,
                  });
                  console.log(
                    `✅ [PendingFlush] Flushed viewer-request to agent socket ${socket.id} (agentId: ${lookupId}, adminId: ${req.adminId})`
                  );
                }
                if (lookupId) {
                  pendingViewerRequests.delete(lookupId);
                  console.log(
                    `✅ [PendingFlush] Cleared pending requests for agent ${lookupId}`
                  );
                }
              }
            } catch (flushErr) {
              console.error(
                "Error flushing pending viewer requests:",
                flushErr
              );
            }
          }

          if (
            socket.data.role === "admin" ||
            socket.data.role === "superadmin"
          ) {
            console.log(
              `✅ [AdminRejoin] Admin ${socket.data.userId} reconnected - dedup entries preserved for immediate request`
            );
          }
        } catch (err) {
          console.error("Error in join handler:", err);
        }
      });

      // ---- Events ----

      // Broadcast updated agent list to all admins whenever connection changes
      socket.on("get-agents-list", async () => {
        try {
          const agents = await User.find(
            { role: "agent", status: "approved" },
            { _id: 1, userName: 1, email: 1, role: 1, isOnline: 1 }
          ).lean();
          socket.emit("agents-list", { agents });
        } catch (error) {
          console.error("Error fetching agents list:", error);
          socket.emit("agents-list-error", { error: error.message });
        }
      });

      // ✅ Handle admin requesting the current connected agents list
      socket.on("get-connected-agents-list", async () => {
        try {
          console.log(
            `[GetConnectedAgentsList] Admin ${socket.id} requesting list`
          );
          const agentsList = await buildConnectedAgentsList();
          socket.emit("connected-agents-list", {
            agents: agentsList,
            timestamp: Date.now(),
            reason: "admin-requested",
          });
          console.log(
            `✅ [GetConnectedAgentsList] Sent ${agentsList.length} agents`
          );
        } catch (err) {
          console.error("[GetConnectedAgentsList] Error:", err);
        }
      });

      // When admin connects, broadcast updated agents list to all admins
      if (socket.data.role === "admin" || socket.data.role === "superadmin") {
        try {
          const agents = await User.find(
            { role: "agent", status: "approved" },
            { _id: 1, userName: 1, email: 1, role: 1, isOnline: 1 }
          ).lean();
          io.emit("agents-list-updated", { agents });
        } catch (error) {
          console.error("Error broadcasting agents list:", error);
        }
      }

      // ===================== VIEWER REQUEST EVENTS =====================

      // Admin requests to view an agent: forward a viewer-request event to the agent's room
      // WITH deduplication: ignore if same admin requested same agent within last 1 second
      socket.on("request-view", ({ agentId, reason }) => {
        console.log(
          `request-view by ${socket.id} for agent ${agentId} (role=${socket.data.role})`
        );

        // Optional: server-side permission checks here
        // Example: allow only superadmin roles
        if (socket.data.role !== "admin") {
          console.log("it is not authorize");
          socket.emit("request-denied", { reason: "not-authorized" });
          return;
        }

        // ✅ CRITICAL FIX: Normalize agentId to string to ensure consistent room lookup
        const agentIdStr = agentId.toString();

        // ✅ FIXED: Deduplicate using userId instead of socketId
        // This prevents issues when socket reconnects after page refresh
        const adminUserId = socket.data.userId || socket.id;
        const key = `${adminUserId}:${agentIdStr}`;

        const lastRequestTime = recentViewerRequests.get(key);
        const now = Date.now();

        console.log("last request time is");

        // ✅ FIXED: Reduce dedup window from 2s to 1s to allow faster reconnection
        if (lastRequestTime && now - lastRequestTime < 1000) {
          console.log(
            `[DEDUPE] Ignoring duplicate request from admin ${adminUserId} for agent ${agentIdStr} (within 1s)`
          );
          return;
        }
        recentViewerRequests.set(key, now);
        // cleanup old entries to prevent memory leak (reduced from 60s to 30s)
        for (const [k, t] of recentViewerRequests) {
          if (now - t > 30000) recentViewerRequests.delete(k);
        }
        console.log(
          `[RequestView] Forward request from admin ${adminUserId} to agent ${agentIdStr}`
        );

        // If the agent's personal room exists, emit directly. Otherwise queue the
        // request so it can be delivered once the agent re-joins (e.g. after refresh).
        try {
          // ✅ CRITICAL FIX: Check persistent agent registry FIRST
          const registeredAgent = connectedAgents.get(agentIdStr);
          if (registeredAgent) {
            console.log(
              `✅ [RequestView] Agent ${agentIdStr} found in persistent registry (socket: ${registeredAgent.socketId})`
            );
          }

          // ✅ CRITICAL FIX: Search through all connected sockets with proper string normalization
          let agentSocket = null;
          const allSockets = Array.from(io.sockets.sockets.values());

          console.log("[RequestView] Looking for agent:", agentIdStr);
          console.log(
            "[RequestView] Total connected sockets:",
            allSockets.length
          );

          // ✅ CRITICAL: Check BOTH userId AND agentId fields for proper agent matching
          for (const s of allSockets) {
            const socketUserId = s.data?.userId
              ? s.data.userId.toString()
              : null;
            const socketAgentId = s.data?.agentId
              ? s.data.agentId.toString()
              : null;
            const socketRole = s.data?.role || "unknown";

            console.log(
              `[RequestView] Checking socket ${s.id}: userId=${socketUserId}, agentId=${socketAgentId}, role=${socketRole}`
            );

            // Match if either userId or agentId equals the requested agentId
            if (socketUserId === agentIdStr || socketAgentId === agentIdStr) {
              agentSocket = s;
              console.log(
                `✅ [RequestView] FOUND agent socket! id=${
                  s.id
                }, userId=${socketUserId}, agentId=${socketAgentId}, match=${
                  socketUserId === agentIdStr ? "userId" : "agentId"
                }`
              );
              break;
            }
          }

          const room = io.sockets.adapter.rooms.get(agentIdStr);

          console.log("rooms are :", io.sockets.adapter.rooms);

          console.log("[RequestView] Room lookup:", {
            roomExists: !!room,
            roomSize: room?.size || 0,
            agentIdStr,
            agentInRegistry: !!registeredAgent,
          });
          console.log(
            "[RequestView] All available rooms:",
            Array.from(io.sockets.adapter.rooms.entries()).map(
              ([key, set]) => ({
                key,
                size: set.size,
              })
            )
          );

          const payload = {
            adminSocketId: socket.id,
            adminId: socket.data.userId || null,
            reason: reason || null,
          };
          // console.log("[RequestView] Payload:", payload);

          // ✅ CRITICAL FIX: Always try to emit to the room first since agents ALWAYS join their agent room
          // The room is the most reliable delivery mechanism
          if (room && room.size > 0) {
            console.log(
              `[RequestView] Agent room exists for ${agentIdStr}! Emitting directly to room (${room.size} socket(s))`
            );
            io.to(agentIdStr).emit("viewer-request", payload);
            console.log(
              `[RequestView] Delivered viewer-request to agent room ${agentIdStr}`
            );
          } else if (agentSocket) {
            // Fallback: if room doesn't exist but socket found, emit directly
            console.log(
              `[RequestView] Agent socket found (no room). Emitting directly to socket ${agentSocket.id}`
            );
            agentSocket.emit("viewer-request", payload);
            console.log(
              `[RequestView] Delivered viewer-request to agent socket ${agentSocket.id}`
            );
          } else if (registeredAgent) {
            // ✅ NEW: If agent is in registry but not in socket list, they may be reconnecting
            // Emit to their room anyway in case they're in transit
            console.log(
              `[RequestView] Agent ${agentIdStr} in registry but socket disconnected. Emitting to room anyway.`
            );
            io.to(agentIdStr).emit("viewer-request", payload);
            console.log(
              `[RequestView] Delivered viewer-request to agent room ${agentIdStr} (from registry)`
            );
          } else {
            // Queue the request for later delivery. Deduplicate per adminUserId so
            // repeated clicks by the same admin do not create multiple queued entries.
            const adminKey = socket.data.userId || socket.id;
            let map = pendingViewerRequests.get(agentIdStr);
            if (!map) {
              map = new Map();
              pendingViewerRequests.set(agentIdStr, map);
            }
            map.set(adminKey, { ...payload, timestamp: now });

            // console.log("map is:", map);
            // Bound queue size to avoid unbounded memory growth (keep latest 50 unique admins)
            while (map.size > 50) {
              const firstKey = map.keys().next().value;
              map.delete(firstKey);
            }
            console.log(
              `⚠️ [Pending] Agent ${agentIdStr} not found in any room or sockets; queued viewer-request (pending unique admins: ${map.size})`
            );
          }
        } catch (emitErr) {
          console.error("Error delivering or queuing viewer-request:", emitErr);
        }
      });

      // ✅ FIXED: Handle when agent PC connection closes (agent side detection)
      socket.on(
        "agent-pc-closed",
        ({ adminSocketId, agentId, connectionState }) => {
          console.log(
            `[AgentPCClosed] Agent ${socket.id} (${agentId}) PC closed with admin ${adminSocketId} (state: ${connectionState})`
          );
          // ✅ FIXED: Clear the dedup key using userId instead of socketId
          // This allows the admin to immediately request again after refresh
          const adminUserId = socket.data.userId || socket.id;
          const key = `${adminUserId}:${agentId}`;
          if (recentViewerRequests.has(key)) {
            recentViewerRequests.delete(key);
            console.log(
              `✅ [Dedup] Cleared dedup key for immediate rejoin: ${key}`
            );
          }
        }
      );

      // ✅ FIXED: Handle when admin PC connection closes (admin side detection)
      socket.on(
        "admin-pc-closed",
        ({ agentId, adminSocketId, connectionState }) => {
          console.log(
            `[AdminPCClosed] Admin ${socket.id} (${adminSocketId}) PC closed with agent ${agentId} (state: ${connectionState})`
          );
          // ✅ FIXED: Clear the dedup key using userId instead of socketId
          const adminUserId = socket.data.userId || socket.id;
          const key = `${adminUserId}:${agentId}`;
          if (recentViewerRequests.has(key)) {
            recentViewerRequests.delete(key);
            console.log(
              `✅ [Dedup] Cleared dedup key for immediate rejoin: ${key}`
            );
          }
        }
      );

      // Agent sends an offer to admin
      socket.on("offer", ({ adminId, toSocketId, sdp, sessionId }) => {
        console.log(
          `offer from ${socket.id} (agentId: ${socket.data.agentId}) -> ${adminId}, sessionId: ${sessionId}`
        );

        // ✅ NEW: Join session room if sessionId provided
        if (sessionId) {
          socket.join(sessionId);
          console.log(
            `✅ [SessionJoin] Agent socket ${socket.id} joined session room ${sessionId}`
          );
        }

        // Prefer delivering to the admin's personal room (userId) so signaling
        // survives socket reconnections. Include stable user identifiers in
        // the payload so clients can key their peer connections by userId.
        io.to(adminId).emit("offer", {
          fromUserId: socket.data.userId || null,
          fromAgentId: socket.data.agentId || null,
          fromSocketId: socket.id,
          sdp,
          sessionId: sessionId || null,
        });
      });

      // Admin sends answer to agent
      socket.on("answer", ({ toSocketId, sdp, sessionId }) => {
        console.log(
          `answer from ${socket.id} -> ${toSocketId}, sessionId: ${sessionId}`
        );

        // ✅ NEW: Join session room if sessionId provided
        if (sessionId) {
          socket.join(sessionId);
          console.log(
            `✅ [SessionJoin] Admin socket ${socket.id} joined session room ${sessionId}`
          );
        }

        // Forward answer including the admin's stable user id so the agent can
        // match the incoming answer to the correct peer (keyed by admin userId)
        io.to(toSocketId).emit("answer", {
          fromUserId: socket.data.userId || null,
          fromSocketId: socket.id,
          sdp,
          sessionId: sessionId || null,
        });
      });

      // ICE candidate exchange (both directions)
      socket.on("ice-candidate", ({ toSocketId, candidate, sessionId }) => {
        // ✅ NEW: Include sessionId in candidate payload
        // forward candidate and include stable user id so peers can index
        io.to(toSocketId).emit("ice-candidate", {
          fromUserId: socket.data.userId || null,
          fromSocketId: socket.id,
          candidate,
          sessionId: sessionId || null,
        });
      });

      // ✅ FIXED: Forward admin-disconnecting notification to agents
      socket.on(
        "admin-disconnecting",
        ({ adminSocketId, adminId, agentIds, reason }) => {
          console.log(
            `[AdminDisconnecting] Admin ${adminSocketId} (userId: ${adminId}) disconnecting from agents:`,
            agentIds,
            "reason:",
            reason
          );
          // Send cleanup signal to all agents this admin was viewing
          agentIds.forEach((agentId) => {
            io.to(agentId.toString()).emit("admin-disconnecting", {
              adminSocketId,
              adminId: adminId || socket.data.userId || socket.id,
              reason,
            });
            // Clear dedup key for immediate rejoin
            const adminUserId = adminId || socket.data.userId || socket.id;
            const key = `${adminUserId}:${agentId}`;
            if (recentViewerRequests.has(key)) {
              recentViewerRequests.delete(key);
              console.log(`✅ [Dedup] Cleared key for admin reconnect: ${key}`);
            }
          });
        }
      );

      // agent/admin can leave a personal session
      socket.on("leave", ({ agentId }) => {
        if (agentId) {
          socket.leave(agentId.toString());
          console.log(`Socket ${socket.id} left room ${agentId}`);
        }
      });

      socket.on("disconnect", async (reason) => {
        console.log(`Socket disconnected: ${socket.id} reason: ${reason}`);
        try {
          // Remove from active sharers if was sharing
          if (activeScreenSharers.has(socket.data.userId)) {
            activeScreenSharers.delete(socket.data.userId);
            const sharersArray = Array.from(activeScreenSharers.values());
            io.emit("active-sharers-updated", { sharers: sharersArray });
            io.emit("user-stopped-sharing", {
              userId: socket.data.userId,
              reason: "disconnect",
            });
          }

          // ✅ FIXED: Only mark agent offline if ALL their sockets are gone
          if (
            socket.data &&
            (socket.data.userId || socket.data.agentId) &&
            socket.data.role === "agent"
          ) {
            const agentIdStr =
              socket.data.agentId?.toString() || socket.data.userId?.toString();

            // Remove from persistent registry
            if (agentIdStr && connectedAgents.has(agentIdStr)) {
              connectedAgents.delete(agentIdStr);
              console.log(
                `✅ [DisconnectAgent] Removed agent ${agentIdStr} from registry (total: ${connectedAgents.size})`
              );
            }

            // ✅ Check if agent has ANY remaining sockets before marking offline
            const remainingSockets = Array.from(
              io.sockets.sockets.values()
            ).filter(
              (s) =>
                s.data &&
                s.data.role === "agent" &&
                (s.data.agentId?.toString() === agentIdStr ||
                  s.data.userId?.toString() === agentIdStr)
            );

            if (remainingSockets.length === 0) {
              // Only mark offline when last socket disconnects
              const idToMarkOffline = socket.data.userId || socket.data.agentId;
              await User.findByIdAndUpdate(idToMarkOffline, {
                isOnline: false,
              });
              console.log(
                `✅ [DisconnectAgent] Marked agent ${agentIdStr} OFFLINE (no remaining sockets)`
              );
            } else {
              console.log(
                `ℹ️ [DisconnectAgent] Agent ${agentIdStr} still has ${remainingSockets.length} remaining socket(s) - staying online`
              );
            }

            // Always broadcast updated agent list
            const agents = await User.find(
              { role: "agent", status: "approved" },
              { _id: 1, userName: 1, email: 1, role: 1, isOnline: 1 }
            ).lean();
            io.emit("agents-list-updated", { agents });

            // Broadcast connected agents list
            await broadcastConnectedAgentsList("agent-disconnected");
          }

          // ✅ Clear dedup when admin disconnects
          if (
            socket.data.role === "admin" ||
            socket.data.role === "superadmin"
          ) {
            for (const key of Array.from(recentViewerRequests.keys())) {
              if (key.startsWith(`${socket.data.userId}:`)) {
                recentViewerRequests.delete(key);
                console.log(
                  `🔥 [AdminDisconnected] Cleared dedupe key: ${key}`
                );
              }
            }
          }
        } catch (err) {
          console.error("Error handling disconnect:", err);
        }
      });

      // ===================== SCREEN SHARING EVENTS =====================

      // Handle screen share started event
      socket.on("screen-share-started", ({ startTime, mode }) => {
        console.log(
          `[ScreenShare] User ${socket.data.userId} started ${mode} sharing`
        );

        const user = {
          userId: socket.data.userId,
          socketId: socket.id,
          startTime,
          mode: mode || "screen",
        };

        activeScreenSharers.set(socket.data.userId, user);

        // Broadcast to all connected clients
        io.emit("user-started-sharing", {
          userId: socket.data.userId,
          socketId: socket.id,
          userName: socket.data.userName || "User",
          startTime,
          mode: mode || "screen",
        });

        // Broadcast updated active sharers list
        const sharersArray = Array.from(activeScreenSharers.values());
        io.emit("active-sharers-updated", { sharers: sharersArray });
      });

      // Handle viewer requesting screen share stream
      socket.on("request-screen-share-stream", ({ fromUserId }) => {
        console.log(
          `[ScreenShare] Viewer userId=${socket.data.userId} requesting screen stream from agent userId=${fromUserId}`
        );

        // Only allow admins/superadmins to request other users' screen streams
        if (
          !(socket.data.role === "admin" || socket.data.role === "superadmin")
        ) {
          console.warn(
            `[ScreenShare] Denying screen stream request from non-admin ${socket.data.userId}`
          );
          socket.emit("request-denied", {
            reason: "not-authorized-to-view-screen",
          });
          return;
        }

        // Send request to agent via their user ID room (survives socket reconnects)
        console.log(
          `[ScreenShare] Routing request to agent room: ${fromUserId}`
        );
        io.to(fromUserId.toString()).emit("request-screen-share-stream", {
          viewerUserId: socket.data.userId,
          timestamp: Date.now(),
        });
      });

      // Sharer sends offer to viewer
      socket.on("screen-share-offer", ({ toUserId, sdp }) => {
        console.log(
          `[ScreenShare] Screen share offer from agent userId=${socket.data.userId} to viewer userId=${toUserId}`
        );
        // Emit to viewer via their user ID room (survives reconnects)
        if (toUserId) {
          io.to(toUserId.toString()).emit("screen-share-offer", {
            sharerUserId: socket.data.userId,
            sdp,
          });
          console.log(
            `[ScreenShare] Offer emitted to viewer userId=${toUserId}`
          );
        } else {
          console.error(
            `[ScreenShare] No toUserId provided in offer from agent ${socket.data.userId}`
          );
        }
      });

      // Viewer sends answer to sharer
      socket.on("screen-share-answer", ({ toUserId, sdp }) => {
        console.log(
          `[ScreenShare] Screen share answer from viewer userId=${socket.data.userId} to agent userId=${toUserId}`
        );
        // Emit to sharer via their user ID room (survives reconnects)
        if (toUserId) {
          io.to(toUserId.toString()).emit("screen-share-answer", {
            viewerUserId: socket.data.userId,
            sdp,
          });
          console.log(
            `[ScreenShare] Answer emitted to agent userId=${toUserId}`
          );
        } else {
          console.error(
            `[ScreenShare] No toUserId provided in answer from viewer ${socket.data.userId}`
          );
        }
      });

      // ICE candidate exchange for screen share
      socket.on("screen-share-ice-candidate", ({ toUserId, candidate }) => {
        console.log(
          `[ScreenShare] ICE candidate from userId=${socket.data.userId} to userId=${toUserId}`
        );
        if (toUserId) {
          io.to(toUserId.toString()).emit("screen-share-ice-candidate", {
            fromUserId: socket.data.userId,
            candidate,
          });
        }
      });

      // Handle screen share stopped event
      socket.on("screen-share-stopped-user", ({ stoppedAt, mode }) => {
        console.log(
          `[ScreenShare] User ${socket.data.userId} stopped ${
            mode || "screen"
          } sharing`
        );

        activeScreenSharers.delete(socket.data.userId);

        io.emit("user-stopped-sharing", {
          userId: socket.data.userId,
          socketId: socket.id,
          stoppedAt,
          mode: mode || "screen",
        });

        // Broadcast updated active sharers list
        const sharersArray = Array.from(activeScreenSharers.values());
        io.emit("active-sharers-updated", { sharers: sharersArray });
      });

      // Handle screen share restoration after page refresh
      socket.on("screen-share-restored", ({ timestamp, mode }) => {
        console.log(
          `[ScreenShare] User ${socket.data.userId} restored ${
            mode || "screen"
          } sharing after refresh`
        );

        const user = {
          userId: socket.data.userId,
          socketId: socket.id,
          startTime: timestamp,
          mode: mode || "screen",
        };

        activeScreenSharers.set(socket.data.userId, user);

        // Broadcast to all connected clients
        io.emit("user-started-sharing", {
          userId: socket.data.userId,
          socketId: socket.id,
          userName: socket.data.userName || "User",
          startTime: timestamp,
          mode: mode || "screen",
        });

        const sharersArray = Array.from(activeScreenSharers.values());
        io.emit("active-sharers-updated", { sharers: sharersArray });
      });

      // Get current active sharers list
      socket.on("get-active-sharers", () => {
        const sharersArray = Array.from(activeScreenSharers.values());
        socket.emit("active-sharers-updated", { sharers: sharersArray });
      });

      // ===================== END SCREEN SHARING EVENTS =====================
    } catch (err) {
      console.error("realTime error:", err);
    }
  });
}
