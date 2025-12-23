/**
 * Example: SessionAwareAdminHome Component
 * Demonstrates how to integrate session persistence into your admin dashboard
 * 
 * This shows the recommended implementation for:
 * - Auto-restoring previous sessions on page load
 * - Displaying "Continue with Agent" option
 * - Managing WebRTC with session context
 * - Handling screen sharing within sessions
 */

import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/Auth.jsx";
import { getSocket } from "../context/SocketContext.jsx";
import { useSession } from "../context/SessionContext.jsx";
import { useShareScreen } from "../context/ShareScreenContext.jsx";
import { createPeerConnection } from "./Services/Webrtc.jsx";

const SessionAwareAdminHome = () => {
  const { auth } = useAuth();
  const socket = getSocket();
  const {
    currentSession,
    availableSessions,
    createOrRestoreSession,
    startScreenSharingInSession,
    stopScreenSharingInSession,
    endSession,
    sessionError,
    clearError,
  } = useSession();

  const {
    remoteStreams,
    addRemoteStream,
    removeRemoteStream,
    setPC,
    getPC,
    closePC,
  } = useShareScreen();

  const [agentsList, setAgentsList] = useState([]);
  const [showPreviousSessionsModal, setShowPreviousSessionsModal] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const pcRefs = useRef({});

  // ============================================================
  // SESSION INITIALIZATION & RESTORATION
  // ============================================================

  // Auto-show previous sessions on mount if available
  useEffect(() => {
    if (availableSessions && availableSessions.length > 0) {
      console.log(
        `✅ [Admin] ${availableSessions.length} previous sessions available`
      );
      setShowPreviousSessionsModal(true);
    }
  }, [availableSessions]);

  // Fetch connected agents list
  useEffect(() => {
    if (!socket) return;

    socket.on("connected-agents-list", ({ agents }) => {
      setAgentsList(agents || []);
    });

    socket.emit("get-connected-agents-list");

    return () => {
      socket.off("connected-agents-list");
    };
  }, [socket]);

  // ============================================================
  // SESSION MANAGEMENT
  // ============================================================

  // Restore previous session
  const handleRestorePreviousSession = async (session) => {
    setIsConnecting(true);
    try {
      console.log(`🔄 [Admin] Restoring session with agent ${session.agentId}`);
      await createOrRestoreSession(session.agentId, "restore");
      setShowPreviousSessionsModal(false);
    } catch (err) {
      console.error("Error restoring session:", err);
    } finally {
      setIsConnecting(false);
    }
  };

  // Start new session with agent
  const handleStartNewSession = async (agentId) => {
    setIsConnecting(true);
    try {
      console.log(`📞 [Admin] Starting new session with agent ${agentId}`);
      await createOrRestoreSession(agentId, "new");
    } catch (err) {
      console.error("Error starting session:", err);
    } finally {
      setIsConnecting(false);
    }
  };

  // ============================================================
  // WEBRTC & SIGNALING
  // ============================================================

  // Handle receiving offer from agent
  useEffect(() => {
    if (!socket || !currentSession) return;

    socket.on("offer", async ({ fromAgentId, fromSocketId, sdp, sessionId }) => {
      try {
        const peerKey = fromAgentId || fromSocketId;
        console.log(
          `📨 [Admin] Received offer from agent ${peerKey}, sessionId: ${sessionId}`
        );

        // Create peer connection
        const pc = createPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
          onIceCandidate: (candidate) => {
            socket.emit("ice-candidate", {
              toSocketId: fromSocketId,
              candidate,
              sessionId: currentSession.sessionId,
            });
          },
          onTrack: (event) => {
            console.log("🎥 [Admin] Received remote track:", event.streams[0]);
            addRemoteStream(peerKey, {
              stream: event.streams[0],
              fromAgentId,
              fromSocketId,
            });
          },
        });

        setPC(peerKey, pc);
        pcRefs.current[peerKey] = pc;

        // Set remote description and create answer
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        // Send answer back to agent
        socket.emit("answer", {
          toSocketId: fromSocketId,
          sdp: pc.localDescription,
          sessionId: currentSession.sessionId,
        });

        console.log(
          `✅ [Admin] Sent answer to agent ${peerKey} for session ${sessionId}`
        );
      } catch (error) {
        console.error("[Admin] Error handling offer:", error);
      }
    });

    return () => {
      socket.off("offer");
    };
  }, [socket, currentSession, setPC, addRemoteStream]);

  // Handle receiving ICE candidates
  useEffect(() => {
    if (!socket) return;

    socket.on("ice-candidate", ({ fromSocketId, candidate }) => {
      const pc = pcRefs.current[fromSocketId];
      if (pc) {
        pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    return () => {
      socket.off("ice-candidate");
    };
  }, [socket]);

  // ============================================================
  // SCREEN SHARING INTEGRATION
  // ============================================================

  const handleStartScreenShare = async () => {
    if (!currentSession) {
      alert("No active session");
      return;
    }

    try {
      const constraints = {
        video: {
          cursor: "always",
        },
        audio: false,
      };

      const screenStream = await navigator.mediaDevices.getDisplayMedia(constraints);

      // Notify session that screen sharing started
      await startScreenSharingInSession("screen");

      // Replace video tracks with screen stream tracks
      screenStream.getTracks().forEach((track) => {
        const sender = pcRefs.current[currentSession.agentId]
          ?.getSenders()
          .find((s) => s.track?.kind === track.kind);

        if (sender) {
          sender.replaceTrack(track);
        }

        // Handle user stopping screen share
        track.onended = async () => {
          await stopScreenSharingInSession("screen");
          // Restore camera
          restoreCameraStream();
        };
      });

      console.log("✅ [Admin] Screen sharing started in session");
    } catch (error) {
      console.error("Error starting screen share:", error);
    }
  };

  const handleStopScreenShare = async () => {
    if (!currentSession) return;

    try {
      await stopScreenSharingInSession("screen");

      // Restore camera stream
      restoreCameraStream();

      console.log("✅ [Admin] Screen sharing stopped in session");
    } catch (error) {
      console.error("Error stopping screen share:", error);
    }
  };

  const restoreCameraStream = async () => {
    try {
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      cameraStream.getTracks().forEach((track) => {
        const sender = pcRefs.current[currentSession.agentId]
          ?.getSenders()
          .find((s) => s.track?.kind === track.kind);

        if (sender) {
          sender.replaceTrack(track);
        }
      });
    } catch (error) {
      console.error("Error restoring camera:", error);
    }
  };

  // ============================================================
  // PAGE UNLOAD HANDLER
  // ============================================================

  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (currentSession) {
        console.log(
          `💾 [Admin] Saving session state before page refresh: ${currentSession.sessionId}`
        );

        // Save current state to DB for recovery
        try {
          socket?.emit("save-session-state", {
            sessionId: currentSession.sessionId,
            stateData: {
              remoteStreams: Object.keys(remoteStreams),
              audioEnabled: true,
              videoEnabled: true,
              screenSharingActive: currentSession.screenSharing?.isActive || false,
            },
          });
        } catch (err) {
          console.warn("Error saving session state:", err);
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [currentSession, remoteStreams, socket]);

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="session-aware-admin-home">
      {/* SESSION STATUS */}
      {currentSession && (
        <div className="session-status-banner">
          <span>✅ Active Session with Agent {currentSession.agentId}</span>
          <button onClick={() => endSession()}>End Session</button>
        </div>
      )}

      {/* ERROR DISPLAY */}
      {sessionError && (
        <div className="error-banner">
          {sessionError}
          <button onClick={clearError}>Dismiss</button>
        </div>
      )}

      {/* PREVIOUS SESSIONS MODAL */}
      {showPreviousSessionsModal && availableSessions.length > 0 && (
        <div className="modal">
          <div className="modal-content">
            <h3>Continue Previous Sessions</h3>
            <p>You have {availableSessions.length} previous sessions available</p>
            <div className="sessions-list">
              {availableSessions.map((session) => (
                <div key={session._id} className="session-item">
                  <div>
                    <strong>Agent ID:</strong> {session.agentId}
                    <br />
                    <small>Started: {new Date(session.startedAt).toLocaleString()}</small>
                  </div>
                  <button
                    onClick={() => handleRestorePreviousSession(session)}
                    disabled={isConnecting}
                  >
                    {isConnecting ? "Connecting..." : "Continue"}
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowPreviousSessionsModal(false)}
              className="close-btn"
            >
              Start New Session
            </button>
          </div>
        </div>
      )}

      {/* AGENTS LIST */}
      <div className="agents-section">
        <h3>Connected Agents</h3>
        <div className="agents-grid">
          {agentsList.map((agent) => (
            <div key={agent.agentId} className="agent-card">
              <h4>{agent.userName}</h4>
              <p>{agent.email}</p>
              <p className={agent.isOnline ? "status-online" : "status-offline"}>
                {agent.isOnline ? "🟢 Online" : "🔴 Offline"}
              </p>
              <button
                onClick={() => handleStartNewSession(agent.agentId)}
                disabled={isConnecting || !agent.isOnline}
              >
                {isConnecting ? "Connecting..." : "Connect"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* REMOTE STREAMS / VIDEO TILES */}
      <div className="video-section">
        <h3>Video Streams</h3>
        {Object.entries(remoteStreams).map(([peerKey, { stream }]) => (
          <video
            key={peerKey}
            ref={(ref) => {
              if (ref) ref.srcObject = stream;
            }}
            autoPlay
            playsInline
          />
        ))}
      </div>

      {/* SCREEN SHARING CONTROLS */}
      {currentSession && (
        <div className="screen-share-controls">
          {!currentSession.screenSharing?.isActive ? (
            <button onClick={handleStartScreenShare}>Start Screen Share</button>
          ) : (
            <>
              <span>Screen sharing active</span>
              <button onClick={handleStopScreenShare}>Stop Screen Share</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SessionAwareAdminHome;
