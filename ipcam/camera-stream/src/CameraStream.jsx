import React from "react";

const CameraStream = () => {
  return (
    <div style={{ backgroundColor: "#111", minHeight: "100vh", color: "#fff", textAlign: "center", paddingTop: "30px" }}>
      <h1>Security Camera Live Stream</h1>
      <img
        src="http://192.168.0.184:5000/video_feed"
        alt="Live Stream"
        style={{
          width: "800px",
          height: "600px",
          border: "4px solid #444",
          borderRadius: "10px",
          marginTop: "20px",
        }}
      />
    </div>
  );
};

export default CameraStream;
