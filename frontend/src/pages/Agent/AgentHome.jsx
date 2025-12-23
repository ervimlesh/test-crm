// /client/src/pages/AgentHome.jsx
import React, { useEffect, useRef, useState } from "react";

import { getSocket } from "../../context/SocketContext.jsx";
import { createPeerConnection } from "../Services/Webrtc.jsx";
import Layout from "../../components/Layout/Layout.jsx";
import SideBar from "../../components/SideBar.jsx";
import { useAuth } from "../../context/Auth.jsx";
import VideoTile from "../Services/VideoTile.jsx";
import ScreenShareButton from "../../components/ScreenShareButton.jsx";
import { screenShareManager } from "../../services/ScreenShareManager.jsx";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useShareScreen } from "../../context/ShareScreenContext.jsx";

// ==============================
// GLOBAL SCREEN STREAM LOCK FIX
// ==============================
if (!window.__AGENT_STREAM__) window.__AGENT_STREAM__ = null;
if (!window.__GETTING_STREAM__) window.__GETTING_STREAM__ = false;

const getScreenStream = async () => {
  if (window.__AGENT_STREAM__) return window.__AGENT_STREAM__;

  if (window.__GETTING_STREAM__) {
    return new Promise((resolve) => {
      const wait = setInterval(() => {
        if (window.__AGENT_STREAM__) {
          clearInterval(wait);
          resolve(window.__AGENT_STREAM__);
        }
      }, 200);
    });
  }
  try {
    window.__GETTING_STREAM__ = true;

    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false,
    });

    window.__AGENT_STREAM__ = stream;
    window.__GETTING_STREAM__ = false;
    localStorage.setItem("crm_screen_permission", "granted");

    stream.getTracks().forEach((track) => {
      track.onended = () => {
        window.__AGENT_STREAM__ = null;
        localStorage.removeItem("crm_screen_permission");
      };
    });

    return stream;
  } catch (err) {
    window.__GETTING_STREAM__ = false;
    return null;
  }
};

