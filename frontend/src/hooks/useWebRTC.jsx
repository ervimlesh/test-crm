import { useEffect, useRef, useState, useCallback } from "react";

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun3.l.google.com:19302" },
    { urls: "stun:stun4.l.google.com:19302" },
  ],
};

export const useWebRTC = (videoService) => {
  const peersRef = useRef(new Map()); // { socketId: RTCPeerConnection }
  const localStreamRef = useRef(null);
  const remoteStreamsRef = useRef(new Map()); // { socketId: MediaStream }
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState(new Map());
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  // Initialize local media stream
  const initializeLocalStream = useCallback(async (constraints = { audio: true, video: true }) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;
      setLocalStream(stream);
      return stream;
    } catch (error) {
      console.error("Error accessing media devices:", error);
      throw error;
    }
  }, []);

  // Create peer connection
  const createPeerConnection = useCallback(
    (socketId) => {
      if (peersRef.current.has(socketId)) {
        return peersRef.current.get(socketId);
      }

      const peerConnection = new RTCPeerConnection({
        iceServers: ICE_SERVERS.iceServers,
      });

      // Add local stream tracks
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          peerConnection.addTrack(track, localStreamRef.current);
        });
      }

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          videoService?.sendIceCandidate(socketId, event.candidate);
        }
      };

      // Handle remote stream
      const remoteStream = new MediaStream();
      remoteStreamsRef.current.set(socketId, remoteStream);
      setRemoteStreams((prev) => new Map(prev).set(socketId, remoteStream));

      peerConnection.ontrack = (event) => {
        console.log("Received remote track:", event.track.kind);
        event.streams[0].getTracks().forEach((track) => {
          if (!remoteStream.getTracks().find((t) => t.id === track.id)) {
            remoteStream.addTrack(track);
          }
        });
      };

      peerConnection.onconnectionstatechange = () => {
        console.log(`Peer ${socketId} connection state:`, peerConnection.connectionState);
        if (peerConnection.connectionState === "disconnected" || peerConnection.connectionState === "closed") {
          closePeerConnection(socketId);
        }
      };

      peersRef.current.set(socketId, peerConnection);
      return peerConnection;
    },
    [videoService, localStreamRef]
  );

  // Create and send offer
  const createAndSendOffer = useCallback(
    async (toSocketId, fromUserId, fromUserName) => {
      const peerConnection = createPeerConnection(toSocketId);

      const offer = await peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });

      await peerConnection.setLocalDescription(offer);
      videoService?.sendOffer(toSocketId, offer, fromUserId, fromUserName);
    },
    [createPeerConnection, videoService]
  );

  // Receive and handle offer
  const handleReceiveOffer = useCallback(
    async (data) => {
      const { fromSocketId, offer } = data;
      const peerConnection = createPeerConnection(fromSocketId);

      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      videoService?.sendAnswer(fromSocketId, answer);
    },
    [createPeerConnection, videoService]
  );

  // Handle incoming answer
  const handleReceiveAnswer = useCallback(
    async (data) => {
      const { fromSocketId, answer } = data;
      const peerConnection = peersRef.current.get(fromSocketId);

      if (peerConnection) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      }
    },
    []
  );

  // Handle ICE candidate
  const handleReceiveIceCandidate = useCallback(
    async (data) => {
      const { fromSocketId, candidate } = data;
      const peerConnection = peersRef.current.get(fromSocketId);

      if (peerConnection && candidate) {
        try {
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
          console.error("Error adding ICE candidate:", error);
        }
      }
    },
    []
  );

  // Toggle audio
  const toggleAudio = useCallback(
    (enabled) => {
      if (localStreamRef.current) {
        localStreamRef.current.getAudioTracks().forEach((track) => {
          track.enabled = enabled;
        });
        setAudioEnabled(enabled);
        videoService?.toggleAudio(enabled);
      }
    },
    [videoService]
  );

  // Toggle video
  const toggleVideo = useCallback(
    (enabled) => {
      if (localStreamRef.current) {
        localStreamRef.current.getVideoTracks().forEach((track) => {
          track.enabled = enabled;
        });
        setVideoEnabled(enabled);
        videoService?.toggleVideo(enabled);
      }
    },
    [videoService]
  );

  // Start screen share
  const startScreenShare = useCallback(async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: "always" },
        audio: false,
      });

      const videoTrack = screenStream.getVideoTrack();
      const sender = peersRef.current.get(videoService?.conferenceId)?.getSenders().find((s) => s.track?.kind === "video");

      if (sender) {
        await sender.replaceTrack(videoTrack);
      }

      videoTrack.onended = () => {
        stopScreenShare();
      };

      videoService?.startScreenShare();
      return screenStream;
    } catch (error) {
      console.error("Error starting screen share:", error);
      throw error;
    }
  }, [videoService]);

  // Stop screen share and go back to camera
  const stopScreenShare = useCallback(async () => {
    try {
      const videoTrack = localStreamRef.current?.getVideoTracks()[0];
      const sender = peersRef.current.get(videoService?.conferenceId)?.getSenders().find((s) => s.track?.kind === "video");

      if (sender && videoTrack) {
        await sender.replaceTrack(videoTrack);
      }

      videoService?.stopScreenShare();
    } catch (error) {
      console.error("Error stopping screen share:", error);
    }
  }, [videoService]);

  // Close peer connection
  const closePeerConnection = useCallback((socketId) => {
    const peerConnection = peersRef.current.get(socketId);
    if (peerConnection) {
      peerConnection.close();
      peersRef.current.delete(socketId);

      const remoteStream = remoteStreamsRef.current.get(socketId);
      if (remoteStream) {
        remoteStream.getTracks().forEach((track) => track.stop());
        remoteStreamsRef.current.delete(socketId);
      }

      setRemoteStreams((prev) => {
        const updated = new Map(prev);
        updated.delete(socketId);
        return updated;
      });
    }
  }, []);

  // Clean up all peer connections
  const cleanup = useCallback(() => {
    peersRef.current.forEach((pc) => pc.close());
    peersRef.current.clear();

    remoteStreamsRef.current.forEach((stream) => {
      stream.getTracks().forEach((track) => track.stop());
    });
    remoteStreamsRef.current.clear();

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
  }, []);

  // Setup listeners from videoService
  useEffect(() => {
    if (!videoService) return;

    const unsubscribeOffer = videoService.onReceiveOffer?.(handleReceiveOffer);
    const unsubscribeAnswer = videoService.onReceiveAnswer?.(handleReceiveAnswer);
    const unsubscribeIce = videoService.onReceiveIceCandidate?.(handleReceiveIceCandidate);

    return () => {
      unsubscribeOffer?.();
      unsubscribeAnswer?.();
      unsubscribeIce?.();
    };
  }, [videoService, handleReceiveOffer, handleReceiveAnswer, handleReceiveIceCandidate]);

  return {
    localStream,
    remoteStreams,
    audioEnabled,
    videoEnabled,
    initializeLocalStream,
    createAndSendOffer,
    handleReceiveOffer,
    handleReceiveAnswer,
    handleReceiveIceCandidate,
    toggleAudio,
    toggleVideo,
    startScreenShare,
    stopScreenShare,
    closePeerConnection,
    cleanup,
  };
};
