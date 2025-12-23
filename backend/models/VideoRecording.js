import mongoose from "mongoose";

const VideoRecordingSchema = new mongoose.Schema(
  {
    recordingId: {
      type: String,
      unique: true,
      index: true,
      required: true,
    },
    conferenceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VideoConference",
      required: true,
      index: true,
    },
    conference: {
      title: String,
      hostId: mongoose.Schema.Types.ObjectId,
      hostName: String,
    },
    recordingPath: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      default: 0,
    },
    format: {
      type: String,
      enum: ["webm", "mp4", "mkv"],
      default: "webm",
    },
    status: {
      type: String,
      enum: ["recording", "processing", "completed", "failed"],
      default: "recording",
      index: true,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: Date,
    uploadedAt: Date,
    isPublic: {
      type: Boolean,
      default: false,
    },
    password: String,
    accessibleTo: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        email: String,
        accessLevel: {
          type: String,
          enum: ["view", "download", "manage"],
          default: "view",
        },
        grantedAt: Date,
      },
    ],
    videoMetadata: {
      width: Number,
      height: Number,
      fps: Number,
      bitrate: String,
      codec: String,
      audioCodec: String,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    lastAccessedAt: Date,
    transcriptionPath: String,
    transcriptionStatus: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    searchableText: String,
  },
  { timestamps: true }
);

VideoRecordingSchema.index({ conferenceId: 1, createdAt: -1 });
VideoRecordingSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model("VideoRecording", VideoRecordingSchema);
