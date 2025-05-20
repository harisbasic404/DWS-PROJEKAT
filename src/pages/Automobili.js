import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Automobili.css';

function Automobili() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [automobili, setAutomobili] = useState([]);
  const [modalSlika, setModalSlika] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/automobili')
      .then(res => res.json())
      .then(data => setAutomobili(data));
  }, []);

  return (
    <div className="automobili-page">
      <h1>Naši automobili</h1>
      <div className="automobili-grid">
        {automobili.map(auto => (
          <div className="auto-card" key={auto.id}>
            <div className="auto-image-wrapper">
              <img src={auto.slika} alt={auto.naziv} className="car-image" />
              <span
                className="zoom-icon"
                title="Pogledaj sliku"
                onClick={() => setModalSlika(auto.slika)}
              >🔍</span>
            </div>
            <h3>{auto.naziv}</h3>
            <div className="auto-info">
              <span><strong>Godina:</strong> {auto.godiste}</span>
              <span><strong>Cijena:</strong> {auto.cijena} KM</span>
            </div>
            <p className="auto-opis">{auto.opis}</p>
            <button className="auto-btn" onClick={() => navigate('/contact')}>
              Kontaktiraj
            </button>
          </div>
        ))}
      </div>
      {modalSlika && (
        <div className="modal-overlay" onClick={() => setModalSlika(null)}>
          <img src={modalSlika} alt="Puna veličina" className="modal-image" />
        </div>
      )}
    </div>
  );
}

export default Automobili;