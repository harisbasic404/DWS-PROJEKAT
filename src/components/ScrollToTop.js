import React, { useState, useEffect } from "react";

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.pageYOffset > 300);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    visible && (
      <button
        onClick={scrollToTop}
        style={{
          position: "fixed",
          bottom: "40px",
          right: "40px",
          zIndex: 2000,
          padding: "12px 18px",
          borderRadius: "50%",
          border: "none",
          background: "#8B1E1E",
          color: "#fff",
          fontSize: "2rem",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
        }}
        aria-label="Vrati na vrh"
      >
        ↑
      </button>
    )
  );
};

export default ScrollToTop;