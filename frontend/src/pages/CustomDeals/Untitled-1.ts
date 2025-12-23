/*
CRM Google-Meet style meeting pages - production-ready (single-file bundle for canvas preview)

What this file contains (all ready-to-paste into your project):
- MeetingProvider (context & WebRTC management + socket signaling)
- useLocalStream hook
- VideoTile component (shows remote / local video + name & mic status)
- Controls component (toggle cam/mic, screen share, leave)
- ParticipantList component
- AdminHome and AgentHome pages (role-aware wrappers)
- minimal client-side socket.io signaling server snippet (Node) in README at the bottom

How to use:
1) Install dependencies: react, react-dom, socket.io-client, simple-peer (for WebRTC fallback help), uuid, tailwindcss (or adapt classes to your CSS).
   npm i socket.io-client simple-peer uuid
2) Add a signaling server (example included below). IMPORTANT: provide STUN/TURN servers in `iceServers` for production.
3) Import AdminHome or AgentHome into your routes. AdminHome shows moderator controls (mute participant), AgentHome is a normal participant view.

Notes for production hardening:
- Use TURN servers for NAT traversal (Coturn or commercial providers).
- Secure signaling with TLS, authentication tokens, server-side validation of actions (mute, remove participant).
- Persist meeting metadata in DB if needed (start/stop times, recordings metadata).
- Consider using MediaServer (Janus/Jitsi/Mediasoup) for >8-12 participants or for recording, bandwidth optimizations.

--------------------------------------------------------------------------------
IMPORTANT: This single-file is intentionally verbose and annotated. You can split into files when adding to your repo.
--------------------------------------------------------------------------------
*/

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import SimplePeer from 'simple-peer';
import { v4 as uuidv4 } from 'uuid';

// -----------------------------
// Configuration (change for your deployment)
// -----------------------------
const SIGNALING_SERVER = (window.__SIGNALING_URL__ || '/'); // e.g. https://your-signaling-domain.com
const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  // Add TURN servers for production
  // { urls: 'turn:turn.example.com:3478', username: 'user', credential: 'pass' }
];

// -----------------------------
// Meeting Context & Provider
// -----------------------------
const MeetingContext = createContext(null);

export function useMeeting() {
  return useContext(MeetingContext);
}

