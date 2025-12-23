import mongoose from "mongoose";

const VideoConferenceSchema = new mongoose.Schema(
  {
    conferenceId: {
      type: String,
      unique: true,
      index: true,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hostName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "active", "ended", "cancelled"],
      default: "scheduled",
      index: true,
    },
    maxParticipants: {
      type: Number,
      default: 100,
    },
    participants: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        socketId: String,
        name: String,
        email: String,
        joinedAt: {
          type: Date,
          default: Date.now,
        },
        leftAt: Date,
        role: {
          type: String,
          enum: ["host", "co-host", "participant"],
          default: "participant",
        },
        isAudioOn: {
          type: Boolean,
          default: true,
        },
        isVideoOn: {
          type: Boolean,
          default: true,
        },
        isScreenSharing: {
          type: Boolean,
          default: false,
        },
      },
    ],
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: Date,
    scheduledStartTime: Date,
    scheduledEndTime: Date,
    duration: {
      type: Number,
      default: 0,
    },
    recordingEnabled: {
      type: Boolean,
      default: true,
    },
    chatEnabled: {
      type: Boolean,
      default: true,
    },
    screenSharingEnabled: {
      type: Boolean,
      default: true,
    },
    waitingRoomEnabled: {
      type: Boolean,
      default: false,
    },
    passcode: String,
    recordingPath: String,
    recordingSize: {
      type: Number,
      default: 0,
    },
    meetingNotes: String,
    invitedEmails: [String],
    allowedDomains: [String],
    settings: {
      muteAllParticipants: {
        type: Boolean,
        default: false,
      },
      allowParticipantVideo: {
        type: Boolean,
        default: true,
      },
      allowParticipantAudio: {
        type: Boolean,
        default: true,
      },
      allowParticipantChat: {
        type: Boolean,
        default: true,
      },
      allowParticipantScreenShare: {
        type: Boolean,
        default: true,
      },
      requirePassword: {
        type: Boolean,
        default: false,
      },
      joinBeforeHost: {
        type: Boolean,
        default: false,
      },
    },
    stats: {
      totalParticipants: {
        type: Number,
        default: 0,
      },
      peakParticipants: {
        type: Number,
        default: 0,
      },
      totalMessages: {
        type: Number,
        default: 0,
      },
      recordingStartedAt: Date,
      recordingDuration: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true }
);

VideoConferenceSchema.index({ status: 1, createdAt: -1 });
VideoConferenceSchema.index({ host: 1, createdAt: -1 });

export default mongoose.model("VideoConference", VideoConferenceSchema);
