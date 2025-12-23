/**
 * ScreenShareViewer Component
 * Displays all active screen shares in a Google Meet-style grid
 * Shows real-time stream from users who are screen sharing
 * Features: Auto-connect to active sharers, timer, participant names
 */

import React, { useEffect, useRef, useState } from "react";
import { getSocket } from "../context/SocketContext.jsx";
import { createPeerConnection } from "../pages/Services/Webrtc.jsx";
import "./ScreenShareViewer.css";

const ScreenShareViewer = () => {
  const socket = getSocket();
  const [activeSharers, setActiveSharers] = useState([]); // array of active sharer objects
  const [remoteStreams, setRemoteStreams] = useState({}); // { userId: { stream, userName, mode, startTime } }
  const [expandedShare, setExpandedShare] = useState(null); // which share is fullscreen
  const pcRefs = useRef({}); // { userId: RTCPeerConnection }
  const videoRefs = useRef({}); // { userId: video element ref }
  const requestTimeoutsRef = useRef({}); // { userId: timeout id }

  /**
   * Fetch current active sharers list from backend
   */
  const fetchActiveSharers = () => {
    if (socket) {
      socket.emit("get-active-sharers");
    }
  };

  /**
   * Request screen share stream from a specific user
   */
  const requestScreenShareStream = (sharer) => {
    console.log(`[ScreenShareViewer] Requesting screen share from agent userId=${sharer.userId}`);

    if (socket) {
      socket.emit("request-screen-share-stream", {
        fromUserId: sharer.userId,
      });
    }
  };

  /**
   * Create peer connection and request stream from sharer
   */
  const setupPeerConnectionWithSharer = async (sharerId, sharerSocketId) => {
    try {
      // Skip if already connected
      if (pcRefs.current[sharerId]) {
        console.log(`[ScreenShareViewer] Already connected to ${sharerId}, skipping...`);
        return;
      }

      console.log(`[ScreenShareViewer] Setting up peer connection with agent userId=${sharerId}`);

      const iceServers = import.meta.env.VITE_ICE_SERVERS
        ? JSON.parse(import.meta.env.VITE_ICE_SERVERS)
        : [{ urls: "stun:stun.l.google.com:19302" }];

      // Create peer connection as receiver (viewer)
      const pc = createPeerConnection({
        iceServers,
        onTrack: (event) => {
          console.log(`[ScreenShareViewer] Received track from agent ${sharerId}:`, event.track.kind);
          const [stream] = event.streams;

          // Update stream in state
          setRemoteStreams((prev) => ({
            ...prev,
            [sharerId]: {
              ...prev[sharerId],
              stream,
            },
          }));

          // Attach to video element if exists
          if (videoRefs.current[sharerId]) {
            videoRefs.current[sharerId].srcObject = stream;
            videoRefs.current[sharerId]
              .play()
              .catch((err) => console.warn("Error playing video:", err));
          }
        },
        onIceCandidate: (candidate) => {
          socket.emit("screen-share-ice-candidate", {
            toUserId: sharerId,
            candidate,
          });
        },
      });

      pcRefs.current[sharerId] = pc;
    } catch (error) {
      console.error(`[ScreenShareViewer] Error setting up peer connection:`, error);
    }
  };

  /**
   * Format duration timer
   */
  const formatDuration = (startTime) => {
    if (!startTime) return "00:00";
    const elapsed = Date.now() - startTime;
    const seconds = Math.floor((elapsed / 1000) % 60);
    const minutes = Math.floor((elapsed / (1000 * 60)) % 60);
    const hours = Math.floor(elapsed / (1000 * 60 * 60));

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  /**
   * Update duration every second for active shares
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSharers((prev) => [...prev]); // trigger re-render to update timers
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /**
   * Socket event listeners
   */
  useEffect(() => {
    if (!socket) return;

    // Listen for active sharers list
    socket.on("active-sharers-updated", ({ sharers }) => {
      console.log("[ScreenShareViewer] Active sharers updated:", sharers);
      setActiveSharers(sharers || []);

      // Auto-connect to new sharers
      sharers?.forEach((sharer) => {
        if (!pcRefs.current[sharer.userId]) {
          setTimeout(() => {
            requestScreenShareStream(sharer);
          }, 500);
        }
      });
    });

    // Listen for when someone starts sharing
    socket.on("user-started-sharing", ({ userId, socketId, userName, startTime, mode }) => {
      console.log(`[ScreenShareViewer] User ${userName} (${userId}) started sharing ${mode}`);

      setActiveSharers((prev) => {
        const exists = prev.find((s) => s.userId === userId);
        if (exists) return prev;
        return [...prev, { userId, socketId, userName, startTime, mode }];
      });

      // Request stream from this new sharer
      setTimeout(() => {
        requestScreenShareStream({ userId, socketId, userName, startTime, mode });
      }, 500);
    });

    // Listen for when someone stops sharing
    socket.on("user-stopped-sharing", ({ userId }) => {
      console.log(`[ScreenShareViewer] User ${userId} stopped sharing`);

      // Close peer connection
      if (pcRefs.current[userId]) {
        pcRefs.current[userId].close();
        delete pcRefs.current[userId];
      }

      // Remove from streams
      setRemoteStreams((prev) => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });

      // Remove from active sharers
      setActiveSharers((prev) => prev.filter((s) => s.userId !== userId));

      // Clear expanded if it was the one that stopped
      if (expandedShare === userId) {
        setExpandedShare(null);
      }
    });

    // Listen for screen share offer from sharer
    socket.on("screen-share-offer", async ({ sharerUserId, sdp }) => {
      console.log(
        `[ScreenShareViewer] Received offer from agent userId=${sharerUserId}`
      );

      try {
        // Setup peer connection if not already done
        if (!pcRefs.current[sharerUserId]) {
          await setupPeerConnectionWithSharer(sharerUserId, null);
        }

        const pc = pcRefs.current[sharerUserId];
        if (!pc) {
          console.error(`[ScreenShareViewer] No peer connection for ${sharerUserId}`);
          return;
        }

        // Set remote description (offer from sharer)
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));

        // Create answer
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        // Send answer back to sharer with their user ID
        socket.emit("screen-share-answer", {
          toUserId: sharerUserId,
          sdp: pc.localDescription,
        });

        console.log(`[ScreenShareViewer] Sent answer to agent userId=${sharerUserId}`);
      } catch (error) {
        console.error(
          `[ScreenShareViewer] Error handling offer from ${sharerUserId}:`,
          error
        );
      }
    });

    // Listen for ICE candidates from sharer
    socket.on("screen-share-ice-candidate", async ({ fromUserId, candidate }) => {
      try {
        const pc = pcRefs.current[fromUserId];
        if (!pc) {
          console.warn(
            `[ScreenShareViewer] No peer connection for ICE candidate from agent ${fromUserId}`
          );
          return;
        }
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.warn(
          `[ScreenShareViewer] Error adding ICE candidate from ${fromUserId}:`,
          error
        );
      }
    });

    // Get initial list of active sharers
    fetchActiveSharers();

    return () => {
      socket.off("active-sharers-updated");
      socket.off("user-started-sharing");
      socket.off("user-stopped-sharing");
      socket.off("screen-share-offer");
      socket.off("screen-share-ice-candidate");
    };
  }, [socket]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      Object.values(pcRefs.current).forEach((pc) => {
        try {
          pc?.close();
        } catch (err) {
          console.warn("Error closing peer connection:", err);
        }
      });
      pcRefs.current = {};
    };
  }, []);

  // No active shares
  if (!activeSharers || activeSharers.length === 0) {
    return (
      <div className="screen-share-viewer-empty">
        <div className="empty-state">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          <p>No active screen shares</p>
          <span>Waiting for team members to share their screens...</span>
        </div>
      </div>
    );
  }

  // Expanded fullscreen view
  if (expandedShare) {
    const sharer = activeSharers.find((s) => s.userId === expandedShare);
    const stream = remoteStreams[expandedShare];

    return (
      <div className="screen-share-fullscreen">
        <div className="fullscreen-container">
          <button className="close-fullscreen" onClick={() => setExpandedShare(null)}>
            ✕
          </button>

          <video
            ref={(el) => {
              if (el) videoRefs.current[expandedShare] = el;
            }}
            className="fullscreen-video"
            autoPlay
            playsInline
            muted={false}
          />

          {/* Share info overlay */}
          <div className="fullscreen-info">
            <div className="sharer-details">
              <div className="sharer-name">{sharer?.userName || "Unknown"}</div>
              <div className="share-mode">{sharer?.mode?.toUpperCase() || "SCREEN"}</div>
              <div className="share-duration">{formatDuration(sharer?.startTime)}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view of all active shares
  return (
    <div className="screen-share-viewer">
      <div className="viewer-header">
        <h2>Active Screens ({activeSharers.length})</h2>
        <button className="refresh-btn" onClick={fetchActiveSharers} title="Refresh list">
          ↻
        </button>
      </div>

      <div className="screen-shares-grid">
        {activeSharers.map((sharer) => {
          const stream = remoteStreams[sharer.userId];
          const isConnected = !!stream;

          return (
            <div
              key={sharer.userId}
              className={`screen-share-tile ${isConnected ? "connected" : "connecting"}`}
              onClick={() => setExpandedShare(sharer.userId)}
            >
              {/* Video element */}
              <video
                ref={(el) => {
                  if (el) videoRefs.current[sharer.userId] = el;
                }}
                className="share-video"
                autoPlay
                playsInline
                muted={false}
              />

              {/* Loading indicator */}
              {!isConnected && (
                <div className="share-loading">
                  <div className="spinner" />
                  <span>Connecting...</span>
                </div>
              )}

              {/* Tile overlay */}
              <div className="share-tile-overlay">
                <div className="tile-info">
                  <div className="tile-name">{sharer.userName || "User"}</div>
                  <div className="tile-mode">{sharer.mode?.toUpperCase() || "SCREEN"}</div>
                  <div className="tile-duration">{formatDuration(sharer.startTime)}</div>
                </div>

                {/* Fullscreen icon */}
                <button className="fullscreen-icon" title="View fullscreen">
                  ⛶
                </button>
              </div>

              {/* Connection status dot */}
              <div className={`status-indicator ${isConnected ? "active" : "pending"}`} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScreenShareViewer;
