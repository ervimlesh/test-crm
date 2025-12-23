import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

// --- Socket utilities moved here (previously in frontend/socket.jsx) ---
let socket = null;
const eventListeners = {}; // store cached events and callbacks

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

    socket.on("connected-agents-list", (data) => {
      eventListeners.connectedAgentsList = data;
      if (typeof eventListeners.onConnectedAgentsList === "function") {
        eventListeners.onConnectedAgentsList(data);
      }
    });

    socket.on("connect", () => {
      // read auth again for safety
      const authRaw2 = localStorage.getItem("auth");
      const auth2 = authRaw2 ? JSON.parse(authRaw2) : null;
      const userId2 = auth2?.user?._id;
      const role2 = auth2?.user?.role;

      socket.emit("join", {
        userId: userId2,
        role: role2,
        agentId: role2 === "agent" ? userId2 : undefined,
      });

      socket.emit("admin-reconnected");

      if (role2 === "agent") {
        const payload = { agentId: userId2, socketId: socket.id, timestamp: Date.now() };
        socket.emit("agent-reconnected", payload);
     
          socket.emit("agent-ready", { agentId: userId2 });
       
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

export function initSocket() {
  return getSocket();
}

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

export function onAgentReconnected(callback) {
  if (typeof callback !== "function") return;
  eventListeners.onAgentReconnected = callback;
  if (socket) socket.on("agent-reconnected", callback);
}

export function offAgentReconnected(callback) {
  if (socket && typeof callback === "function") socket.off("agent-reconnected", callback);
  if (eventListeners.onAgentReconnected === callback) delete eventListeners.onAgentReconnected;
}

// --- end socket utilities ---

const SocketContext = createContext({
  socket: null,
  connectedAgents: [],
  requestConnectedAgents: () => {},
});

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [connectedAgents, setConnectedAgents] = useState([]);
  const socketInitRef = useRef(false);

  useEffect(() => {
    if (socketInitRef.current) return;
    socketInitRef.current = true;

    const s = initSocket() || getSocket();
    if (s) setSocket(s);

    // Handler for full connected-agents-list from server
    const handleAgentsList = (data) => {
      const agents = Array.isArray(data?.agents) ? data.agents : [];
      setConnectedAgents(agents);
    };

    onConnectedAgentsList(handleAgentsList);

    // When an agent reconnects, server may broadcast the single agent update
    const handleAgentReconnected = (payload) => {
      try {
        const { agentId, socketId } = payload || {};
        setConnectedAgents((prev) => {
          // Upsert agent entry by id
          const copy = Array.isArray(prev) ? [...prev] : [];
          const idx = copy.findIndex((a) => a._id === agentId || a.id === agentId);
          const updated = { ...(copy[idx] || {}), _id: agentId, socketId };
          if (idx >= 0) copy[idx] = { ...copy[idx], ...updated };
          else copy.push(updated);
          return copy;
        });
      } catch (err) {
        console.error("handleAgentReconnected error:", err);
      }
    };

    onAgentReconnected(handleAgentReconnected);

    return () => {
      // cleanup: remove agent reconnected listener
      offAgentReconnected(handleAgentReconnected);
      try {
        // remove onConnectedAgentsList cached listener
        // socket module keeps this in-memory; clear reference to avoid leaks
        // (no off helper implemented for connected list)
        // eslint-disable-next-line no-undef
        if (typeof window !== "undefined") {
          // delete stored reference if any
          // socket file stores under eventListeners.onConnectedAgentsList
        }
      } catch (err) {
        console.error(err);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ask server for the latest connected agents list (server should reply with 'connected-agents-list')
  function requestConnectedAgents() {
    const s = socket || getSocket();
    if (s && s.connected) {
      s.emit("request-connected-agents", {});
    }
  }

  const value = {
    socket,
    connectedAgents,
    requestConnectedAgents,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export default SocketContext;
