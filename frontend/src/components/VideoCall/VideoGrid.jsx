import React, { useEffect, useRef } from "react";
import "./VideoGrid.css";

const VideoGrid = ({ localStream, remoteStreams, participants, screenSharing }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRefs = useRef({});

  // Set local stream
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Set remote streams
  useEffect(() => {
    remoteStreams.forEach((stream, socketId) => {
      if (remoteVideoRefs.current[socketId]) {
        remoteVideoRefs.current[socketId].srcObject = stream;
      }
    });
  }, [remoteStreams]);

  const totalParticipants = 1 + (remoteStreams?.size || 0);
  const gridClass = `grid-${Math.min(totalParticipants, 4)}`;

  return (
    <div className={`video-grid ${gridClass} ${screenSharing ? "screen-sharing" : ""}`}>
      {screenSharing ? (
        <div className="screen-share-container">
          <div className="screen-share-placeholder">
            <p>Screen Sharing in Progress</p>
          </div>
          <div className="screen-share-thumbnails">
            <div className="local-video-thumbnail">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="local-video-thumbnail-element"
              />
              <span className="participant-label">You (Camera)</span>
            </div>
            {Array.from(remoteStreams.entries()).map(([socketId, stream]) => {
              const participant = participants.find((p) => p.socketId === socketId);
              return (
                <div key={socketId} className="remote-video-thumbnail">
                  <video
                    ref={(el) => {
                      if (el) remoteVideoRefs.current[socketId] = el;
                    }}
                    autoPlay
                    playsInline
                    className="remote-video-thumbnail-element"
                  />
                  <span className="participant-label">{participant?.userName || "User"}</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          <div className="video-cell local-video">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="video-element"
            />
            <div className="participant-info">
              <span className="participant-name">You</span>
            </div>
          </div>

          {Array.from(remoteStreams.entries()).map(([socketId, stream]) => {
            const participant = participants.find((p) => p.socketId === socketId);
            return (
              <div key={socketId} className="video-cell remote-video">
                <video
                  ref={(el) => {
                    if (el) remoteVideoRefs.current[socketId] = el;
                  }}
                  autoPlay
                  playsInline
                  className="video-element"
                />
                <div className="participant-info">
                  <span className="participant-name">{participant?.userName || "User"}</span>
                  {!participant?.videoEnabled && <span className="badge">📷 Off</span>}
                  {!participant?.audioEnabled && <span className="badge">🔇 Muted</span>}
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default VideoGrid;
