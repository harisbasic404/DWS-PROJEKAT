import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Services.css';

function Services() {
  const [usluge, setUsluge] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetch('http://localhost:3001/servisneUsluge')
      .then(res => res.json())
      .then(data => setUsluge(data));
  }, []);

  // Podjela usluga po kategoriji
  const mehanika = usluge.filter(u => u.kategorija === 'Mehaničke usluge');
  const detailing = usluge.filter(u => u.kategorija === 'Detailing');

  const handleRezervisi = (usluga) => {
    // šalje izabranu uslugu na Reservation.js
    navigate('/reservation', { state: { izabranaUsluga: usluga } });
  };

  // Ako je došao sa izabranom uslugom, možeš prikazati info ovdje (opcionalno)
  const izabrana = location.state?.izabranaUsluga;

  return (
    <div className="services-page-container">
      <h1>Naše usluge</h1>
      {izabrana && (
        <div className="service-selected-info">
          <strong>Odabrali ste:</strong> {izabrana.naziv} ({izabrana.cijena} KM)
        </div>
      )}
      <div className="services-section">
        <h2>🔧 Mehaničke usluge</h2>
        <div className="services-grid">
          {mehanika.map((usluga) => (
            <div className="service-card" key={usluga.id}>
              <h3>{usluga.naziv}</h3>
              <p>{usluga.opis}</p>
              <div className="service-price">{usluga.cijena} KM</div>
              <button className="service-btn" onClick={() => handleRezervisi(usluga)}>
                Rezerviši
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="services-section">
        <h2>✨ Detailing / Čišćenje auta</h2>
        <div className="services-grid">
          {detailing.map((usluga) => (
            <div className="service-card" key={usluga.id}>
              <h3>{usluga.naziv}</h3>
              <p>{usluga.opis}</p>
              <div className="service-price">{usluga.cijena} KM</div>
              <button className="service-btn" onClick={() => handleRezervisi(usluga)}>
                Rezerviši
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Services;