import mongoose from "mongoose";

const ActiveSessionSchema = new mongoose.Schema(
  {
    // Unique session identifier
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // Admin and Agent IDs
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Session status
    status: {
      type: String,
      enum: ["active", "paused", "screen-sharing", "ended"],
      default: "active",
    },

    // Socket IDs for current connection
    adminSocketId: {
      type: String,
      index: true,
    },
    agentSocketId: {
      type: String,
      index: true,
    },

    // Screen sharing metadata
    screenSharing: {
      isActive: {
        type: Boolean,
        default: false,
      },
      startedAt: Date,
      mode: {
        type: String,
        enum: ["screen", "window", "camera"],
      },
      sharerUserIdOrAgentId: String, // who started sharing
    },

    // Session timing
    startedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    lastActivityAt: {
      type: Date,
      default: Date.now,
    },
    endedAt: Date,

    // Session metadata
    sessionType: {
      type: String,
      enum: ["admin-to-agent", "peer-to-peer"],
      default: "admin-to-agent",
    },

    // Audio/Video states
    audioEnabled: {
      type: Boolean,
      default: true,
    },
    videoEnabled: {
      type: Boolean,
      default: true,
    },

    // Message history
    messages: [
      {
        senderId: mongoose.Schema.Types.ObjectId,
        senderRole: String,
        message: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],

    // Connection quality metrics
    connectionMetrics: {
      latency: Number,
      bandwidth: Number,
      packetLoss: Number,
      lastMeasuredAt: Date,
    },

    // Session restoration data
    lastKnownState: {
      remoteStreams: mongoose.Schema.Types.Mixed,
      audioEnabled: Boolean,
      videoEnabled: Boolean,
      screenSharingActive: Boolean,
    },

    // TTL for sessions (auto-delete after 7 days if not accessed)
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      index: true,
    },
  },
  { timestamps: true }
);

// Index for finding active sessions for a user pair
ActiveSessionSchema.index({ adminId: 1, agentId: 1 });
ActiveSessionSchema.index({ adminId: 1, status: 1 });
ActiveSessionSchema.index({ agentId: 1, status: 1 });
ActiveSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const ActiveSession = mongoose.model("ActiveSession", ActiveSessionSchema);

export default ActiveSession;
