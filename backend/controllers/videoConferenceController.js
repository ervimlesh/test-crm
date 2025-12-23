import VideoConference from "../models/VideoConference.js";
import VideoRecording from "../models/VideoRecording.js";
import VideoMessage from "../models/VideoMessage.js";
import User from "../models/User.js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==================== CONFERENCE CRUD ====================

export const createConference = async (req, res) => {
  try {
    const { title, description, maxParticipants, scheduledStartTime, settings } = req.body;
    const hostId = req.user.id;

    const host = await User.findById(hostId);
    if (!host) {
      return res.status(404).json({ success: false, message: "Host not found" });
    }

    const conferenceId = `conf_${uuidv4()}`;

    const conference = new VideoConference({
      conferenceId,
      title: title || "Unnamed Conference",
      description,
      host: hostId,
      hostName: host.userName || host.email,
      maxParticipants: maxParticipants || 100,
      status: scheduledStartTime ? "scheduled" : "active",
      scheduledStartTime,
      settings: {
        ...settings,
      },
      stats: {
        totalParticipants: 1,
        peakParticipants: 1,
      },
    });

    await conference.save();

    return res.status(201).json({
      success: true,
      message: "Conference created successfully",
      data: conference,
    });
  } catch (error) {
    console.error("Error creating conference:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating conference",
      error: error.message,
    });
  }
};

export const getConference = async (req, res) => {
  try {
    const { conferenceId } = req.params;

    const conference = await VideoConference.findOne({ conferenceId }).populate(
      "host",
      "_id userName email"
    );

    if (!conference) {
      return res.status(404).json({
        success: false,
        message: "Conference not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: conference,
    });
  } catch (error) {
    console.error("Error fetching conference:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching conference",
      error: error.message,
    });
  }
};

export const listConferences = async (req, res) => {
  try {
    const { status, sort, limit = 10, page = 1 } = req.query;
    const userId = req.user.id;

    const query = {
      $or: [
        { host: userId },
        { "participants.userId": userId },
      ],
    };

    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const conferences = await VideoConference.find(query)
      .populate("host", "_id userName email")
      .sort(sort || { createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await VideoConference.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: conferences,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error listing conferences:", error);
    return res.status(500).json({
      success: false,
      message: "Error listing conferences",
      error: error.message,
    });
  }
};

export const updateConference = async (req, res) => {
  try {
    const { conferenceId } = req.params;
    const userId = req.user.id;
    const updates = req.body;

    const conference = await VideoConference.findOne({ conferenceId });

    if (!conference) {
      return res.status(404).json({
        success: false,
        message: "Conference not found",
      });
    }

    if (conference.host.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this conference",
      });
    }

    Object.assign(conference, updates);
    await conference.save();

    return res.status(200).json({
      success: true,
      message: "Conference updated successfully",
      data: conference,
    });
  } catch (error) {
    console.error("Error updating conference:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating conference",
      error: error.message,
    });
  }
};

export const endConference = async (req, res) => {
  try {
    const { conferenceId } = req.params;
    const userId = req.user.id;

    const conference = await VideoConference.findOne({ conferenceId });

    if (!conference) {
      return res.status(404).json({
        success: false,
        message: "Conference not found",
      });
    }

    if (conference.host.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only host can end the conference",
      });
    }

    conference.status = "ended";
    conference.endTime = new Date();
    conference.duration = Math.floor(
      (conference.endTime - conference.startTime) / 1000
    );

    await conference.save();

    return res.status(200).json({
      success: true,
      message: "Conference ended successfully",
      data: conference,
    });
  } catch (error) {
    console.error("Error ending conference:", error);
    return res.status(500).json({
      success: false,
      message: "Error ending conference",
      error: error.message,
    });
  }
};

// ==================== RECORDING MANAGEMENT ====================

export const startRecording = async (req, res) => {
  try {
    const { conferenceId } = req.params;
    const userId = req.user.id;

    const conference = await VideoConference.findOne({ conferenceId });

    if (!conference) {
      return res.status(404).json({
        success: false,
        message: "Conference not found",
      });
    }

    if (conference.host.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only host can start recording",
      });
    }

    if (!conference.recordingEnabled) {
      return res.status(400).json({
        success: false,
        message: "Recording is not enabled for this conference",
      });
    }

    const recordingId = `rec_${uuidv4()}`;
    const recordingPath = path.join(__dirname, `../uploads/recordings/${recordingId}`);

    // Create recordings directory if it doesn't exist
    if (!fs.existsSync(path.join(__dirname, "../uploads/recordings"))) {
      fs.mkdirSync(path.join(__dirname, "../uploads/recordings"), { recursive: true });
    }

    const recording = new VideoRecording({
      recordingId,
      conferenceId: conference._id,
      conference: {
        title: conference.title,
        hostId: conference.host,
        hostName: conference.hostName,
      },
      recordingPath,
      status: "recording",
    });

    await recording.save();

    conference.recordingPath = recordingPath;
    await conference.save();

    return res.status(201).json({
      success: true,
      message: "Recording started",
      data: recording,
    });
  } catch (error) {
    console.error("Error starting recording:", error);
    return res.status(500).json({
      success: false,
      message: "Error starting recording",
      error: error.message,
    });
  }
};