// =========================================================
// MAIN COMPONENT
// =========================================================
const AgentHome = () => {
  const { auth } = useAuth();
  const socket = getSocket();
  const navigate = useNavigate();

  const userid = auth?.user?._id || "";
  const userRole = auth?.user?.role;

  const { remoteStreams, addRemoteStream, removeRemoteStream } = useShareScreen();

  const AGENT_STREAM_KEY = `agent_${userid}`;

  const localStream = remoteStreams ? remoteStreams[AGENT_STREAM_KEY]?.stream : null;
  const localStreamRef = useRef(null);
  const agentPCMapRef = useRef({});

  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    if (screenShareManager && screenShareManager.isCurrentlySharing()) {
      setIsSharing(true);
    }
  }, []);

  // 🚀 Restore screen permission on refresh only ONCE
  useEffect(() => {
    const isFirstLoad = !window.crm_agent_home_loaded;
    window.crm_agent_home_loaded = true;

    const hasPermission = localStorage.getItem("crm_screen_permission") === "granted";

    if (isFirstLoad && hasPermission) {
      console.log("📌 Page refreshed — restoring stream...");
      getScreenStream().then((stream) => {
        if (!stream) return;
        window.agentScreenStream = stream;

        try {
          localStreamRef.current = stream;
          addRemoteStream(AGENT_STREAM_KEY, { stream, fromAgentId: userid });
          setIsSharing(true);

          stream.getTracks().forEach((track) => {
            track.addEventListener("ended", () => {
              if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach((t) => t.stop());
                localStreamRef.current = null;
              }
              removeRemoteStream(AGENT_STREAM_KEY);
              setIsSharing(false);
              localStorage.removeItem("crm_screen_permission");
            });
          });
        } catch (err) {
          console.warn("Error attaching stream after refresh:", err);
        }
      });
    }
  }, []);

  useEffect(() => {
    console.log("before socket ");
    if (!socket) return;
    console.log("after socket");

    socket.emit("join", {
      userId: userid,
      role: userRole,
      agentId: userRole === "agent" ? userid : undefined,
    });

    // ===========================
    // MAIN SCREEN SHARE HANDLER
    // ===========================
    socket.on("viewer-request", async ({ adminSocketId, adminId }) => {
      console.log("viewer-request from admin", adminSocketId, "adminId:", adminId);

      try {
        const adminKey = adminId || adminSocketId;
        const existingPC = agentPCMapRef.current[adminKey];

        if (
          existingPC &&
          existingPC.connectionState !== "closed" &&
          existingPC.connectionState !== "failed"
        ) {
          console.log(`⚠️ PC already exists for admin ${adminKey}, skipping`);
          return;
        }

        if (existingPC) {
          existingPC.close();
          existingPC.getSenders().forEach((sender) => sender.track?.stop());
          delete agentPCMapRef.current[adminKey];
        }

        // ** UPDATED: SAFE STREAM REQUEST **
        let finalStream = window.agentScreenStream;
        if (!finalStream) {
          finalStream = await getScreenStream();
          if (finalStream) window.agentScreenStream = finalStream;
        }

        if (!finalStream) {
          toast.error("Unable to restore screen. Please re-login.");
          return navigate("/login");
        }

        localStreamRef.current = finalStream;
        addRemoteStream(AGENT_STREAM_KEY, { stream: finalStream, fromAgentId: userid });
        setIsSharing(true);

        const iceServers = import.meta.env.VITE_ICE_SERVERS
          ? JSON.parse(import.meta.env.VITE_ICE_SERVERS)
          : [{ urls: "stun:stun.l.google.com:19302" }];

        const pc = createPeerConnection({
          iceServers,
          onIceCandidate: (candidate) => {
            socket.emit("ice-candidate", {
              toSocketId: adminKey,
              candidate,
            });
          },
        });

        pc.onconnectionstatechange = () => {
          const state = pc.connectionState;
          console.log(`🔌 PC state changed: ${state} for admin ${adminKey}`);

          if (["closed", "failed", "disconnected"].includes(state)) {
            if (agentPCMapRef.current[adminKey]) {
              agentPCMapRef.current[adminKey].close();
              delete agentPCMapRef.current[adminKey];
            }

            socket.emit("agent-pc-closed", {
              agentId: userid,
              adminSocketId: adminKey,
              connectionState: state,
            });
          }
        };

        finalStream.getTracks().forEach((t) => pc.addTrack(t, finalStream));

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        agentPCMapRef.current[adminKey] = pc;

        socket.emit("offer", {
          adminId: adminKey,
          toSocketId: adminKey,
          sdp: pc.localDescription,
        });
      } catch (err) {
        console.error("Error processing viewer request:", err);
      }
    });

    socket.on("answer", async ({ fromUserId, fromSocketId, sdp }) => {
      const key = fromUserId || fromSocketId;
      const pc = agentPCMapRef.current[key];
      if (pc) await pc.setRemoteDescription(new RTCSessionDescription(sdp));
    });

    socket.on("ice-candidate", async ({ fromUserId, fromSocketId, candidate }) => {
      const key = fromUserId || fromSocketId;
      const pc = agentPCMapRef.current[key];
      if (pc) await pc.addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on("admin-disconnecting", ({ adminSocketId, adminId }) => {
      const adminKey = adminId || adminSocketId;
      if (agentPCMapRef.current[adminKey]) {
        agentPCMapRef.current[adminKey].close();
        delete agentPCMapRef.current[adminKey];
      }
    });

    socket.on("disconnect", () => {
      Object.values(agentPCMapRef.current).forEach((pc) => pc.close());
      agentPCMapRef.current = {};
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
      }
      removeRemoteStream(AGENT_STREAM_KEY);
      setIsSharing(false);
    });

    return () => {
      socket.off("viewer-request");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("request-denied");
      socket.off("admin-disconnecting");
      socket.off("admin-reconnected");
    };
  }, [socket, userid, userRole, AGENT_STREAM_KEY, addRemoteStream, removeRemoteStream, navigate]);

  const stopSharing = () => {
    Object.values(agentPCMapRef.current).forEach((pc) => pc.close());
    agentPCMapRef.current = {};

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }

    window.__AGENT_STREAM__ = null;
    localStorage.removeItem("crm_screen_permission");

    removeRemoteStream(AGENT_STREAM_KEY);
    setIsSharing(false);

    if (screenShareManager) {
      screenShareManager.stopSharing();
    }

    socket?.emit("leave", { agentId: userid });
  };

  return (
    <Layout>
      <main className="crm_all_body d-flex">
        <SideBar />
        <section style={{ width: "90%", margin: "auto" }}>
          <p className="crm_title">Agent Dashboard</p>
          {/* {isSharing ? (
            <button onClick={stopSharing}>Stop Sharing</button>
          ) : (
            <p>Waiting for admin… (No permission popup next time)</p>
          )} */}

          <ScreenShareButton showDuration={true} showActiveSharers={true} />

          <VideoTile stream={localStream} muted={true} label="Your View" />
        </section>
      </main>
    </Layout>
  );
};

export default AgentHome;
