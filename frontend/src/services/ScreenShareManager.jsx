/**
 * ScreenShareManager Service
 * Manages screen sharing state persistence across page refreshes
 * Handles localStorage, socket events, and stream management
 * Supports full screen, window, and camera sharing
 */

const STORAGE_KEY = "crm_screen_share_state";
const STORAGE_STREAM_KEY = "crm_screen_share_active";

class ScreenShareManager {
  constructor() {
    this.isSharing = false;
    this.shareStartTime = null;
    this.shareMode = null; // 'screen', 'window', 'camera'
    this.socket = null;
    this.localStream = null;
    this.pcRefs = {};
    this.listeners = {};
  }

  /**
   * Initialize the manager with socket instance
   */
  init(socket) {
    this.socket = socket;
    this.restoreState();
    this.setupSocketListeners();
  }

  /**
   * Restore sharing state from localStorage
   */
  restoreState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const state = JSON.parse(stored);
        this.isSharing = state.isSharing || false;
        this.shareStartTime = state.shareStartTime || null;
        this.shareMode = state.shareMode || null;

        // If was sharing before, notify socket to continue
        if (this.isSharing && this.socket) {
          console.log(`[ScreenShareManager] Restoring ${this.shareMode} share state after page refresh`);
          this.socket.emit("screen-share-restored", {
            timestamp: this.shareStartTime,
            mode: this.shareMode,
          });
        }
      }
    } catch (error) {
      console.error("[ScreenShareManager] Error restoring state:", error);
    }
  }

  /**
   * Persist sharing state to localStorage
   */
  saveState() {
    try {
      const state = {
        isSharing: this.isSharing,
        shareStartTime: this.shareStartTime,
        shareMode: this.shareMode,
        timestamp: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("[ScreenShareManager] Error saving state:", error);
    }
  }

  /**
   * Setup socket listeners for screen share events
   */
  setupSocketListeners() {
    if (!this.socket) return;

    this.socket.on("screen-share-request", ({ adminSocketId, adminId }) => {
      this.emit("screen-share-request", { adminSocketId, adminId });
    });

    this.socket.on("screen-share-stopped", ({ fromUserId }) => {
      this.emit("screen-share-stopped", { fromUserId });
    });

    this.socket.on("screen-share-status", ({ activeSharers }) => {
      this.emit("screen-share-status", { activeSharers });
    });

    // Listen for stream stop event (when source was stopped by user)
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        track.onended = () => {
          console.log("[ScreenShareManager] Stream ended by user");
          this.stopSharing();
        };
      });
    }
  }

  /**
   * Start screen sharing and setup peer connections to stream to all viewers
   */
  async startSharing(stream, mode = "screen") {
    try {
      this.localStream = stream;
      this.isSharing = true;
      this.shareStartTime = Date.now();
      this.shareMode = mode;
      this.saveState();

      // Listen for stream track ended (user stops sharing from browser UI)
      stream.getTracks().forEach((track) => {
        track.onended = () => {
          console.log(`[ScreenShareManager] ${mode} track ended by user`);
          this.stopSharing();
        };
      });

      // Notify socket about screen share start
      if (this.socket) {
        this.socket.emit("screen-share-started", {
          startTime: this.shareStartTime,
          mode: mode,
        });

        // Listen for viewers requesting the stream
        this.socket.on("request-screen-share-stream", async ({ viewerUserId }) => {
          console.log(
            `[ScreenShareManager] Viewer userId=${viewerUserId} requested screen stream`
          );

          // Create and send offer to viewer
          if (this.localStream) {
            await this.sendScreenShareOfferToViewer(viewerUserId, this.localStream);
          }
        });
      }

      this.emit("sharing-started", { stream, mode });
      console.log(`[ScreenShareManager] ${mode} sharing started`);
      return true;
    } catch (error) {
      console.error("[ScreenShareManager] Error starting share:", error);
      return false;
    }
  }

  /**
   * Send screen share offer to a viewer
   */
  async sendScreenShareOfferToViewer(viewerUserId, stream) {
    try {
      console.log(
        `[ScreenShareManager] Creating peer connection for viewer userId=${viewerUserId}`
      );

      // Access environment variables
      let iceServers = [{ urls: "stun:stun.l.google.com:19302" }];
      try {
        if (import.meta.env.VITE_ICE_SERVERS) {
          iceServers = JSON.parse(import.meta.env.VITE_ICE_SERVERS);
        }
      } catch (e) {
        console.warn("[ScreenShareManager] Error parsing ICE servers, using default");
      }

      // Dynamic import to avoid circular dependency
      const { createPeerConnection } = await import("../pages/Services/Webrtc.jsx");

      const pc = createPeerConnection({
        iceServers,
        onIceCandidate: (candidate) => {
          if (this.socket) {
            console.log(
              `[ScreenShareManager] Sending ICE candidate to viewer userId=${viewerUserId}`
            );
            this.socket.emit("screen-share-ice-candidate", {
              toUserId: viewerUserId,
              candidate,
            });
          }
        },
      });

      // Add all tracks from the shared stream
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      // Store reference
      this.pcRefs[viewerUserId] = pc;

      // Create and send offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      if (this.socket) {
        console.log(
          `[ScreenShareManager] Sending screen share offer to viewer userId=${viewerUserId}`
        );
        this.socket.emit("screen-share-offer", {
          toUserId: viewerUserId,
          sdp: pc.localDescription,
        });
      }

      console.log(`[ScreenShareManager] Sent screen share offer to viewer ${viewerUserId}`);

      // Listen for answer from viewer via user ID room
      const handleAnswer = async ({ viewerUserId: answerFromViewerId, sdp }) => {
        if (answerFromViewerId === viewerUserId) {
          console.log(
            `[ScreenShareManager] Received answer from viewer userId=${viewerUserId}`
          );
          try {
            const pc = this.pcRefs[viewerUserId];
            if (pc) {
              await pc.setRemoteDescription(new RTCSessionDescription(sdp));
              console.log(`[ScreenShareManager] Set remote description for viewer ${viewerUserId}`);
              // Remove listener after handling answer
              this.socket.off("screen-share-answer", handleAnswer);
            }
          } catch (error) {
            console.error(
              `[ScreenShareManager] Error setting remote description:`,
              error
            );
          }
        }
      };

      if (this.socket) {
        this.socket.on("screen-share-answer", handleAnswer);
      }
    } catch (error) {
      console.error(
        `[ScreenShareManager] Error sending screen share offer to viewer:`,
        error
      );
    }
  }

  /**
   * Stop screen sharing
   */
  async stopSharing() {
    try {
      const mode = this.shareMode;
      this.isSharing = false;
      this.shareStartTime = null;
      this.shareMode = null;
      this.saveState();

      // Stop all tracks
      if (this.localStream) {
        this.localStream.getTracks().forEach((track) => {
          try {
            track.stop();
          } catch (err) {
            console.warn("Error stopping track:", err);
          }
        });
        this.localStream = null;
      }

      // Close all peer connections
      Object.values(this.pcRefs).forEach((pc) => {
        try {
          pc?.close();
        } catch (err) {
          console.warn("Error closing peer connection:", err);
        }
      });
      this.pcRefs = {};

      // Notify socket about screen share stop
      if (this.socket) {
        this.socket.emit("screen-share-stopped-user", {
          stoppedAt: Date.now(),
          mode: mode,
        });
      }

      this.emit("sharing-stopped", { mode });
      console.log(`[ScreenShareManager] ${mode} sharing stopped`);
      return true;
    } catch (error) {
      console.error("[ScreenShareManager] Error stopping share:", error);
      return false;
    }
  }

  /**
   * Check if currently sharing
   */
  isCurrentlySharing() {
    return this.isSharing;
  }

  /**
   * Get share duration
   */
  getShareDuration() {
    if (!this.isSharing || !this.shareStartTime) return 0;
    return Date.now() - this.shareStartTime;
  }

  /**
   * Get current share mode
   */
  getShareMode() {
    return this.shareMode;
  }

  /**
   * Store peer connection reference
   */
  addPeerConnection(id, pc) {
    this.pcRefs[id] = pc;
  }

  /**
   * Remove peer connection reference
   */
  removePeerConnection(id) {
    if (this.pcRefs[id]) {
      try {
        this.pcRefs[id].close();
      } catch (err) {
        console.warn("Error closing peer connection:", err);
      }
      delete this.pcRefs[id];
    }
  }

  /**
   * Event listener management
   */
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
    }
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback) => callback(data));
    }
  }

  /**
   * Clear all state
   */
  clear() {
    this.isSharing = false;
    this.shareStartTime = null;
    this.shareMode = null;
    this.localStream = null;
    this.pcRefs = {};
    localStorage.removeItem(STORAGE_KEY);
  }
}

// Export singleton instance
export const screenShareManager = new ScreenShareManager();
export default ScreenShareManager;