export function MeetingProvider({ roomId, user, children, isModerator = false }) {
  // user = { id, name, role }
  const socketRef = useRef(null);
  const peersRef = useRef({}); // { peerId: { peer: SimplePeer, user } }
  const [participants, setParticipants] = useState([]); // [{id, name, muted, stream, isLocal}]
  const localStreamRef = useRef(null);
  const [joined, setJoined] = useState(false);
  const [screenStream, setScreenStream] = useState(null);

  // Connect to signaling server
  useEffect(() => {
    socketRef.current = io(SIGNALING_SERVER, { autoConnect: false });
    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('signaling connected', socket.id);
    });

    // When a new participant joins, we receive their user info and we should create an offer
    socket.on('participant-joined', async (payload) => {
      const { id: remoteSocketId, user: remoteUser } = payload;
      console.log('participant-joined', remoteSocketId, remoteUser);
      await createPeerConnection(remoteSocketId, remoteUser, true);
    });

    // Incoming offer
    socket.on('webrtc-offer', async (payload) => {
      const { from, offer, user: remoteUser } = payload;
      console.log('webrtc-offer from', from);
      await createPeerConnection(from, remoteUser, false, offer);
    });

    // answer to our offer
    socket.on('webrtc-answer', (payload) => {
      const { from, answer } = payload;
      const meta = peersRef.current[from];
      if (meta && meta.peer) {
        meta.peer.signal(answer);
      }
    });

    // remote ICE candidate
    socket.on('webrtc-candidate', (payload) => {
      const { from, candidate } = payload;
      const meta = peersRef.current[from];
      if (meta && meta.peer) {
        meta.peer.signal(candidate);
      }
    });

    // participant left
    socket.on('participant-left', (payload) => {
      const { id: leftId } = payload;
      cleanupPeer(leftId);
    });

    // moderator mutes participant
    socket.on('moderator-action', ({ action, targetId }) => {
      if (action === 'mute') {
        setParticipants((prev) => prev.map(p => p.id === targetId ? { ...p, muted: true } : p));
        // if target is local user, mute mic
        if (user && user.id === targetId) {
          muteLocalAudio(true);
        }
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [roomId, user]);

  // Helpers to manage local stream
  const startLocalStream = useCallback(async (constraints = { video: true, audio: true }) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;
      addOrUpdateParticipant({ id: user.id, name: user.name, stream, isLocal: true, muted: !stream.getAudioTracks().some(t => t.enabled) });
      return stream;
    } catch (err) {
      console.error('getUserMedia failed', err);
      throw err;
    }
  }, [user]);

  const stopLocalStream = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop());
      localStreamRef.current = null;
      setParticipants(prev => prev.filter(p => !p.isLocal));
    }
  }, []);

  const muteLocalAudio = useCallback((mute = true) => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(t => t.enabled = !mute);
      setParticipants(prev => prev.map(p => p.isLocal ? { ...p, muted: mute } : p));
      // notify others
      socketRef.current?.emit('update-mute', { roomId, userId: user.id, muted: mute });
    }
  }, [roomId, user]);

  const toggleCamera = useCallback((enable) => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(t => t.enabled = enable);
      setParticipants(prev => prev.map(p => p.isLocal ? { ...p, cameraOn: enable } : p));
    }
  }, []);

  const addOrUpdateParticipant = useCallback((participant) => {
    setParticipants(prev => {
      const exists = prev.find(p => p.id === participant.id);
      if (exists) return prev.map(p => p.id === participant.id ? { ...p, ...participant } : p);
      return [...prev, participant];
    });
  }, []);

  const cleanupPeer = useCallback((peerSocketId) => {
    const meta = peersRef.current[peerSocketId];
    if (meta) {
      try { meta.peer.destroy(); } catch (e) { /* ignore */ }
      delete peersRef.current[peerSocketId];
    }
    setParticipants(prev => prev.filter(p => p.id !== peerSocketId));
  }, []);

  // Create peer connection (offerer or answerer)
  const createPeerConnection = useCallback(async (remoteSocketId, remoteUser, amOfferer = true, remoteOffer = null) => {
    if (peersRef.current[remoteSocketId]) {
      console.warn('peer already exists', remoteSocketId);
      return;
    }

    const initiator = amOfferer;
    const peer = new SimplePeer({ initiator, trickle: true, stream: localStreamRef.current || undefined, config: { iceServers: ICE_SERVERS } });

    peer.on('signal', data => {
      // data can be offer/answer or candidate
      if (data.type === 'offer') {
        socketRef.current?.emit('webrtc-offer', { to: remoteSocketId, offer: data, user });
      } else if (data.type === 'answer') {
        socketRef.current?.emit('webrtc-answer', { to: remoteSocketId, answer: data });
      } else if (data.candidate) {
        socketRef.current?.emit('webrtc-candidate', { to: remoteSocketId, candidate: data });
      }
    });

    peer.on('stream', stream => {
      // add remote stream as participant
      addOrUpdateParticipant({ id: remoteSocketId, name: remoteUser?.name || 'Participant', stream, muted: false, isLocal: false });
    });

    peer.on('close', () => cleanupPeer(remoteSocketId));
    peer.on('error', (err) => { console.error('peer error', err); cleanupPeer(remoteSocketId); });

    peersRef.current[remoteSocketId] = { peer, user: remoteUser };

    // If we received a remote offer (we are answerer)
    if (remoteOffer) {
      peer.signal(remoteOffer);
    }

    return peer;
  }, [addOrUpdateParticipant, cleanupPeer, user]);

  // Join meeting (connect socket and announce)
  const join = useCallback(async () => {
    
    const socket = socketRef.current;
    if (!socket) throw new Error('Socket not initialized');
    socket.connect();
    // ensure local stream exists before announcing
    if (!localStreamRef.current) {
      try { await startLocalStream(); } catch (e) { console.warn('startLocalStream failed'); }
    }
    socket.emit('join-room', { roomId, user });
    setJoined(true);
  }, [roomId, startLocalStream, user]);

  const leave = useCallback(() => {
    // inform server
    socketRef.current?.emit('leave-room', { roomId, userId: user.id });
    // cleanup
    Object.keys(peersRef.current).forEach(k => {
      try { peersRef.current[k].peer.destroy(); } catch (e) { }
      delete peersRef.current[k];
    });
    stopLocalStream();
    setJoined(false);
  }, [roomId, stopLocalStream, user]);

  // screen share toggle
  const toggleScreenShare = useCallback(async () => {
    if (screenStream) {
      // stop screen
      screenStream.getTracks().forEach(t => t.stop());
      setScreenStream(null);
      // restore camera track
      const camTracks = localStreamRef.current?.getVideoTracks();
      if (camTracks && camTracks.length) {
        // replace tracks on peers
        Object.values(peersRef.current).forEach(({ peer }) => {
          try { peer.replaceTrack ? peer.replaceTrack(screenStream.getVideoTracks()[0], camTracks[0], localStreamRef.current) : null; } catch (e) {}
        });
      }
      return;
    }

    try {
      const s = await (navigator.mediaDevices as any).getDisplayMedia({ video: true });
      setScreenStream(s);
      // replace track on each peer
      Object.values(peersRef.current).forEach(({ peer }) => {
        try { peer.replaceTrack(localStreamRef.current.getVideoTracks()[0], s.getVideoTracks()[0], localStreamRef.current); } catch (e) { /* some browsers */ }
      });

      s.getVideoTracks()[0].addEventListener('ended', () => {
        // when screen share stops
        setScreenStream(null);
      });
    } catch (e) {
      console.error('screen share failed', e);
    }
  }, [screenStream]);

  // moderator controls (emit to server to action)
  const moderatorMute = useCallback((targetId) => {
    socketRef.current?.emit('moderator-action', { roomId, action: 'mute', targetId });
  }, [roomId]);

  // Expose context
  const value = {
    socket: socketRef.current,
    startLocalStream,
    stopLocalStream,
    join,
    leave,
    toggleScreenShare,
    muteLocalAudio,
    toggleCamera,
    participants,
    localStream: localStreamRef.current,
    joined,
    isModerator,
    moderatorMute,
    roomId,
    user
  };

  return (
    <MeetingContext.Provider value={value}>
      {children}
    </MeetingContext.Provider>
  );
}

