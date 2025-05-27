import React, { useState, useEffect } from "react";

// Komponenta za prikaz dugmeta za povratak na vrh stranice
const ScrollToTop = () => {
  // Stanje za vidljivost dugmeta
  const [visible, setVisible] = useState(false);

  // Praćenje scroll-a i prikaz dugmeta kada korisnik skroluje dovoljno nisko
  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.pageYOffset > 300);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Funkcija za glatko skrolanje na vrh stranice
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Prikaz dugmeta samo kada je vidljivo
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