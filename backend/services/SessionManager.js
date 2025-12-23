import ActiveSession from "../models/ActiveSession.js";
import { v4 as uuidv4 } from "uuid";

class SessionManager {
  /**
   * Create a new active session between admin and agent
   */
  static async createSession(adminId, agentId) {
    try {
      const sessionId = `session_${uuidv4()}`;

      const session = new ActiveSession({
        sessionId,
        adminId,
        agentId,
        status: "active",
        startedAt: new Date(),
        lastActivityAt: new Date(),
      });

      await session.save();
      console.log(
        `✅ [SessionManager] Created session ${sessionId} for admin ${adminId} and agent ${agentId}`
      );

      return session;
    } catch (error) {
      console.error("[SessionManager] Error creating session:", error);
      throw error;
    }
  }

  /**
   * Get active session between admin and agent
   */
  static async getSession(adminId, agentId) {
    try {
      const session = await ActiveSession.findOne({
        adminId,
        agentId,
        status: { $in: ["active", "paused", "screen-sharing"] },
      }).lean();

      return session;
    } catch (error) {
      console.error("[SessionManager] Error fetching session:", error);
      return null;
    }
  }

  /**
   * Get session by ID
   */
  static async getSessionById(sessionId) {
    try {
      const session = await ActiveSession.findOne({ sessionId }).lean();
      return session;
    } catch (error) {
      console.error("[SessionManager] Error fetching session by ID:", error);
      return null;
    }
  }

  /**
   * Get all active sessions for admin
   */
  static async getAdminActiveSessions(adminId) {
    try {
      const sessions = await ActiveSession.find({
        adminId,
        status: { $in: ["active", "paused", "screen-sharing"] },
      })
        .populate("agentId", "_id userName email")
        .lean();

      return sessions;
    } catch (error) {
      console.error("[SessionManager] Error fetching admin sessions:", error);
      return [];
    }
  }

  /**
   * Get all active sessions for agent
   */
  static async getAgentActiveSessions(agentId) {
    try {
      const sessions = await ActiveSession.find({
        agentId,
        status: { $in: ["active", "paused", "screen-sharing"] },
      })
        .populate("adminId", "_id userName email")
        .lean();

      return sessions;
    } catch (error) {
      console.error("[SessionManager] Error fetching agent sessions:", error);
      return [];
    }
  }

  /**
   * Update session socket IDs
   */
  static async updateSessionSockets(sessionId, adminSocketId, agentSocketId) {
    try {
      const session = await ActiveSession.findOneAndUpdate(
        { sessionId },
        {
          ...(adminSocketId && { adminSocketId }),
          ...(agentSocketId && { agentSocketId }),
          lastActivityAt: new Date(),
        },
        { new: true }
      );

      if (session) {
        console.log(
          `✅ [SessionManager] Updated sockets for session ${sessionId}`
        );
      }

      return session;
    } catch (error) {
      console.error("[SessionManager] Error updating session sockets:", error);
      return null;
    }
  }

  /**
   * Update session status
   */
  static async updateSessionStatus(sessionId, status) {
    try {
      const session = await ActiveSession.findOneAndUpdate(
        { sessionId },
        {
          status,
          lastActivityAt: new Date(),
        },
        { new: true }
      );

      console.log(
        `✅ [SessionManager] Updated session ${sessionId} status to ${status}`
      );
      return session;
    } catch (error) {
      console.error("[SessionManager] Error updating session status:", error);
      return null;
    }
  }

  /**
   * Update screen sharing state
   */
  static async updateScreenSharingState(sessionId, screenSharingData) {
    try {
      const session = await ActiveSession.findOneAndUpdate(
        { sessionId },
        {
          screenSharing: screenSharingData,
          status: screenSharingData.isActive ? "screen-sharing" : "active",
          lastActivityAt: new Date(),
        },
        { new: true }
      );

      console.log(
        `✅ [SessionManager] Updated screen sharing for session ${sessionId}`
      );
      return session;
    } catch (error) {
      console.error(
        "[SessionManager] Error updating screen sharing state:",
        error
      );
      return null;
    }
  }

  /**
   * Save last known state (for recovery after refresh)
   */
  static async saveSessionState(sessionId, stateData) {
    try {
      const session = await ActiveSession.findOneAndUpdate(
        { sessionId },
        {
          lastKnownState: stateData,
          lastActivityAt: new Date(),
        },
        { new: true }
      );

      return session;
    } catch (error) {
      console.error("[SessionManager] Error saving session state:", error);
      return null;
    }
  }

  /**
   * End session
   */
  static async endSession(sessionId) {
    try {
      const session = await ActiveSession.findOneAndUpdate(
        { sessionId },
        {
          status: "ended",
          endedAt: new Date(),
        },
        { new: true }
      );

      console.log(`✅ [SessionManager] Ended session ${sessionId}`);
      return session;
    } catch (error) {
      console.error("[SessionManager] Error ending session:", error);
      return null;
    }
  }

  /**
   * Add message to session
   */
  static async addMessage(sessionId, senderId, senderRole, message) {
    try {
      const session = await ActiveSession.findOneAndUpdate(
        { sessionId },
        {
          $push: {
            messages: {
              senderId,
              senderRole,
              message,
              timestamp: new Date(),
            },
          },
          lastActivityAt: new Date(),
        },
        { new: true }
      );

      return session;
    } catch (error) {
      console.error("[SessionManager] Error adding message:", error);
      return null;
    }
  }

  /**
   * Update connection metrics
   */
  static async updateConnectionMetrics(sessionId, metrics) {
    try {
      const session = await ActiveSession.findOneAndUpdate(
        { sessionId },
        {
          connectionMetrics: {
            ...metrics,
            lastMeasuredAt: new Date(),
          },
          lastActivityAt: new Date(),
        },
        { new: true }
      );

      return session;
    } catch (error) {
      console.error("[SessionManager] Error updating metrics:", error);
      return null;
    }
  }

  /**
   * Check and clean up expired sessions
   */
  static async cleanupExpiredSessions() {
    try {
      const result = await ActiveSession.deleteMany({
        expiresAt: { $lt: new Date() },
      });

      console.log(
        `🗑️ [SessionManager] Cleaned up ${result.deletedCount} expired sessions`
      );
      return result.deletedCount;
    } catch (error) {
      console.error("[SessionManager] Error cleaning up sessions:", error);
      return 0;
    }
  }
}

export default SessionManager;