// -----------------------------
// useLocalStream Hook (convenience)
// -----------------------------
export function useLocalStream() {
  const { startLocalStream, stopLocalStream, localStream, muteLocalAudio } = useMeeting();
  return { startLocalStream, stopLocalStream, localStream, muteLocalAudio };
}

// -----------------------------
// UI: VideoTile
// -----------------------------
export function VideoTile({ participant }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;
    if (participant.stream) {
      try { videoRef.current.srcObject = participant.stream; }
      catch (e) { console.warn('assign srcObject failed', e); }
    }
  }, [participant.stream]);

  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden flex flex-col items-stretch">
      <video ref={videoRef} autoPlay playsInline muted={participant.isLocal} className="w-full h-48 object-cover" />
      <div className="p-2 bg-black bg-opacity-40 text-white flex items-center justify-between">
        <div className="truncate">{participant.name}{participant.isLocal ? ' (you)' : ''}</div>
        <div className="flex items-center space-x-2">
          <span className={`text-sm ${participant.muted ? 'text-red-400' : 'text-green-300'}`}>{participant.muted ? 'Muted' : 'Mic'}</span>
        </div>
      </div>
    </div>
  );
}

// -----------------------------
// UI: Controls
// -----------------------------
export function Controls() {
  const { muteLocalAudio, toggleCamera, toggleScreenShare, leave, participants, join, joined } = useMeeting();
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  useEffect(() => {
    // infer from participants local
  }, [participants]);

  const onToggleMic = () => { muteLocalAudio(!micOn); setMicOn(!micOn); };
  const onToggleCam = () => { toggleCamera(!camOn); setCamOn(!camOn); };
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 p-3 rounded-xl shadow-lg flex items-center gap-3 z-50">
      {!joined ? (
        <button onClick={join} className="px-4 py-2 rounded bg-blue-600 text-white">Join</button>
      ) : (
        <>
          <button onClick={onToggleMic} className="px-3 py-2 rounded border">{micOn ? 'Mute' : 'Unmute'}</button>
          <button onClick={onToggleCam} className="px-3 py-2 rounded border">{camOn ? 'Stop Cam' : 'Start Cam'}</button>
          <button onClick={toggleScreenShare} className="px-3 py-2 rounded border">Share Screen</button>
          <button onClick={leave} className="px-3 py-2 rounded bg-red-600 text-white">Leave</button>
        </>
      )}
    </div>
  );
}

