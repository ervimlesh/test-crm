import React, { createContext, useContext, useEffect, useState } from "react";
import { getSocket } from "./SocketContext.jsx";
import { sessionManager } from "../services/SessionManager.jsx";

/**
 * SessionContext
 * Global context for managing video conferencing sessions
 * Provides session state, restoration, and management functionality
 */
const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const socket = getSocket();
  const [currentSession, setCurrentSession] = useState(null);
  const [availableSessions, setAvailableSessions] = useState([]);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [sessionError, setSessionError] = useState(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  useEffect(() => {
    // Initialize session manager
    sessionManager.init(socket);

    // Listen for session events
    sessionManager.on("session-created", ({ sessionId, session }) => {
      setCurrentSession({ ...session, sessionId });
      setSessionError(null);
    });

    sessionManager.on("session-restored", ({ sessionId, session }) => {
      setCurrentSession({ ...session, sessionId });
      setSessionError(null);
    });

    sessionManager.on("previous-sessions-available", (sessions) => {
      setAvailableSessions(sessions || []);
    });

    sessionManager.on("session-accepted", ({ sessionId, agentId }) => {
      setCurrentSession((prev) => ({
        ...prev,
        status: "active",
        agentId,
      }));
    });

    sessionManager.on("session-screen-share-started", ({ sessionId, userId, mode }) => {
      setCurrentSession((prev) => ({
        ...prev,
        screenSharing: {
          isActive: true,
          mode,
          sharerUserId: userId,
        },
      }));
      setIsScreenSharing(true);
    });

    sessionManager.on("session-screen-share-stopped", ({ sessionId }) => {
      setCurrentSession((prev) => ({
        ...prev,
        screenSharing: {
          isActive: false,
          mode: null,
          sharerUserId: null,
        },
      }));
      setIsScreenSharing(false);
    });

    sessionManager.on("session-ended", ({ sessionId }) => {
      setCurrentSession(null);
      setAvailableSessions([]);
    });

    sessionManager.on("session-error", ({ message }) => {
      setSessionError(message);
    });

    // Restore session if available
    const restored = sessionManager.getCurrentSession();
    if (restored) {
      setCurrentSession(restored);
    }

    return () => {
      // Cleanup listeners
      sessionManager.off("session-created", null);
      sessionManager.off("session-restored", null);
      sessionManager.off("previous-sessions-available", null);
      sessionManager.off("session-accepted", null);
      sessionManager.off("session-ended", null);
      sessionManager.off("session-error", null);
    };
  }, [socket]);

  const createOrRestoreSession = async (agentId, requestType = "new") => {
    setSessionLoading(true);
    setSessionError(null);
    try {
      const success = await sessionManager.createOrRestoreSession(agentId, requestType);
      if (!success) {
        setSessionError("Failed to create or restore session");
      }
    } catch (err) {
      setSessionError(err.message);
    } finally {
      setSessionLoading(false);
    }
  };

  const acceptSession = async (sessionId) => {
    try {
      const success = await sessionManager.acceptSession(sessionId);
      if (!success) {
        setSessionError("Failed to accept session");
      }
    } catch (err) {
      setSessionError(err.message);
    }
  };

  const startScreenSharingInSession = async (mode = "screen") => {
    if (!currentSession) return false;
    try {
      const success = await sessionManager.startScreenSharingInSession(currentSession.sessionId, mode);
      if (!success) {
        setSessionError("Failed to start screen sharing");
      }
      return success;
    } catch (err) {
      setSessionError(err.message);
      return false;
    }
  };

  const stopScreenSharingInSession = async (mode = "screen") => {
    if (!currentSession) return false;
    try {
      const success = await sessionManager.stopScreenSharingInSession(currentSession.sessionId, mode);
      if (!success) {
        setSessionError("Failed to stop screen sharing");
      }
      return success;
    } catch (err) {
      setSessionError(err.message);
      return false;
    }
  };

  const saveSessionState = async (stateData) => {
    if (!currentSession) return false;
    try {
      const success = await sessionManager.saveSessionState(currentSession.sessionId, stateData);
      return success;
    } catch (err) {
      console.warn("Error saving session state:", err);
      return false;
    }
  };

  const endSession = async () => {
    if (!currentSession) return false;
    try {
      const success = await sessionManager.endSession(currentSession.sessionId);
      if (success) {
        setCurrentSession(null);
        setAvailableSessions([]);
      }
      return success;
    } catch (err) {
      setSessionError(err.message);
      return false;
    }
  };

  const restorePreviousSession = async (session) => {
    try {
      await createOrRestoreSession(session.agentId, "restore");
    } catch (err) {
      setSessionError(err.message);
    }
  };

  const value = {
    currentSession,
    availableSessions,
    sessionLoading,
    sessionError,
    isScreenSharing,
    createOrRestoreSession,
    acceptSession,
    startScreenSharingInSession,
    stopScreenSharingInSession,
    saveSessionState,
    endSession,
    restorePreviousSession,
    clearError: () => setSessionError(null),
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return context;
};
