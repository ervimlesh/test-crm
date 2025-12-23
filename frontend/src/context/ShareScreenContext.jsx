import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { getSocket } from "./SocketContext.jsx";
import { screenShareManager } from "../services/ScreenShareManager.jsx";

/**
 * ShareScreenContext
 * Global context for managing screen sharing state
 */
const ShareScreenContext = createContext();

export const ShareScreenProvider = ({ children }) => {
  const socket = getSocket();
  const [isSharing, setIsSharing] = useState(false);
  const [shareStartTime, setShareStartTime] = useState(null);
  const [activeSharers, setActiveSharers] = useState([]);
  const [localStream, setLocalStream] = useState(null);
  // Persist remote streams and peer connections across route changes
  const [remoteStreams, setRemoteStreams] = useState({}); // { peerKey: { stream, fromAgentId, fromUserId } }
  const pcMapRef = useRef({}); // map peerKey -> RTCPeerConnection

  const addRemoteStream = (peerKey, payload) => {
    setRemoteStreams((prev) => ({ ...(prev || {}), [peerKey]: payload }));
  };

  const removeRemoteStream = (peerKey) => {
    setRemoteStreams((prev) => {
      if (!prev || !prev[peerKey]) return prev || {};
      const copy = { ...prev };
      delete copy[peerKey];
      return copy;
    });
  };

  const setPC = (peerKey, pc) => {
    pcMapRef.current = { ...(pcMapRef.current || {}), [peerKey]: pc };
  };

  const getPC = (peerKey) => {
    return pcMapRef.current ? pcMapRef.current[peerKey] : undefined;
  };

  const closePC = (peerKey) => {
    const pc = getPC(peerKey);
    if (pc) {
      try {
        pc.close();
        pc.getSenders().forEach((s) => s.track && s.track.stop());
      } catch (err) {
        console.warn("Error closing pc for", peerKey, err);
      }
      delete pcMapRef.current[peerKey];
    }
  };

  const clearAll = () => {
    Object.values(pcMapRef.current || {}).forEach((pc) => {
      try {
        pc.close();
        pc.getSenders().forEach((s) => s.track && s.track.stop());
      } catch (err) {
        // ignore
      }
    });
    pcMapRef.current = {};
    setRemoteStreams({});
  };

  useEffect(() => {
    // Initialize screen share manager
    screenShareManager.init(socket);

    // Listen for state changes
    screenShareManager.on("sharing-started", ({ stream }) => {
      setIsSharing(true);
      setShareStartTime(screenShareManager.shareStartTime);
      setLocalStream(stream);
    });

    screenShareManager.on("sharing-stopped", () => {
      setIsSharing(false);
      setShareStartTime(null);
      setLocalStream(null);
    });

    screenShareManager.on("screen-share-status", ({ activeSharers }) => {
      setActiveSharers(activeSharers || []);
    });

    // Listen to socket events
    if (socket) {
      socket.on("active-sharers-updated", ({ sharers }) => {
        setActiveSharers(sharers || []);
      });

      socket.on("user-started-sharing", ({ userId, userName, startTime }) => {
        console.log(`[ShareScreenContext] ${userName} started sharing`);
        setActiveSharers((prev) => [
          ...prev,
          { userId, userName, startTime, status: "active" },
        ]);
      });

      socket.on("user-stopped-sharing", ({ userId }) => {
        console.log(`[ShareScreenContext] User ${userId} stopped sharing`);
        setActiveSharers((prev) => prev.filter((s) => s.userId !== userId));
      });
    }

    // Restore previous state
    if (screenShareManager.isCurrentlySharing()) {
      setIsSharing(true);
      setShareStartTime(screenShareManager.shareStartTime);
    }

    return () => {
      if (socket) {
        socket.off("active-sharers-updated");
        socket.off("user-started-sharing");
        socket.off("user-stopped-sharing");
      }
    };
  }, [socket]);

  const startSharing = async (stream) => {
    return screenShareManager.startSharing(stream);
  };

  const stopSharing = async () => {
    return screenShareManager.stopSharing();
  };

  const getShareDuration = () => {
    return screenShareManager.getShareDuration();
  };

  const value = {
    isSharing,
    shareStartTime,
    activeSharers,
    localStream,
    startSharing,
    stopSharing,
    getShareDuration,
    // persistent stream/pc api
    remoteStreams,
    addRemoteStream,
    removeRemoteStream,
    pcMapRef,
    setPC,
    getPC,
    closePC,
    clearAll,
  };

  return <ShareScreenContext.Provider value={value}>{children}</ShareScreenContext.Provider>;
};

export const useShareScreen = () => {
  const context = useContext(ShareScreenContext);
  if (!context) {
    throw new Error("useShareScreen must be used within ShareScreenProvider");
  }
  return context;
};
