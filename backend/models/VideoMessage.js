import mongoose from "mongoose";

const VideoMessageSchema = new mongoose.Schema(
  {
    conferenceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VideoConference",
      required: true,
      index: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    senderEmail: String,
    message: {
      type: String,
      required: true,
      trim: true,
    },
    messageType: {
      type: String,
      enum: ["text", "image", "file", "emoji", "notification"],
      default: "text",
    },
    attachment: {
      fileName: String,
      filePath: String,
      fileSize: Number,
      fileType: String,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: Date,
    isPinned: {
      type: Boolean,
      default: false,
    },
    reactions: [
      {
        emoji: String,
        count: Number,
        users: [mongoose.Schema.Types.ObjectId],
      },
    ],
    replyTo: mongoose.Schema.Types.ObjectId,
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
    readBy: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        readAt: Date,
      },
    ],
  },
  { timestamps: true }
);

VideoMessageSchema.index({ conferenceId: 1, createdAt: -1 });
VideoMessageSchema.index({ senderId: 1, createdAt: -1 });

export default mongoose.model("VideoMessage", VideoMessageSchema);
