import React from "react";

const Skeleton = () => {
  const shimmerStyle = {
    background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
  };

  const cardStyle = {
    background: "white",
    borderRadius: "18px",
    padding: "0 0 20px 0",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    overflow: "hidden",
  };

  const imgStyle = {
    ...shimmerStyle,
    height: "200px",
    borderRadius: "18px 18px 0 0",
  };

  const lineStyle = {
    ...shimmerStyle,
    height: "16px",
    margin: "15px 18px 0",
    borderRadius: "8px",
  };

  return (
    <>
      <style>
        {`
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}
      </style>
      <div style={cardStyle}>
        <div style={imgStyle}></div>
        <div style={lineStyle}></div>
        <div style={{ ...lineStyle, width: "60%" }}></div>
        <div style={{ ...lineStyle, width: "40%", height: "20px", marginTop: "15px" }}></div>
      </div>
    </>
  );
};

export default Skeleton;




