import React, { useEffect, useState } from "react";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggle = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", toggle);
    return () => window.removeEventListener("scroll", toggle);
  }, []);

  const buttonStyle = {
    position: "fixed",
    bottom: "30px",
    right: "30px",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, tomato, #e74c3c)",
    color: "white",
    border: "none",
    fontSize: "24px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(255, 99, 71, 0.5)",
    transition: "all 0.3s",
    zIndex: 999,
    display: visible ? "block" : "none",
  };

  return (
    <button
      style={buttonStyle}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      onMouseEnter={(e) => {
        e.target.style.transform = "translateY(-5px) scale(1.1)";
        e.target.style.boxShadow = "0 8px 30px rgba(255, 99, 71, 0.7)";
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = "translateY(0) scale(1)";
        e.target.style.boxShadow = "0 4px 20px rgba(255, 99, 71, 0.5)";
      }}
    >
      ↑
    </button>
  );
};

export default BackToTop;




