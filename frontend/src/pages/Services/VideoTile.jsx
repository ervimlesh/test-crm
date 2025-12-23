import React from "react";

const VideoTile = ({ stream, muted = false, label }) => {
  const ref = React.useRef();

  React.useEffect(() => {
    if (ref.current && stream) {
      ref.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div style={{ margin: 8 }}>
      <video ref={ref} autoPlay playsInline muted={muted} style={{ width: 320, borderRadius: 8, background: "#000" }} />
      {label && <div>{label}</div>}
    </div>
  );
};

export default VideoTile;
