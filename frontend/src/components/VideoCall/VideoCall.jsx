import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  BiMicrophone,
  BiMicrophoneOff,
  BiSolidPhone,
  BiSolidPhoneOff,
  BiVideo,
  BiVideoOff,
  BiShare,
  BiShareAlt,
  BiCircle,
  BiSolidCircle,
  BiMessage,
  BiMessageSquare,
} from "react-icons/bi";
import { useVideoConferenceService } from "../../hooks/useVideoConferenceService";
import { useWebRTC } from "../../hooks/useWebRTC";
import { useVideoRecording } from "../../hooks/useVideoRecording";
import VideoGrid from "./VideoGrid";
import ChatPanel from "./ChatPanel";
import ParticipantList from "./ParticipantList";
import ControlBar from "./ControlBar";
import "./VideoCall.css";

const VideoCall = () => {
  const { conferenceId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [screenSharing, setScreenSharing] = useState(false);
  const [recordingStarted, setRecordingStarted] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  // Use service hooks
  const videoService = useVideoConferenceService(
    token,
    user?.id,
    user?.userName || user?.email,
    user?.email
  );

  const webrtc = useWebRTC(videoService);
  const recording = useVideoRecording();

  // Initialize
  useEffect(() => {
    const initialize = async () => {
      try {
        // Initialize local stream
        const stream = await webrtc.initializeLocalStream({
          audio: true,
          video: { width: 1280, height: 720 },
        });

        // Join conference
        videoService.joinConference(
          conferenceId,
          user?.userName || user?.email,
          user?.email
        );

        // Setup listeners
        const unsubscribeParticipantJoined = videoService.onParticipantJoined?.((data) => {
          toast.success(`${data.userName} joined the conference`);
        });

        const unsubscribeParticipantLeft = videoService.onParticipantLeft?.((data) => {
          toast(`${data.userName} left the conference`);
          webrtc.closePeerConnection(data.socketId);
        });

        return () => {
          unsubscribeParticipantJoined?.();
          unsubscribeParticipantLeft?.();
        };
      } catch (error) {
        console.error("Error initializing:", error);
        setError("Failed to access camera/microphone. Please check permissions.");
        toast.error("Failed to initialize video conference");
      }
    };

    initialize();

    return () => {
      webrtc.cleanup();
      videoService.leaveConference();
    };
  }, [conferenceId, videoService, webrtc, user]);

  // Handle participants updates
  useEffect(() => {
    if (videoService.participants.length > 0) {
      videoService.participants.forEach((participant) => {
        if (participant.socketId !== videoService.socket?.id) {
          webrtc.createAndSendOffer(
            participant.socketId,
            user?.id,
            user?.userName || user?.email
          );
        }
      });
    }
  }, [videoService.participants, videoService.socket, webrtc, user]);

  // Handle screen share toggle
  const handleScreenShare = async () => {
    try {
      if (!screenSharing) {
        await webrtc.startScreenShare();
        setScreenSharing(true);
        toast.success("Screen sharing started");
      } else {
        await webrtc.stopScreenShare();
        setScreenSharing(false);
        toast.success("Screen sharing stopped");
      }
    } catch (error) {
      console.error("Error toggling screen share:", error);
      toast.error("Failed to toggle screen sharing");
    }
  };

  // Handle recording toggle
  const handleRecording = async () => {
    try {
      if (!recordingStarted) {
        const captureStream = new MediaStream();
        // Combine local audio/video with remote streams
        if (webrtc.localStream) {
          webrtc.localStream.getTracks().forEach((track) => {
            captureStream.addTrack(track);
          });
        }
        webrtc.remoteStreams.forEach((stream) => {
          stream.getTracks().forEach((track) => {
            if (!captureStream.getTracks().find((t) => t.id === track.id)) {
              captureStream.addTrack(track);
            }
          });
        });

        await recording.startRecording(captureStream);
        videoService.startRecording();
        setRecordingStarted(true);
        toast.success("Recording started");
      } else {
        const result = await recording.stopRecording();
        videoService.stopRecording();
        setRecordingStarted(false);
        toast.success("Recording stopped");

        // Auto-upload or offer download
        const shouldUpload = confirm("Upload recording to server?");
        if (shouldUpload) {
          await recording.uploadRecording(result.blob, conferenceId, token);
          toast.success("Recording uploaded successfully");
        } else {
          recording.downloadRecording(result.blob);
        }
      }
    } catch (error) {
      console.error("Error toggling recording:", error);
      toast.error("Failed to toggle recording");
    }
  };

  if (error) {
    return (
      <div className="video-call-error">
        <div className="error-content">
          <h2>⚠️ Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="video-call-container">
      <div className="video-call-main">
        <VideoGrid
          localStream={webrtc.localStream}
          remoteStreams={webrtc.remoteStreams}
          participants={videoService.participants}
          screenSharing={screenSharing}
        />

        <ControlBar
          audioEnabled={webrtc.audioEnabled}
          videoEnabled={webrtc.videoEnabled}
          screenSharing={screenSharing}
          recordingStarted={recordingStarted}
          recordingTime={recording.recordingTime}
          onToggleAudio={() => webrtc.toggleAudio(!webrtc.audioEnabled)}
          onToggleVideo={() => webrtc.toggleVideo(!webrtc.videoEnabled)}
          onToggleScreenShare={handleScreenShare}
          onToggleRecording={handleRecording}
          onToggleChat={() => setShowChat(!showChat)}
          onToggleParticipants={() => setShowParticipants(!showParticipants)}
          onEndCall={() => window.history.back()}
        />
      </div>

      {showChat && (
        <ChatPanel
          conferenceId={conferenceId}
          messages={videoService.messages}
          onSendMessage={(message) => videoService.sendMessage(message)}
          onClose={() => setShowChat(false)}
        />
      )}

      {showParticipants && (
        <ParticipantList
          participants={videoService.participants}
          onClose={() => setShowParticipants(false)}
        />
      )}
    </div>
  );
};

export default VideoCall;
