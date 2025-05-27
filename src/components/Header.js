import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom"; // umjesto Link
import logo from "../assets/logo.png";
import '../styles/Header.css';
import { AuthContext } from "../AuthContext";

function Header() {
  // Dohvatanje korisnika iz AuthContext-a i stanje za mobilni meni
  const { user } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  // Definisanje osnovnih linkova za sve korisnike
  const commonLinks = [
    { to: "/", label: "Početna" },
    { to: "/about", label: "O nama" },
    { to: "/services", label: "Usluge" },
    { to: "/Automobili", label: "Automobili" },
    { to: "/reservation", label: "Rezervacija" },
    { to: "/contact", label: "Kontakt" },
  ];

  // Prilagođavanje navigacije prema statusu korisnika
  let navLinks = [];
  if (!user) {
    // Nije ulogovan
    navLinks = [...commonLinks, { to: "/login", label: "Prijava" }];
  } else if (user.role === "admin") {
    // Admin korisnik
    navLinks = [
      ...commonLinks,
      { to: "/profil", label: "Profil" },
      { to: "/admin", label: "Admin dashboard" },
    ];
  } else {
    // Ulogovan korisnik (gost)
    navLinks = [...commonLinks, { to: "/profil", label: "Profil" }];
  }

  return (
    <header className="header-main">
      <nav className="header-nav">
        {/* Logo i naziv firme */}
        <div className="logo-title">
          <img src={logo} alt="Logo" className="header-logo" />
          <span className="logo-text">Budući Klasici</span>
        </div>
        {/* Overlay za zatvaranje menija na mobilnim uređajima */}
        {menuOpen && (
          <div
            className="nav-overlay"
            onClick={() => setMenuOpen(false)}
            tabIndex={-1}
          />
        )}
        {/* Burger dugme za otvaranje/zatvaranje menija na mobilnim uređajima */}
        <div
          className={`burger${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Otvori meni"
          tabIndex={0}
          role="button"
        >
          <span />
          <span />
          <span />
        </div>
        {/* Navigaciona lista sa linkovima */}
        <ul className={`nav-list${menuOpen ? " open" : ""}`}>
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
                end={link.to === "/"}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