export const stopRecording = async (req, res) => {
  try {
    const { recordingId } = req.params;
    const { fileSize, duration } = req.body;

    const recording = await VideoRecording.findOne({ recordingId });

    if (!recording) {
      return res.status(404).json({
        success: false,
        message: "Recording not found",
      });
    }

    recording.status = "completed";
    recording.completedAt = new Date();
    recording.fileSize = fileSize || 0;
    recording.duration = duration || 0;

    await recording.save();

    return res.status(200).json({
      success: true,
      message: "Recording stopped",
      data: recording,
    });
  } catch (error) {
    console.error("Error stopping recording:", error);
    return res.status(500).json({
      success: false,
      message: "Error stopping recording",
      error: error.message,
    });
  }
};

export const getRecordings = async (req, res) => {
  try {
    const { conferenceId } = req.params;
    const { limit = 10, page = 1 } = req.query;

    const skip = (page - 1) * limit;

    const recordings = await VideoRecording.find({ conferenceId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await VideoRecording.countDocuments({ conferenceId });

    return res.status(200).json({
      success: true,
      data: recordings,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching recordings:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching recordings",
      error: error.message,
    });
  }
};

export const deleteRecording = async (req, res) => {
  try {
    const { recordingId } = req.params;
    const userId = req.user.id;

    const recording = await VideoRecording.findOne({ recordingId }).populate(
      "conference.hostId"
    );

    if (!recording) {
      return res.status(404).json({
        success: false,
        message: "Recording not found",
      });
    }

    if (recording.conference.hostId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this recording",
      });
    }

    // Delete file if exists
    if (fs.existsSync(recording.recordingPath)) {
      fs.unlinkSync(recording.recordingPath);
    }

    await VideoRecording.deleteOne({ recordingId });

    return res.status(200).json({
      success: true,
      message: "Recording deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting recording:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting recording",
      error: error.message,
    });
  }
};

// ==================== CHAT MESSAGES ====================

export const sendMessage = async (req, res) => {
  try {
    const { conferenceId } = req.params;
    const { message, messageType = "text" } = req.body;
    const userId = req.user.id;

    const conference = await VideoConference.findById(conferenceId);
    if (!conference) {
      return res.status(404).json({
        success: false,
        message: "Conference not found",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const videoMessage = new VideoMessage({
      conferenceId,
      senderId: userId,
      senderName: user.userName || user.email,
      senderEmail: user.email,
      message,
      messageType,
    });

    await videoMessage.save();

    conference.stats.totalMessages = (conference.stats.totalMessages || 0) + 1;
    await conference.save();

    return res.status(201).json({
      success: true,
      message: "Message sent",
      data: videoMessage,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({
      success: false,
      message: "Error sending message",
      error: error.message,
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conferenceId } = req.params;
    const { limit = 50, page = 1 } = req.query;

    const skip = (page - 1) * limit;

    const messages = await VideoMessage.find({ conferenceId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .populate("senderId", "_id userName email");

    const total = await VideoMessage.countDocuments({ conferenceId });

    return res.status(200).json({
      success: true,
      data: messages.reverse(),
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching messages",
      error: error.message,
    });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await VideoMessage.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    if (message.senderId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this message",
      });
    }

    await VideoMessage.deleteOne({ _id: messageId });

    return res.status(200).json({
      success: true,
      message: "Message deleted",
    });
  } catch (error) {
    console.error("Error deleting message:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting message",
      error: error.message,
    });
  }
};

// ==================== STATISTICS & ANALYTICS ====================

export const getConferenceStats = async (req, res) => {
  try {
    const { conferenceId } = req.params;

    const conference = await VideoConference.findById(conferenceId);

    if (!conference) {
      return res.status(404).json({
        success: false,
        message: "Conference not found",
      });
    }

    const stats = {
      conferenceId: conference.conferenceId,
      title: conference.title,
      status: conference.status,
      duration: conference.duration,
      participants: conference.participants,
      stats: conference.stats,
      startTime: conference.startTime,
      endTime: conference.endTime,
      recordings: await VideoRecording.countDocuments({ conferenceId: conference._id }),
      messages: await VideoMessage.countDocuments({ conferenceId: conference._id }),
    };

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching conference stats:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching conference stats",
      error: error.message,
    });
  }
};

// ==================== INVITATIONS & PERMISSIONS ====================

export const inviteParticipants = async (req, res) => {
  try {
    const { conferenceId } = req.params;
    const { emails } = req.body;
    const userId = req.user.id;

    const conference = await VideoConference.findOne({ conferenceId });

    if (!conference) {
      return res.status(404).json({
        success: false,
        message: "Conference not found",
      });
    }

    if (conference.host.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only host can invite participants",
      });
    }

    conference.invitedEmails = [...new Set([...conference.invitedEmails, ...emails])];
    await conference.save();

    return res.status(200).json({
      success: true,
      message: "Participants invited successfully",
      data: conference,
    });
  } catch (error) {
    console.error("Error inviting participants:", error);
    return res.status(500).json({
      success: false,
      message: "Error inviting participants",
      error: error.message,
    });
  }
};

export const removeParticipant = async (req, res) => {
  try {
    const { conferenceId, participantId } = req.params;
    const userId = req.user.id;

    const conference = await VideoConference.findOne({ conferenceId });

    if (!conference) {
      return res.status(404).json({
        success: false,
        message: "Conference not found",
      });
    }

    if (conference.host.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only host can remove participants",
      });
    }

    conference.participants = conference.participants.filter(
      (p) => p.userId.toString() !== participantId
    );

    await conference.save();

    return res.status(200).json({
      success: true,
      message: "Participant removed",
      data: conference,
    });
  } catch (error) {
    console.error("Error removing participant:", error);
    return res.status(500).json({
      success: false,
      message: "Error removing participant",
      error: error.message,
    });
  }
};
