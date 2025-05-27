import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Services.css';

function Services() {
  // Stanje za listu svih usluga
  const [usluge, setUsluge] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Dohvatanje svih servisnih usluga sa servera pri prvom renderu
  useEffect(() => {
    fetch('http://localhost:3001/servisneUsluge')
      .then(res => res.json())
      .then(data => setUsluge(data));
  }, []);

  // Podjela usluga po kategoriji
  const mehanika = usluge.filter(u => u.kategorija === 'Mehaničke usluge');
  const detailing = usluge.filter(u => u.kategorija === 'Detailing');

  // Funkcija za rezervaciju određene usluge - šalje podatke na Reservation stranicu
  const handleRezervisi = (usluga) => {
    navigate('/reservation', { state: { izabranaUsluga: usluga } });
  };

  // Ako je korisnik došao sa već izabranom uslugom, prikazuje info o toj usluzi
  const izabrana = location.state?.izabranaUsluga;

  // Scroll na vrh stranice pri otvaranju
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="services-page-container">
      <h1>Naše usluge</h1>
      {/* Prikaz informacija o izabranoj usluzi (ako postoji) */}
      {izabrana && (
        <div className="service-selected-info">
          <strong>Odabrali ste:</strong> {izabrana.naziv} ({izabrana.cijena} KM)
        </div>
      )}
      {/* Prikaz mehaničkih usluga */}
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
      {/* Prikaz detailing usluga */}
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