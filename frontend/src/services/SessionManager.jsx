/**
 * Frontend Session Manager
 * Manages session persistence across page refreshes
 * Handles session restoration and state management
 */

const SESSION_STORAGE_KEY = "crm_active_session";
const SESSIONS_STORAGE_KEY = "crm_available_sessions";

class FrontendSessionManager {
  constructor() {
    this.currentSession = null;
    this.socket = null;
    this.listeners = {};
  }

  /**
   * Initialize with socket instance
   */
  init(socket) {
    this.socket = socket;
    this.restoreSession();
    this.setupSocketListeners();
  }

  /**
   * Restore session from localStorage
   */
  restoreSession() {
    try {
      const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (stored) {
        const session = JSON.parse(stored);
        this.currentSession = session;
        console.log(`[SessionManager] Restored session: ${session.sessionId}`);
        this.emit("session-restored", session);
      }
    } catch (error) {
      console.error("[SessionManager] Error restoring session:", error);
    }
  }

  /**
   * Save current session
   */
  saveSession(session) {
    try {
      this.currentSession = session;
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      console.log(`[SessionManager] Saved session: ${session.sessionId}`);
    } catch (error) {
      console.error("[SessionManager] Error saving session:", error);
    }
  }

  /**
   * Save available sessions
   */
  saveAvailableSessions(sessions) {
    try {
      sessionStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
      console.log(`[SessionManager] Saved ${sessions.length} available sessions`);
    } catch (error) {
      console.error("[SessionManager] Error saving available sessions:", error);
    }
  }

  /**
   * Get available sessions
   */
  getAvailableSessions() {
    try {
      const stored = sessionStorage.getItem(SESSIONS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("[SessionManager] Error retrieving available sessions:", error);
      return [];
    }
  }

  /**
   * Setup socket listeners for session events
   */
  setupSocketListeners() {
    if (!this.socket) return;

    this.socket.on("session-created", ({ sessionId, session }) => {
      console.log(`[SessionManager] Session created: ${sessionId}`);
      this.saveSession({ ...session, sessionId });
      this.emit("session-created", { sessionId, session });
    });

    this.socket.on("session-restored", ({ sessionId, session }) => {
      console.log(`[SessionManager] Session restored: ${sessionId}`);
      this.saveSession({ ...session, sessionId });
      this.emit("session-restored", { sessionId, session });
    });

    this.socket.on("previous-sessions-available", ({ sessions }) => {
      console.log(`[SessionManager] ${sessions.length} previous sessions available`);
      this.saveAvailableSessions(sessions);
      this.emit("previous-sessions-available", sessions);
    });

    this.socket.on("session-accepted", ({ sessionId, agentId, agentSocketId }) => {
      console.log(`[SessionManager] Session accepted: ${sessionId}`);
      if (this.currentSession) {
        this.currentSession.status = "active";
        this.saveSession(this.currentSession);
      }
      this.emit("session-accepted", { sessionId, agentId, agentSocketId });
    });

    this.socket.on("session-screen-share-started", ({ sessionId, userId, mode }) => {
      console.log(`[SessionManager] Screen share started in session ${sessionId}`);
      if (this.currentSession && this.currentSession.sessionId === sessionId) {
        this.currentSession.screenSharing = {
          isActive: true,
          mode,
          sharerUserId: userId,
        };
        this.saveSession(this.currentSession);
      }
      this.emit("session-screen-share-started", { sessionId, userId, mode });
    });

    this.socket.on("session-screen-share-stopped", ({ sessionId, userId, mode }) => {
      console.log(`[SessionManager] Screen share stopped in session ${sessionId}`);
      if (this.currentSession && this.currentSession.sessionId === sessionId) {
        this.currentSession.screenSharing = {
          isActive: false,
          mode: null,
          sharerUserId: null,
        };
        this.saveSession(this.currentSession);
      }
      this.emit("session-screen-share-stopped", { sessionId, userId, mode });
    });

    this.socket.on("session-ended", ({ sessionId }) => {
      console.log(`[SessionManager] Session ended: ${sessionId}`);
      this.clearSession();
      this.emit("session-ended", { sessionId });
    });

    this.socket.on("session-error", ({ message }) => {
      console.error(`[SessionManager] Session error: ${message}`);
      this.emit("session-error", { message });
    });
  }

  /**
   * Create or restore session
   */
  async createOrRestoreSession(agentId, requestType = "new") {
    if (!this.socket || !this.socket.connected) {
      console.warn("[SessionManager] Socket not connected");
      return false;
    }

    this.socket.emit("create-or-restore-session", {
      agentId,
      requestType,
    });

    return true;
  }

  /**
   * Accept session (agent side)
   */
  async acceptSession(sessionId) {
    if (!this.socket || !this.socket.connected) {
      console.warn("[SessionManager] Socket not connected");
      return false;
    }

    this.socket.emit("accept-session", { sessionId });
    return true;
  }

  /**
   * Start screen sharing in session
   */
  async startScreenSharingInSession(sessionId, mode = "screen") {
    if (!this.socket || !this.socket.connected) {
      console.warn("[SessionManager] Socket not connected");
      return false;
    }

    this.socket.emit("session-screen-share-started", {
      sessionId,
      mode,
    });

    return true;
  }

  /**
   * Stop screen sharing in session
   */
  async stopScreenSharingInSession(sessionId, mode = "screen") {
    if (!this.socket || !this.socket.connected) {
      console.warn("[SessionManager] Socket not connected");
      return false;
    }

    this.socket.emit("session-screen-share-stopped", {
      sessionId,
      mode,
    });

    return true;
  }

  /**
   * Save session state before refresh
   */
  async saveSessionState(sessionId, stateData) {
    if (!this.socket || !this.socket.connected) {
      console.warn("[SessionManager] Socket not connected");
      return false;
    }

    this.socket.emit("save-session-state", {
      sessionId,
      stateData,
    });

    return true;
  }

  /**
   * End session
   */
  async endSession(sessionId) {
    if (!this.socket || !this.socket.connected) {
      console.warn("[SessionManager] Socket not connected");
      return false;
    }

    this.socket.emit("end-session", { sessionId });
    this.clearSession();

    return true;
  }

  /**
   * Get current session
   */
  getCurrentSession() {
    return this.currentSession;
  }

  /**
   * Clear session
   */
  clearSession() {
    this.currentSession = null;
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (err) {
      console.warn("[SessionManager] Error clearing session:", err);
    }
  }

  /**
   * Event listener management
   */
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
    }
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback) => callback(data));
    }
  }
}

// Export singleton instance
export const sessionManager = new FrontendSessionManager();
export default FrontendSessionManager;
