import { useEffect, useRef, useState, useCallback } from "react";
import io from "socket.io-client";

export const useVideoConferenceService = (token, userId, userName, email) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [conferenceId, setConferenceId] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [recordingStatus, setRecordingStatus] = useState(false);

  useEffect(() => {
    if (!token) return;

    const socket = io(import.meta.env.VITE_API_URL || "http://localhost:8080", {
      auth: {
        token,
        userId,
        userName,
        email,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to video conference server");
      setIsConnected(true);
    });

    socket.on("join-success", (data) => {
      setConferenceId(data.conferenceId);
      setParticipants(data.participants || []);
    });

    socket.on("participants-updated", (data) => {
      setParticipants(data.participants || []);
    });

    socket.on("receive-message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("recording-started", () => {
      setRecordingStatus(true);
    });

    socket.on("recording-stopped", () => {
      setRecordingStatus(false);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from video conference server");
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [token, userId, userName, email]);

  const joinConference = useCallback(
    (confId, userName, email) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit("join-conference", {
          conferenceId: confId,
          userId,
          userName,
          email,
        });
        setConferenceId(confId);
      }
    },
    [userId]
  );

  const leaveConference = useCallback(() => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("leave-conference", {
        conferenceId,
      });
      setParticipants([]);
      setMessages([]);
      setConferenceId(null);
    }
  }, [conferenceId]);

  const sendMessage = useCallback(
    (message, messageType = "text") => {
      if (socketRef.current?.connected) {
        socketRef.current.emit("send-message", {
          conferenceId,
          message,
          messageType,
        });
      }
    },
    [conferenceId]
  );

  const toggleAudio = useCallback(
    (enabled) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit("toggle-audio", {
          conferenceId,
          enabled,
        });
      }
    },
    [conferenceId]
  );

  const toggleVideo = useCallback(
    (enabled) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit("toggle-video", {
          conferenceId,
          enabled,
        });
      }
    },
    [conferenceId]
  );

  const startScreenShare = useCallback(() => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("start-screen-share", {
        conferenceId,
      });
    }
  }, [conferenceId]);

  const stopScreenShare = useCallback(() => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("stop-screen-share", {
        conferenceId,
      });
    }
  }, [conferenceId]);

  const startRecording = useCallback(() => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("start-recording", {
        conferenceId,
      });
    }
  }, [conferenceId]);

  const stopRecording = useCallback(() => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("stop-recording", {
        conferenceId,
      });
    }
  }, [conferenceId]);

  const muteAll = useCallback(() => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("mute-all", {
        conferenceId,
      });
    }
  }, [conferenceId]);

  const removeParticipant = useCallback(
    (participantSocketId) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit("remove-participant", {
          conferenceId,
          participantSocketId,
        });
      }
    },
    [conferenceId]
  );

  const lockConference = useCallback(() => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("lock-conference", {
        conferenceId,
      });
    }
  }, [conferenceId]);

  const sendOffer = useCallback(
    (toSocketId, offer, fromUserId, fromUserName) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit("send-offer", {
          toSocketId,
          offer,
          fromUserId,
          fromUserName,
        });
      }
    },
    []
  );

  const sendAnswer = useCallback((toSocketId, answer) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("send-answer", {
        toSocketId,
        answer,
      });
    }
  }, []);

  const sendIceCandidate = useCallback((toSocketId, candidate) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("send-ice-candidate", {
        toSocketId,
        candidate,
      });
    }
  }, []);

  const onReceiveOffer = useCallback((callback) => {
    if (socketRef.current) {
      socketRef.current.on("receive-offer", callback);
      return () => socketRef.current.off("receive-offer", callback);
    }
  }, []);

  const onReceiveAnswer = useCallback((callback) => {
    if (socketRef.current) {
      socketRef.current.on("receive-answer", callback);
      return () => socketRef.current.off("receive-answer", callback);
    }
  }, []);

  const onReceiveIceCandidate = useCallback((callback) => {
    if (socketRef.current) {
      socketRef.current.on("receive-ice-candidate", callback);
      return () => socketRef.current.off("receive-ice-candidate", callback);
    }
  }, []);

  const onScreenShareStarted = useCallback((callback) => {
    if (socketRef.current) {
      socketRef.current.on("screen-share-started", callback);
      return () => socketRef.current.off("screen-share-started", callback);
    }
  }, []);

  const onScreenShareStopped = useCallback((callback) => {
    if (socketRef.current) {
      socketRef.current.on("screen-share-stopped", callback);
      return () => socketRef.current.off("screen-share-stopped", callback);
    }
  }, []);

  const onUserAudioToggled = useCallback((callback) => {
    if (socketRef.current) {
      socketRef.current.on("user-audio-toggled", callback);
      return () => socketRef.current.off("user-audio-toggled", callback);
    }
  }, []);

  const onUserVideoToggled = useCallback((callback) => {
    if (socketRef.current) {
      socketRef.current.on("user-video-toggled", callback);
      return () => socketRef.current.off("user-video-toggled", callback);
    }
  }, []);

  const onParticipantJoined = useCallback((callback) => {
    if (socketRef.current) {
      socketRef.current.on("participant-joined", callback);
      return () => socketRef.current.off("participant-joined", callback);
    }
  }, []);

  const onParticipantLeft = useCallback((callback) => {
    if (socketRef.current) {
      socketRef.current.on("participant-left", callback);
      return () => socketRef.current.off("participant-left", callback);
    }
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    conferenceId,
    participants,
    messages,
    recordingStatus,
    joinConference,
    leaveConference,
    sendMessage,
    toggleAudio,
    toggleVideo,
    startScreenShare,
    stopScreenShare,
    startRecording,
    stopRecording,
    muteAll,
    removeParticipant,
    lockConference,
    sendOffer,
    sendAnswer,
    sendIceCandidate,
    onReceiveOffer,
    onReceiveAnswer,
    onReceiveIceCandidate,
    onScreenShareStarted,
    onScreenShareStopped,
    onUserAudioToggled,
    onUserVideoToggled,
    onParticipantJoined,
    onParticipantLeft,
  };
};
