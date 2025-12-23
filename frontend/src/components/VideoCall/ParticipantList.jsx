import React from "react";
import { BiX, BiFace } from "react-icons/bi";
import "./ParticipantList.css";

const ParticipantList = ({ participants, onClose }) => {
  return (
    <div className="participant-panel">
      <div className="participant-header">
        <h3>Participants ({participants.length})</h3>
        <button className="close-btn" onClick={onClose}>
          <BiX size={24} />
        </button>
      </div>

      <div className="participant-list">
        {participants.length === 0 ? (
          <div className="empty-participants">
            <p>No participants yet</p>
          </div>
        ) : (
          participants.map((participant, idx) => (
            <div key={idx} className="participant-item">
              <div className="participant-avatar">
                <BiFace size={32} />
              </div>
              <div className="participant-info">
                <div className="participant-name">{participant.userName}</div>
                <div className="participant-status">
                  {participant.audioEnabled ? "🎤" : "🔇"}{" "}
                  {participant.videoEnabled ? "📹" : "📷"}
                  {participant.isScreenSharing && " 📺"}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ParticipantList;
