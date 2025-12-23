// /client/src/pages/AdminHome.jsx
import React, { useEffect, useRef, useState } from "react";
import Layout from "../../../components/Layout/Layout";
import SideBar from "../../../components/SideBar.jsx";
import { useAuth } from "../../../context/Auth.jsx";
import { getSocket } from "../../../context/SocketContext.jsx";
import { createPeerConnection } from "../../Services/Webrtc.jsx";
import VideoTile from "../../Services/VideoTile.jsx";
import ScreenShareDropdown from "../../../components/ScreenShareDropdown.jsx";
// import ScreenShareButton from "../../../components/ScreenShareButton.jsx";
// import ScreenShareViewer from "../../../components/ScreenShareViewer.jsx";
import { useShareScreen } from "../../../context/ShareScreenContext.jsx";

const AdminHome = () => {
  const { auth } = useAuth();
  const socket = getSocket();

  const userRole = auth?.user?.role;

  const [agentIdInput, setAgentIdInput] = useState("");
  // Persist agentList in sessionStorage so returning to AdminHome can recover previously requested agents
  const [agentList, setAgentList] = useState(() => {
    try {
      const raw = sessionStorage.getItem("admin_agent_list");
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.warn("Failed to parse stored admin_agent_list", err);
      return [];
    }
  }); // array of agent ids we want to view
  const [agentsData, setAgentsData] = useState([]); // list of all agents with isOnline etc
  // use shared screen context for persistent streams/PCs
  const {
    remoteStreams,
    addRemoteStream,
    removeRemoteStream,
    pcMapRef,
    setPC,
    getPC,
    closePC,
    clearAll,
  } = useShareScreen();
  // pcMapRef acts as map of peerKey -> RTCPeerConnection
  // remoteStreams is an object of peerKey -> { stream, fromAgentId, fromUserId }
  // Note: pcRefs is an alias for pcMapRef for backward compat, so we don't need to list both
  const pcRefs = pcMapRef;
  const pendingRequestsRef = useRef(new Set()); // track agents we've already requested in this session
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [remoteStreams]);

  // ✅ FIXED: Clean up all connections and notify agents BEFORE page unloads/refreshes
  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log(
        "🔄 Admin page unloading, cleaning up and notifying agents..."
      );

      // Collect agent IDs to notify
      const agentIdsToNotify = Object.values(remoteStreams).map(
        (item) => item.fromAgentId
      );

      // Close all PCs and clear shared state
      try {
        clearAll();
      } catch (err) {
        console.warn("Error during clearAll:", err);
      }

      // Notify agents so they can clean up stale admin references
      if (socket && socket.connected && agentIdsToNotify.length > 0) {
        socket.emit("admin-disconnecting", {
          adminSocketId: socket.id,
          adminId: auth?.user?._id || null,
          agentIds: agentIdsToNotify,
          reason: "page-refresh-or-close",
        });
        console.log("✅ Notified agents of disconnect:", agentIdsToNotify);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [socket, remoteStreams, auth?.user?._id, clearAll]);

  useEffect(() => {
    if (!socket) return;

    socket.on("offer", async ({ fromSocketId, fromUserId, fromAgentId, sdp }) => {
      const peerKey = fromAgentId || fromUserId || fromSocketId;
      console.log(
        "admin got offer from peer",
        peerKey,
        "(socket:", fromSocketId, ") agentId",
        fromAgentId,
        "userId",
        fromUserId
      );

      try {
        // ✅ FIXED: Clean up stale PC if exists
        if (pcRefs.current[peerKey]) {
          console.log("🔄 Cleaning up stale PC for agent", fromAgentId || peerKey);
          const oldPC = pcRefs.current[peerKey];
          oldPC.close();
          oldPC.getSenders().forEach((sender) => {
            if (sender.track) {
              sender.track.stop();
            }
          });
          delete pcRefs.current[peerKey];
        }

        const iceServers = import.meta.env.VITE_ICE_SERVERS
          ? JSON.parse(import.meta.env.VITE_ICE_SERVERS)
          : [{ urls: "stun:stun.l.google.com:19302" }];
        const pc = createPeerConnection({
          iceServers,
          onTrack: (event) => {
            const [stream] = event.streams;
            addRemoteStream(peerKey, { stream, fromAgentId, fromUserId });
          },
          onIceCandidate: (candidate) => {
            // Prefer addressing the agent by stable userId (fromAgentId)
            socket.emit("ice-candidate", {
              toSocketId: fromAgentId || fromUserId || fromSocketId,
              candidate,
            });
          },
        });

        // ✅ FIXED: Add connection state change listener
        pc.onconnectionstatechange = () => {
          const state = pc.connectionState;
          console.log(
            "🔌 Admin PC connection state changed to:",
            state,
            "for agent",
            fromAgentId
          );
          if (
            state === "closed" ||
            state === "failed" ||
            state === "disconnected"
          ) {
            console.log(
              "📤 Removing admin PC for agent",
              fromAgentId,
              "due to state:",
              state
            );
            if (pcRefs.current[peerKey]) {
                delete pcRefs.current[peerKey];
              }
              removeRemoteStream(peerKey);
            // ✅ FIXED: Notify backend to clear dedup key for immediate rejoin
            if (socket) {
              socket.emit("admin-pc-closed", {
                  adminSocketId: socket.id,
                  adminId: auth?.user?._id || null,
                  agentId: fromAgentId || fromUserId || peerKey,
                connectionState: state,
              });
              console.log(
                "📤 Notified backend that admin PC closed for agent",
                  fromAgentId || fromUserId || peerKey
              );
            }
          }
        };

        // store reference keyed by stable agent id (or fallback to socket id)
        setPC(peerKey, pc);

        await pc.setRemoteDescription(new RTCSessionDescription(sdp));

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit("answer", {
          toSocketId: fromAgentId || fromUserId || fromSocketId,
          adminId: auth?.user?._id || null,
          sdp: pc.localDescription,
        });
      } catch (err) {
        console.error("admin error handling offer:", err);
      }
    });

    socket.on("ice-candidate", async ({ fromSocketId, fromUserId, candidate }) => {
      try {
        const peerKey = fromUserId || fromSocketId;
        const pc = pcMapRef.current[peerKey] || getPC(peerKey);
        if (!pc)
          return console.warn(
            "No pc found for ICE candidate from",
            peerKey
          );
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.warn("Error adding ICE candidate (admin):", err);
      }
    });

    socket.on("request-denied", ({ reason }) => {
      alert("View request denied: " + reason);
    });

    socket.on("disconnect", () => {
      console.log("⚠️ Socket disconnected, cleaning up all PCs");
      try {
        clearAll();
      } catch (err) {
        console.warn("Error during clearAll on disconnect:", err);
      }
    });

    return () => {
      socket.off("offer");
      socket.off("ice-candidate");
      socket.off("request-denied");
      socket.off("disconnect");
    };
  }, [socket, addRemoteStream, setPC, getPC, removeRemoteStream, clearAll, auth?.user?._id, pcMapRef]); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist agentList whenever it changes so we can recover when AdminHome remounts
  useEffect(() => {
    try {
      sessionStorage.setItem("admin_agent_list", JSON.stringify(agentList || []));
    } catch (err) {
      console.warn("Failed to persist admin_agent_list", err);
    }
  }, [agentList]);

  // On mount (or when socket becomes available), try to recover previous agentList
  // and re-request view for each agent so shared streams are restored when admin returns.
  useEffect(() => {
    if (!socket) return;

    if (agentList && agentList.length > 0) {
      agentList.forEach((agentId) => {
        if (!pendingRequestsRef.current.has(agentId)) {
          pendingRequestsRef.current.add(agentId);
          console.log("Recovering view for stored agentId:", agentId);
          socket.emit("request-view", { agentId, reason: "admin-recover-session" });
          setTimeout(() => pendingRequestsRef.current.delete(agentId), 2000);
        }
      });
    }
  }, [socket, agentList]);

  const handleAddAgent = () => {
    const id = agentIdInput.trim();
    if (!id) return;
    if (agentList.includes(id)) return setAgentIdInput("");
    setAgentList((s) => [...s, id]);
    // auto-request view when adding agent id (debounced to prevent duplicates)
    if (socket && userRole === "admin") {
      // Check if we already requested this agent recently
      if (!pendingRequestsRef.current.has(id)) {
        console.log("auto-requesting view for agentId", id);
        pendingRequestsRef.current.add(id);
        socket.emit("request-view", {
          agentId: id,
          reason: "admin-auto-request",
        });
        // ✅ FIXED: Clear from pending set after 2s (matches backend dedup window + buffer)
        setTimeout(() => pendingRequestsRef.current.delete(id), 2000);
      }
    }
    setAgentIdInput("");
  };

  // Listen for agents list updates from server
  useEffect(() => {
    if (!socket) return;

    const handleAgentsList = ({ agents }) => {
      setAgentsData(agents || []);
    };

    socket.on("agents-list-updated", handleAgentsList);
    socket.on("agents-list", handleAgentsList);

    // request initial list
    socket.emit("get-agents-list");

    return () => {
      socket.off("agents-list-updated", handleAgentsList);
      socket.off("agents-list", handleAgentsList);
    };
  }, [socket]);

  // ✅ NEW: Listen for connected agents list when admin reconnects or new agents join
  // This ensures admin automatically requests view for already-connected agents and new ones
  useEffect(() => {
    if (!socket) return;
    console.log("Setting up listener for connected-agents-list");

    const handleConnectedAgentsList = ({ agents, reason }) => {
      console.log(
        `✅ [AdminReconnect] Received connected agents list (${agents?.length || 0} agents) - reason: ${reason}`
      );

      if (agents && Array.isArray(agents) && agents.length > 0) {
        // Auto-add all connected agents to agentList and request view
        agents.forEach((agent) => {
          const agentId = agent.agentId || agent.userId;
          if (agentId && !agentList.includes(agentId)) {
            console.log(`[AdminReconnect] Auto-adding agent ${agentId} for view`);
            setAgentList((prev) => {
              const newList = [...prev, agentId];
              console.log(`[AdminReconnect] Updated agentList: ${newList.length} agents`);
              return newList;
            });

            // Auto-request view for this agent if not recently pending
            if (socket && userRole === "admin" && !pendingRequestsRef.current.has(agentId)) {
              console.log(`[AdminReconnect] Auto-requesting view for agent ${agentId}`);
              pendingRequestsRef.current.add(agentId);
              socket.emit("request-view", {
                agentId,
                reason: "admin-reconnect-auto",
              });
              // Clear from pending after 2s
              setTimeout(() => {
                pendingRequestsRef.current.delete(agentId);
                console.log(`[AdminReconnect] Cleared pending for agent ${agentId}`);
              }, 2000);
            }
          }
        });
      }
    };

    socket.on("connected-agents-list", handleConnectedAgentsList);

    // ✅ NEW: Request fresh list from backend when component mounts
    // This ensures we get the latest list even if join event was processed before listener was attached
    console.log("Requesting fresh connected-agents-list from backend");
    socket.emit("get-connected-agents-list");

    return () => {
      socket.off("connected-agents-list", handleConnectedAgentsList);
    };
  }, [socket, userRole, agentList]);

  const handleRequestView = () => {
    if (userRole !== "admin")
      return alert("Only superadmin can request agent cameras.");
    if (!agentList.length) return alert("Add at least one agentId to view.");

    agentList.forEach((agentId) => {
      // Only emit if not recently requested
      if (!pendingRequestsRef.current.has(agentId)) {
        console.log("requesting view for agentId", agentId);
        pendingRequestsRef.current.add(agentId);
        socket.emit("request-view", { agentId, reason: "superadmin-request" });
        // ✅ FIXED: Timeout matches backend dedup window
        setTimeout(() => pendingRequestsRef.current.delete(agentId), 2000);
      }
    });
  };

  const stopViewing = (peerKey) => {
    console.log("stopViewing peerKey is", peerKey);
    if (peerKey) {
      console.log("if condition")
      closePC(peerKey);

      // ✅ FIXED: Notify agent that admin stopped viewing
      const remoteStream = remoteStreams ? remoteStreams[peerKey] : null;
      if (remoteStream && (remoteStream.fromAgentId || remoteStream.fromUserId) && socket) {
        const agentIdToNotify = remoteStream.fromAgentId || remoteStream.fromUserId || peerKey;
        socket.emit("admin-stopped-viewing", {
          adminSocketId: socket.id,
          adminId: auth?.user?._id || null,
          agentId: agentIdToNotify,
        });
        // ✅ FIXED: Also clear dedup key so admin can immediately rejoin
        socket.emit("admin-pc-closed", {
          adminSocketId: socket.id,
          adminId: auth?.user?._id || null,
          agentId: agentIdToNotify,
          connectionState: "closed",
        });
        console.log(
          "📤 Notified agent",
          agentIdToNotify,
          "that admin stopped viewing and cleared dedup"
        );
      }

      removeRemoteStream(peerKey);
    } else {
      console.log("else condition");
      // stop all
      Object.entries(remoteStreams || {}).forEach(([peerKeyIter, { fromAgentId, fromUserId }]) => {
        closePC(peerKeyIter);
        // ✅ FIXED: Notify agents and clear dedup
        if (socket) {
          const agentIdToNotify = fromAgentId || fromUserId || peerKeyIter;
          socket.emit("admin-stopped-viewing", {
            adminSocketId: socket.id,
            adminId: auth?.user?._id || null,
            agentId: agentIdToNotify,
          });
          socket.emit("admin-pc-closed", {
            adminSocketId: socket.id,
            adminId: auth?.user?._id || null,
            agentId: agentIdToNotify,
            connectionState: "closed",
          });
          console.log(
            "📤 Notified agent",
            agentIdToNotify,
            "that admin stopped viewing and cleared dedup"
          );
        }
      });
      try {
        clearAll();
      } catch (err) {
        console.warn("Error clearing all during stopViewing all:", err);
      }
    }
  };

  return (
    <Layout>
      <main className="crm_all_body d-flex">
        <SideBar />
        <section
          className=""
          ref={scrollRef}
          style={{
            width: "90%",
            margin: "auto",
            overflowY: "auto",
            scrollBehavior: "smooth",
            height: "90vh", // important: container must have fixed height
          }}
        >
          <div className="header_crm flex_props justify-content-between">
            <p className="crm_title">Admin Dashboard</p>
          </div>

          <div style={{ padding: 20 }}>
            
          

            {/* Screen Share Dropdown */}
            <ScreenShareDropdown
              onAgentSelected={(agentId) => {
                if (!agentList.includes(agentId)) {
                  setAgentList((prev) => [...prev, agentId]);
                }
              }}
              onScreenShareStarted={(agentId) => {
                console.log(`Screen share initiated for agent: ${agentId}`);
              }}
              selectedAgents={agentList}
              remoteStreams={remoteStreams}
            />

            {/* Original manual input / list */}
            <div style={{ marginBottom: 12, marginTop: 20 }}>
              <h3>Manual Agent Addition (Optional)</h3>
              <input
                value={agentIdInput}
                onChange={(e) => setAgentIdInput(e.target.value)}
                placeholder="enter agentId and press Add"
              />
              <button onClick={handleAddAgent}>Add</button>
              <button onClick={handleRequestView}>
                Request View (superadmin)
              </button>
              <button onClick={() => stopViewing()}>Stop All</button>
            </div>

            {/* Live Agents Panel */}
            <div
              style={{ marginTop: 12, padding: 12, border: "1px solid #eee" }}
            >
              <h4>
                All Agents (live)<span className="text-success">*</span>
              </h4>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {agentsData && agentsData.length ? (
                  agentsData.map((a) => (
                    <div
                      key={a._id}
                      style={{
                        border: "1px solid #ddd",
                        padding: 8,
                        minWidth: 200,
                      }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 600 }}>
                        {a.userName || a.email || a._id}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: a.isOnline ? "green" : "gray",
                        }}
                      >
                        {a.isOnline ? "Online" : "Offline"}
                      </div>
                      <div style={{ marginTop: 6, display: "flex", gap: 6 }}>
                       

                        <button
                          onClick={() => {
                            console.clear();
                            console.log("=== Request View Debug Log ===");

                            // 1) Check whole agentList
                            console.log("Initial agentList:", agentList);
                            console.log("Clicked agent ID:", a._id);

                            // 2) Check if ID already exists
                            const alreadyExists = agentList.includes(a._id);
                            console.log("Already in agentList?", alreadyExists);

                            // 3) Add to agentList (debug)
                            if (!alreadyExists) {
                              console.log("Adding agent to agentList...");
                              setAgentList((prev) => {
                                console.log("Previous list:", prev);
                                const newList = [...prev, a._id];
                                console.log("New agentList:", newList);
                                return newList;
                              });
                            } else {
                              console.log("Skipping: Agent already in list");
                            }

                            // 4) Socket & pendingRequests check
                            console.log("Socket available?", !!socket);
                            console.log(
                              "pendingRequestsRef before:",
                              Array.from(pendingRequestsRef.current)
                            );

                            const hasPending = pendingRequestsRef.current.has(
                              a._id
                            );
                            console.log("Already pending?", hasPending);

                            if (socket && !hasPending) {
                              console.log(
                                "Adding to pendingRequestsRef & emitting socket event..."
                              );

                              pendingRequestsRef.current.add(a._id);

                              // 5) Emit event
                              console.log("Emitting: request-view", {
                                agentId: a._id,
                                reason: "admin-panel-request",
                              });

                              socket.emit("request-view", {
                                agentId: a._id,
                                reason: "admin-panel-request",
                              });

                              // 6) Remove after timeout
                              setTimeout(() => {
                                console.log(
                                  "Timeout ended. Removing from pendingRequestsRef:",
                                  a._id
                                );
                                pendingRequestsRef.current.delete(a._id);
                                console.log(
                                  "pendingRequestsRef after deletion:",
                                  Array.from(pendingRequestsRef.current)
                                );
                              }, 2000);
                            } else {
                              console.log(
                                "Skipping socket emit (reason: no socket or already pending)"
                              );
                            }

                            console.log("=== END DEBUG ===");
                          }}
                        >
                          Request View
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ color: "#666" }}>No agents found</div>
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {agentList.map((id) => (
                <div key={id} style={{ border: "1px solid #ddd", padding: 6 }}>
                  <div style={{ fontSize: 12 }}>AgentId: {id}</div>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: 20,
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              {Object.entries(remoteStreams).map(([peerKey, { stream, fromAgentId, fromUserId }]) => (
                <div key={peerKey} style={{ minWidth: 240 }}>
                  <VideoTile
                    stream={stream}
                    muted={false}
                    label={`Agent ${fromAgentId || fromUserId || peerKey}`}
                  />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => stopViewing(peerKey)}>Stop</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default AdminHome;
