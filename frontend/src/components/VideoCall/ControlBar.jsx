import React from "react";
import {
  BiMicrophone,
  BiMicrophoneOff,
  BiSolidPhoneOff,
  BiVideo,
  BiVideoOff,
  BiShareAlt,
  BiCircle,
  BiSolidCircle,
  BiMessageSquare,
  BiGroup,
} from "react-icons/bi";
import "./ControlBar.css";

const ControlBar = ({
  audioEnabled,
  videoEnabled,
  screenSharing,
  recordingStarted,
  recordingTime,
  onToggleAudio,
  onToggleVideo,
  onToggleScreenShare,
  onToggleRecording,
  onToggleChat,
  onToggleParticipants,
  onEndCall,
}) => {
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="control-bar">
      <div className="controls-left">
        <button
          className={`control-btn ${audioEnabled ? "active" : ""}`}
          onClick={onToggleAudio}
          title={audioEnabled ? "Mute" : "Unmute"}
        >
          {audioEnabled ? (
            <BiMicrophone size={24} />
          ) : (
            <BiMicrophoneOff size={24} />
          )}
          <span className="btn-label">
            {audioEnabled ? "Mute" : "Unmute"}
          </span>
        </button>

        <button
          className={`control-btn ${videoEnabled ? "active" : ""}`}
          onClick={onToggleVideo}
          title={videoEnabled ? "Stop Video" : "Start Video"}
        >
          {videoEnabled ? (
            <BiVideo size={24} />
          ) : (
            <BiVideoOff size={24} />
          )}
          <span className="btn-label">
            {videoEnabled ? "Stop Video" : "Start Video"}
          </span>
        </button>

        <button
          className={`control-btn ${screenSharing ? "active sharing" : ""}`}
          onClick={onToggleScreenShare}
          title={screenSharing ? "Stop Sharing" : "Share Screen"}
        >
          <BiShareAlt size={24} />
          <span className="btn-label">
            {screenSharing ? "Stop Sharing" : "Share"}
          </span>
        </button>
      </div>

      <div className="controls-center">
        {recordingStarted && (
          <div className="recording-indicator">
            <BiSolidCircle className="recording-dot" />
            <span className="recording-label">Recording: {formatTime(recordingTime)}</span>
          </div>
        )}

        <button
          className={`control-btn ${recordingStarted ? "active recording" : ""}`}
          onClick={onToggleRecording}
          title={recordingStarted ? "Stop Recording" : "Start Recording"}
        >
          <BiCircle size={24} />
          <span className="btn-label">
            {recordingStarted ? "Stop Rec." : "Record"}
          </span>
        </button>

        <button
          className="control-btn end-call"
          onClick={onEndCall}
          title="End Conference"
        >
          <BiSolidPhoneOff size={24} />
          <span className="btn-label">End</span>
        </button>
      </div>

      <div className="controls-right">
        <button
          className="control-btn"
          onClick={onToggleParticipants}
          title="Show Participants"
        >
          <BiGroup size={24} />
          <span className="btn-label">Participants</span>
        </button>

        <button
          className="control-btn"
          onClick={onToggleChat}
          title="Show Chat"
        >
          <BiMessageSquare size={24} />
          <span className="btn-label">Chat</span>
        </button>
      </div>
    </div>
  );
};

export default ControlBar;
