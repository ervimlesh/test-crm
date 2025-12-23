
import { io } from "socket.io-client";

let socket = null;
const eventListeners = {};

export function getSocket() {
  if (socket) return socket;

  try {
    const authRaw = localStorage.getItem("auth");
    const auth = authRaw ? JSON.parse(authRaw) : null;
    const userId = auth?.user?._id;
    const role = auth?.user?.role;
    const token = auth?.token || null; 

    if (!userId) {
      console.warn("getSocket: no userId found in localStorage 'auth' object.");
      return null;
    }

    socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:8000", {
      auth: {
        userId,
        role,
        token,
        agentId: role === "agent" ? userId : undefined,
      },
      transports: ["websocket"],
      reconnection: true,
    });

    // Immediate listeners to capture early emissions
    socket.on("connected-agents-list", (data) => {
      console.log(
        `[Socket] Received connected-agents-list (${data?.agents?.length || 0} agents)`
      );
      eventListeners.connectedAgentsList = data;
      if (typeof eventListeners.onConnectedAgentsList === "function") {
        eventListeners.onConnectedAgentsList(data);
      }
    });

    // When socket connects or reconnects, inform server and notify others if agent
    socket.on("connect", () => {
      console.log("socket connected", socket.id, { userId, role });

      // Rejoin from client-side (rooms/namespaces handled by server)
      socket.emit("join", {
        userId,
        role,
        agentId: role === "agent" ? userId : undefined,
      });

      // For agents: notify server of reconnection and provide the new socket id
      if (role === "agent") {
        const payload = {
          agentId: userId,
          socketId: socket.id,
          timestamp: Date.now(),
        };
        console.log("Emitting agent-reconnected", payload);
        // Inform server so it can broadcast this update to connected users/admins
        socket.emit("agent-reconnected", payload);

        // Backwards-compat: also emit agent-ready if server expects it
        setTimeout(() => {
          socket.emit("agent-ready", { agentId: userId });
        }, 500);
      }
    });

    socket.on("connect_error", (err) => {
      console.error("socket connect_error", err && err.message ? err.message : err);
    });

    return socket;
  } catch (err) {
    console.error("getSocket error:", err);
    return null;
  }
}

// Register a listener for connected-agents-list and notify immediately if cached
export function onConnectedAgentsList(callback) {
  eventListeners.onConnectedAgentsList = callback;
  if (eventListeners.connectedAgentsList) {
    try {
      callback(eventListeners.connectedAgentsList);
    } catch (err) {
      console.error("onConnectedAgentsList callback error:", err);
    }
  }
}

// Helper to listen for agent-reconnected events (others will receive when server broadcasts)
export function onAgentReconnected(callback) {
  if (typeof callback !== "function") return;
  eventListeners.onAgentReconnected = callback;
  // If socket already exists, attach listener immediately
  if (socket) {
    socket.on("agent-reconnected", callback);
  }
}

export function offAgentReconnected(callback) {
  if (socket && typeof callback === "function") {
    socket.off("agent-reconnected", callback);
  }
  if (eventListeners.onAgentReconnected === callback) {
    delete eventListeners.onAgentReconnected;
  }
}

// Utility to ensure server receives the current agent mapping; returns socket or null
export function initSocket() {
  return getSocket();
}

export default {
  getSocket,
  initSocket,
  onConnectedAgentsList,
  onAgentReconnected,
  offAgentReconnected,
};