// -----------------------------
// UI: ParticipantList
// -----------------------------
export function ParticipantList() {
  const { participants, isModerator, moderatorMute } = useMeeting();
  return (
    <div className="w-64 bg-white shadow p-3 h-full overflow-auto">
      <h3 className="font-semibold mb-2">Participants ({participants.length})</h3>
      <ul className="space-y-2">
        {participants.map(p => (
          <li key={p.id} className="flex items-center justify-between">
            <div className="truncate">{p.name}{p.isLocal ? ' (you)' : ''}</div>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${p.muted ? 'text-red-500' : 'text-green-600'}`}>{p.muted ? 'Muted' : 'Mic'}</span>
              {isModerator && !p.isLocal && (
                <button onClick={() => moderatorMute(p.id)} className="text-xs px-2 py-1 bg-gray-100 rounded">Mute</button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// -----------------------------
// Pages: AdminHome and AgentHome
// -----------------------------
export function AdminHome({ roomId, user }) {
  return (
    <MeetingProvider roomId={roomId} user={user} isModerator={true}>
      <div className="min-h-screen bg-gray-100 p-6 flex">
        <div className="flex-1 grid grid-cols-3 gap-4">
          <MainGrid />
        </div>
        <div className="w-80">
          <ParticipantList />
        </div>
        <Controls />
      </div>
    </MeetingProvider>
  );
}

export function AgentHome({ roomId, user }) {
  return (
    <MeetingProvider roomId={roomId} user={user} isModerator={false}>
      <div className="min-h-screen bg-gray-100 p-6 flex">
        <div className="flex-1 grid grid-cols-3 gap-4">
          <MainGrid />
        </div>
        <div className="w-80">
          <ParticipantList />
        </div>
        <Controls />
      </div>
    </MeetingProvider>
  );
}

// -----------------------------
// UI: Main grid that shows participants in Google-meet style responsive grid
// -----------------------------
function MainGrid() {
  const { participants } = useMeeting();

  // Responsive: show 1-4 columns depending on count (simple strategy)
  let cols = 1;
  if (participants.length <= 1) cols = 1;
  else if (participants.length <= 4) cols = 2;
  else if (participants.length <= 9) cols = 3;
  else cols = 4;

  return (
    <div className={`grid grid-cols-${cols} gap-4`}>
      {participants.map(p => (
        <VideoTile key={p.id} participant={p} />
      ))}
    </div>
  );
}

// -----------------------------
// README: Signaling server example (Node + socket.io)
// Save as server.js on your signaling host
// -----------------------------

/*
// -- server.js (example)

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const rooms = {}; // basic in-memory room mapping: { roomId: { sockets: [socketId], users: { socketId: user } } }

io.on('connection', socket => {
  console.log('socket connected', socket.id);

  socket.on('join-room', ({ roomId, user }) => {
    socket.join(roomId);
    socket.data.user = user || { id: socket.id, name: 'Anonymous' };
    rooms[roomId] = rooms[roomId] || { sockets: [], users: {} };
    rooms[roomId].sockets.push(socket.id);
    rooms[roomId].users[socket.id] = socket.data.user;

    // notify existing
    socket.to(roomId).emit('participant-joined', { id: socket.id, user: socket.data.user });

    // optionally send existing participants list to the new joiner
    const others = rooms[roomId].sockets.filter(sid => sid !== socket.id).map(sid => ({ id: sid, user: rooms[roomId].users[sid] }));
    socket.emit('existing-participants', others);
  });

  socket.on('webrtc-offer', ({ to, offer, user }) => {
    io.to(to).emit('webrtc-offer', { from: socket.id, offer, user });
  });
  socket.on('webrtc-answer', ({ to, answer }) => {
    io.to(to).emit('webrtc-answer', { from: socket.id, answer });
  });
  socket.on('webrtc-candidate', ({ to, candidate }) => {
    io.to(to).emit('webrtc-candidate', { from: socket.id, candidate });
  });

  socket.on('moderator-action', ({ roomId, action, targetId }) => {
    // server should authorize/moderator - DO NOT trust client-sent moderator flag in production
    io.to(roomId).emit('moderator-action', { action, targetId });
  });

  socket.on('leave-room', ({ roomId, userId }) => {
    socket.leave(roomId);
    if (rooms[roomId]) {
      rooms[roomId].sockets = rooms[roomId].sockets.filter(s => s !== socket.id);
      delete rooms[roomId].users[socket.id];
      socket.to(roomId).emit('participant-left', { id: socket.id });
    }
  });

  socket.on('disconnect', () => {
    // cleanup from rooms
    Object.keys(rooms).forEach(rid => {
      if (rooms[rid].sockets.includes(socket.id)) {
        rooms[rid].sockets = rooms[rid].sockets.filter(s => s !== socket.id);
        delete rooms[rid].users[socket.id];
        socket.to(rid).emit('participant-left', { id: socket.id });
      }
    });
  });
});

server.listen(3000, () => console.log('signaling server listening on 3000'));

// -- End server example
*/

/*
Production checklist (short):
- Use TURN servers
- Authenticate participants on socket connect (validate JWT)
- Rate limit signaling events
- Use server-side validation for moderator actions
- Monitor CPU/BW. If many participants, use SFU (Mediasoup/Janus/Jitsi)
- Use HTTPS/WSS
*/

// Export default small helper so preview renders
export default function MeetingPreview() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-3">CRM Google-Meet style meeting bundle</h2>
      <p className="mb-2">This canvas contains AdminHome, AgentHome and all helper components. Paste pieces into your project and split into files.</p>
      <p className="text-sm text-gray-600">Remember to add a signaling server and TURN servers for production.</p>
    </div>
  );
}
