import React, { useContext } from "react";
import { NavLink } from "react-router-dom"; // umjesto Link
import logo from "../assets/logo.png";
import '../styles/Header.css';
import { AuthContext } from "../AuthContext";

function Header() {
  const { user } = useContext(AuthContext);

  // Tabovi za sve korisnike
  const commonLinks = [
    { to: "/", label: "Početna" },
    { to: "/about", label: "O nama" },
    { to: "/services", label: "Usluge" },
    { to: "/Automobili", label: "Automobili" },
    { to: "/reservation", label: "Rezervacija" },
    { to: "/contact", label: "Kontakt" },
  ];

  // Tabovi za različite statuse
  let navLinks = [];
  if (!user) {
    // Nije ulogovan
    navLinks = [...commonLinks, { to: "/login", label: "Prijava" }];
  } else if (user.role === "admin") {
    // Admin
    navLinks = [
      ...commonLinks,
      { to: "/profil", label: "Profil" },
      { to: "/admin", label: "Admin dashboard" },
    ];
  } else {
    // Gost (ulogovan, ali nije admin)
    navLinks = [...commonLinks, { to: "/profil", label: "Profil" }];
  }

  return (
    <header className="header-main">
      <nav className="header-nav">
        <div className="logo-title">
          <img src={logo} alt="Logo" className="header-logo" />
          <span className="logo-text">Budući Klasici</span>
        </div>
        <ul className="nav-list">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
                end={link.to === "/"} // da samo Početna bude aktivna na /
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
