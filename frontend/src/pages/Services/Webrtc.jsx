// /client/src/utils/webrtc.js
export const createPeerConnection = ({ iceServers = [], onTrack, onIceCandidate, onNegotiationNeeded } = {}) => {
  const pc = new RTCPeerConnection({ iceServers });

  pc.ontrack = (event) => {
    onTrack && onTrack(event);
  };

  pc.onicecandidate = (event) => {
    if (event.candidate) onIceCandidate && onIceCandidate(event.candidate);
  };

  pc.onnegotiationneeded = async () => {
    onNegotiationNeeded && onNegotiationNeeded();
  };

  return pc;
};
