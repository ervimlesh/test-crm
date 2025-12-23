import VideoConference from "../models/VideoConference.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export function setupVideoConferencing(io) {
  // Track active conferences and participants
  const activeConferences = new Map(); // { conferenceId: { participants: Map, recordingStatus: {} } }
  const userVideoStreams = new Map(); // { socketId: { userId, conferenceId, streamInfo } }

  io.on("connection", async (socket) => {
    try {
      const { userId, conferenceId, role, userName, email, token } = socket.handshake.auth || {};

      // Verify token if provided
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          socket.data.auth = decoded;
        } catch (err) {
          console.warn("Socket handshake JWT invalid:", err.message);
        }
      }

      socket.data.userId = userId || (socket.data.auth && socket.data.auth.id) || null;
      socket.data.conferenceId = conferenceId;
      socket.data.role = role || (socket.data.auth && socket.data.auth.role) || "participant";
      socket.data.userName = userName;
      socket.data.email = email;

      // console.log(
      //   `[VideoConference] Socket connected: ${socket.id} — userId: ${socket.data.userId}, conferenceId: ${conferenceId}`
      // );

      // ==================== JOIN CONFERENCE ====================
      socket.on("join-conference", async (data) => {
        try {
          const { conferenceId, userId, userName, email } = data;

          socket.data.conferenceId = conferenceId;
          socket.data.userId = userId;
          socket.data.userName = userName;
          socket.data.email = email;

          // Join socket to conference room
          socket.join(`conference_${conferenceId}`);
          socket.join(`conference_${conferenceId}_video`);

          // Initialize conference if doesn't exist
          if (!activeConferences.has(conferenceId)) {
            activeConferences.set(conferenceId, {
              participants: new Map(),
              recordingStatus: { isRecording: false },
              screenSharers: new Map(),
            });
          }

          // Add participant to conference
          const conference = activeConferences.get(conferenceId);
          conference.participants.set(socket.id, {
            socketId: socket.id,
            userId,
            userName,
            email,
            joinedAt: new Date(),
            audioEnabled: true,
            videoEnabled: true,
            isScreenSharing: false,
          });

          // Update database
          const videoConf = await VideoConference.findById(conferenceId);
          if (videoConf) {
            const existingParticipant = videoConf.participants.find(
              (p) => p.userId?.toString() === userId
            );
            if (!existingParticipant) {
              videoConf.participants.push({
                userId,
                socketId: socket.id,
                name: userName,
                email,
                joinedAt: new Date(),
              });
              videoConf.stats.totalParticipants = videoConf.participants.length;
              if (videoConf.participants.length > videoConf.stats.peakParticipants) {
                videoConf.stats.peakParticipants = videoConf.participants.length;
              }
              await videoConf.save();
            }
          }

          // Broadcast participant list
          const participantsList = Array.from(conference.participants.values());
          io.to(`conference_${conferenceId}`).emit("participants-updated", {
            participants: participantsList,
            total: participantsList.length,
          });

          socket.emit("join-success", {
            conferenceId,
            participants: participantsList,
          });

          io.to(`conference_${conferenceId}`).emit("participant-joined", {
            userId,
            userName,
            email,
            socketId: socket.id,
            timestamp: new Date(),
          });
        } catch (error) {
          console.error("[VideoConference] Error joining conference:", error);
          socket.emit("error", { message: "Failed to join conference" });
        }
      });

      // ==================== WEBRTC SIGNALING ====================

      // Send offer to peer
      socket.on("send-offer", (data) => {
        const { toSocketId, offer, fromUserId, fromUserName } = data;
        io.to(toSocketId).emit("receive-offer", {
          fromSocketId: socket.id,
          fromUserId,
          fromUserName,
          offer,
        });
      });

      // Send answer to peer
      socket.on("send-answer", (data) => {
        const { toSocketId, answer } = data;
        io.to(toSocketId).emit("receive-answer", {
          fromSocketId: socket.id,
          answer,
        });
      });

      // Exchange ICE candidates
      socket.on("send-ice-candidate", (data) => {
        const { toSocketId, candidate } = data;
        io.to(toSocketId).emit("receive-ice-candidate", {
          fromSocketId: socket.id,
          candidate,
        });
      });

      // ==================== AUDIO/VIDEO CONTROLS ====================

      socket.on("toggle-audio", (data) => {
        const { conferenceId, enabled } = data;
        const conference = activeConferences.get(conferenceId);

        if (conference && conference.participants.has(socket.id)) {
          const participant = conference.participants.get(socket.id);
          participant.audioEnabled = enabled;
        }

        io.to(`conference_${conferenceId}`).emit("user-audio-toggled", {
          userId: socket.data.userId,
          socketId: socket.id,
          userName: socket.data.userName,
          enabled,
        });
      });

      socket.on("toggle-video", (data) => {
        const { conferenceId, enabled } = data;
        const conference = activeConferences.get(conferenceId);

        if (conference && conference.participants.has(socket.id)) {
          const participant = conference.participants.get(socket.id);
          participant.videoEnabled = enabled;
        }

        io.to(`conference_${conferenceId}`).emit("user-video-toggled", {
          userId: socket.data.userId,
          socketId: socket.id,
          userName: socket.data.userName,
          enabled,
        });
      });

      // ==================== SCREEN SHARING ====================

      socket.on("start-screen-share", (data) => {
        const { conferenceId } = data;
        const conference = activeConferences.get(conferenceId);

        if (conference && conference.participants.has(socket.id)) {
          const participant = conference.participants.get(socket.id);
          participant.isScreenSharing = true;
          conference.screenSharers.set(socket.id, {
            socketId: socket.id,
            userId: socket.data.userId,
            userName: socket.data.userName,
            startTime: new Date(),
          });
        }

        io.to(`conference_${conferenceId}`).emit("screen-share-started", {
          userId: socket.data.userId,
          socketId: socket.id,
          userName: socket.data.userName,
        });
      });

      socket.on("stop-screen-share", (data) => {
        const { conferenceId } = data;
        const conference = activeConferences.get(conferenceId);

        if (conference && conference.participants.has(socket.id)) {
          const participant = conference.participants.get(socket.id);
          participant.isScreenSharing = false;
          conference.screenSharers.delete(socket.id);
        }

        io.to(`conference_${conferenceId}`).emit("screen-share-stopped", {
          userId: socket.data.userId,
          socketId: socket.id,
          userName: socket.data.userName,
        });
      });

      // ==================== RECORDING ====================

      socket.on("start-recording", (data) => {
        const { conferenceId } = data;
        const conference = activeConferences.get(conferenceId);

        if (conference) {
          conference.recordingStatus.isRecording = true;
          conference.recordingStatus.startTime = new Date();
        }

        io.to(`conference_${conferenceId}`).emit("recording-started", {
          timestamp: new Date(),
        });
      });

      socket.on("stop-recording", (data) => {
        const { conferenceId } = data;
        const conference = activeConferences.get(conferenceId);

        if (conference) {
          conference.recordingStatus.isRecording = false;
          conference.recordingStatus.endTime = new Date();
        }

        io.to(`conference_${conferenceId}`).emit("recording-stopped", {
          timestamp: new Date(),
        });
      });

      // ==================== CHAT MESSAGES ====================

      socket.on("send-message", (data) => {
        const { conferenceId, message, messageType } = data;

        io.to(`conference_${conferenceId}`).emit("receive-message", {
          userId: socket.data.userId,
          userName: socket.data.userName,
          email: socket.data.email,
          message,
          messageType: messageType || "text",
          timestamp: new Date(),
        });
      });

      // ==================== HOST CONTROLS ====================

      socket.on("mute-all", (data) => {
        const { conferenceId } = data;
        io.to(`conference_${conferenceId}`).emit("force-mute-all", {
          reason: "Host muted all participants",
        });
      });

      socket.on("remove-participant", (data) => {
        const { conferenceId, participantSocketId } = data;
        io.to(participantSocketId).emit("removed-from-conference", {
          conferenceId,
          reason: "Host removed you",
        });
      });

      socket.on("lock-conference", (data) => {
        const { conferenceId } = data;
        io.to(`conference_${conferenceId}`).emit("conference-locked", {
          reason: "Conference is now locked",
        });
      });

      // ==================== LEAVE CONFERENCE ====================

      socket.on("leave-conference", (data) => {
        const { conferenceId } = data || {};
        const confId = conferenceId || socket.data.conferenceId;

        if (confId) {
          const conference = activeConferences.get(confId);
          if (conference) {
            conference.participants.delete(socket.id);
            conference.screenSharers.delete(socket.id);

            const participantsList = Array.from(conference.participants.values());
            io.to(`conference_${confId}`).emit("participants-updated", {
              participants: participantsList,
              total: participantsList.length,
            });

            io.to(`conference_${confId}`).emit("participant-left", {
              userId: socket.data.userId,
              socketId: socket.id,
              userName: socket.data.userName,
              timestamp: new Date(),
            });

            if (conference.participants.size === 0) {
              activeConferences.delete(confId);
            }
          }

          socket.leave(`conference_${confId}`);
          socket.leave(`conference_${confId}_video`);
        }
      });

      // ==================== GET CONFERENCE INFO ====================

      socket.on("get-conference-info", (data) => {
        const { conferenceId } = data;
        const conference = activeConferences.get(conferenceId);

        if (conference) {
          socket.emit("conference-info", {
            conferenceId,
            participants: Array.from(conference.participants.values()),
            recordingStatus: conference.recordingStatus,
            screenSharers: Array.from(conference.screenSharers.values()),
            totalParticipants: conference.participants.size,
          });
        }
      });

      // ==================== DISCONNECT ====================

      socket.on("disconnect", async (reason) => {
        // console.log(`[VideoConference] Socket disconnected: ${socket.id} reason: ${reason}`);

        const confId = socket.data.conferenceId;
        if (confId) {
          const conference = activeConferences.get(confId);
          if (conference) {
            const participant = conference.participants.get(socket.id);
            if (participant) {
              // Update database
              const videoConf = await VideoConference.findById(confId);
              if (videoConf) {
                const participantIndex = videoConf.participants.findIndex(
                  (p) => p.socketId === socket.id
                );
                if (participantIndex !== -1) {
                  videoConf.participants[participantIndex].leftAt = new Date();
                  await videoConf.save();
                }
              }
            }

            conference.participants.delete(socket.id);
            conference.screenSharers.delete(socket.id);

            if (conference.participants.size === 0) {
              activeConferences.delete(confId);
            } else {
              const participantsList = Array.from(conference.participants.values());
              io.to(`conference_${confId}`).emit("participants-updated", {
                participants: participantsList,
                total: participantsList.length,
              });

              io.to(`conference_${confId}`).emit("participant-left", {
                userId: socket.data.userId,
                socketId: socket.id,
                userName: socket.data.userName,
                timestamp: new Date(),
              });
            }
          }
        }
      });
    } catch (err) {
      console.error("[VideoConference] Error:", err);
    }
  });

  return {
    getActiveConferences: () => Array.from(activeConferences.keys()),
    getConferenceInfo: (conferenceId) => activeConferences.get(conferenceId),
    getParticipants: (conferenceId) => {
      const conf = activeConferences.get(conferenceId);
      return conf ? Array.from(conf.participants.values()) : [];
    },
  };
}
