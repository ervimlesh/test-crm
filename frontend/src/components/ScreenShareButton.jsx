import React, { useState, useEffect } from "react";
import "./ScreenShareButton.css";

import { useShareScreen } from "../context/ShareScreenContext.jsx";
import { getSocket } from "../context/SocketContext.jsx";

/**
 * ScreenShareButton Component
 * Universal button for starting/stopping screen sharing
 * Works for both Agent and Admin roles
 * Supports full screen sharing (like Google Meet), window capture, and camera
 * Includes duration timer and status indicator
 */
const ScreenShareButton = ({
  onShareStarted,
  onShareStopped,
  showDuration = true,
  showActiveSharers = true,
}) => {
  const { isSharing, shareStartTime, activeSharers, startSharing, stopSharing } = useShareScreen();
  const socket = getSocket();
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [shareMode, setShareMode] = useState(null); // 'screen', 'window', 'camera'
  const [showModeSelector, setShowModeSelector] = useState(false);

  useEffect(() => {
    try {
      const authRaw = localStorage.getItem("auth");
      const auth = authRaw ? JSON.parse(authRaw) : null;
      setUserRole(auth?.user?.role || null);
    } catch (error) {
      console.error("Error parsing auth:", error);
    }
  }, []);

  // Timer for share duration
  useEffect(() => {
    if (!isSharing) {
      setDuration(0);
      return;
    }

    const interval = setInterval(() => {
      if (shareStartTime) {
        setDuration(Math.floor((Date.now() - shareStartTime) / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isSharing, shareStartTime]);

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const handleStartShare = async (mode = "screen") => {
    setIsLoading(true);
    setError(null);

    try {
      let stream;

      switch (mode) {
        case "screen":
          // Full screen sharing (like Google Meet)
          stream = await navigator.mediaDevices.getDisplayMedia({
            video: {
              cursor: "always", // Always show cursor
            },
            audio: true,
          });
          break;

        case "window":
          // Window sharing
          stream = await navigator.mediaDevices.getDisplayMedia({
            video: {
              cursor: "always",
            },
            audio: false,
          });
          break;

        case "camera":
          // Camera only
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
            audio: true,
          });
          break;

        default:
          stream = await navigator.mediaDevices.getDisplayMedia({
            video: { cursor: "always" },
            audio: true,
          });
      }

      const success = await startSharing(stream);
      if (success) {
        setShareMode(mode);
        setShowModeSelector(false);
        console.log(`[ScreenShareButton] ${mode} share started successfully`);
        onShareStarted?.(mode);
      } else {
        setError("Failed to start screen sharing");
      }
    } catch (err) {
      console.error("[ScreenShareButton] Error starting share:", err);

      if (err.name === "NotAllowedError") {
        setError("Screen sharing permission denied");
      } else if (err.name === "NotFoundError") {
        setError("No screens or windows available to share");
      } else if (err.name === "SecurityError") {
        setError("Screen sharing is not allowed by your browser");
      } else {
        setError("Failed to start screen sharing");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopShare = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const success = await stopSharing();
      if (success) {
        setShareMode(null);
        setShowModeSelector(false);
        console.log("[ScreenShareButton] Share stopped successfully");
        onShareStopped?.();
      } else {
        setError("Failed to stop screen sharing");
      }
    } catch (err) {
      console.error("[ScreenShareButton] Error stopping share:", err);
      setError("Failed to stop screen sharing");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="screen-share-button-container">
      {/* Share Mode Selector */}
      {!isSharing && (
        <div className="share-mode-selector">
          <button
            className={`screen-share-button ${isLoading ? "loading" : ""}`}
            onClick={() => setShowModeSelector(!showModeSelector)}
            disabled={isLoading}
            title="Select sharing mode"
          >
            <span className="share-icon">
              {isLoading ? "⏳" : "🎥"}
            </span>
            <span className="share-text">
              {isLoading ? "Loading..." : "Share Screen"}
            </span>
            <span className={`chevron ${showModeSelector ? "open" : ""}`}>▼</span>
          </button>

          {showModeSelector && (
            <div className="share-mode-menu">
              <button
                className="share-mode-option"
                onClick={() => handleStartShare("screen")}
                disabled={isLoading}
              >
                <span className="mode-icon">📺</span>
                <div className="mode-info">
                  <div className="mode-title">Share Entire Screen</div>
                  <div className="mode-description">Share your full screen</div>
                </div>
              </button>

              <button
                className="share-mode-option"
                onClick={() => handleStartShare("window")}
                disabled={isLoading}
              >
                <span className="mode-icon">📄</span>
                <div className="mode-info">
                  <div className="mode-title">Share a Window</div>
                  <div className="mode-description">Share specific application window</div>
                </div>
              </button>

              <button
                className="share-mode-option"
                onClick={() => handleStartShare("camera")}
                disabled={isLoading}
              >
                <span className="mode-icon">📷</span>
                <div className="mode-info">
                  <div className="mode-title">Share Camera</div>
                  <div className="mode-description">Share your webcam</div>
                </div>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Active Share Button */}
      {isSharing && (
        <button
          className={`screen-share-button active ${isLoading ? "loading" : ""}`}
          onClick={handleStopShare}
          disabled={isLoading}
          title="Click to stop sharing"
        >
          <span className="share-icon">🔴</span>
          <span className="share-text">
            {isLoading ? "Loading..." : "Stop Sharing"}
          </span>
          {showDuration && (
            <span className="share-duration">{formatDuration(duration)}</span>
          )}
        </button>
      )}

      {/* Error Message */}
      {error && <div className="share-error-message">{error}</div>}

      {/* Active Sharers List */}
      {showActiveSharers && activeSharers && activeSharers.length > 0 && (
        <div className="active-sharers-list">
          <div className="sharers-label">
            🔴 Active Sharers ({activeSharers.length})
          </div>
          <ul className="sharers-items">
            {activeSharers.map((sharer, idx) => (
              <li key={`${sharer.userId}-${idx}`} className="sharer-item">
                <span className="sharer-name">{sharer.userName || sharer.userId}</span>
                <span className="sharer-time">
                  {sharer.startTime
                    ? formatDuration(Math.floor((Date.now() - sharer.startTime) / 1000))
                    : ""}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Status Message */}
      {isSharing && (
        <div className="share-status-message">
          ✅ Screen sharing is active. Admins can view your screen.
        </div>
      )}

      {!isSharing && activeSharers.length > 0 && (
        <div className="share-waiting-message">
          ⏳ Other users are currently sharing. You can also start sharing.
        </div>
      )}
    </div>
  );
};

export default ScreenShareButton;
