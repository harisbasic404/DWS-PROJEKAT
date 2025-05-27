import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Contact.css';

function Contact() {
  // Scroll na vrh stranice pri otvaranju
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Stanja za korisnika, formu, toast poruku i navigaciju
  const [ulogovani, setUlogovani] = useState(null);
  const [forma, setForma] = useState({
    ime: '',
    prezime: '',
    email: '',
    telefon: '',
    poruka: ''
  });
  const [toast, setToast] = useState('');
  const navigate = useNavigate();

  // Ako je korisnik prijavljen, popunjava formu njegovim podacima iz localStorage-a
  useEffect(() => {
    const spremljen = localStorage.getItem('ulogovaniKorisnik');
    if (spremljen) {
      const korisnik = JSON.parse(spremljen);
      setUlogovani(korisnik);
      setForma((prev) => ({
        ...prev,
        ime: korisnik.ime || '',
        prezime: korisnik.prezime || '',
        email: korisnik.email || '',
        telefon: korisnik.telefon || ''
      }));
    }
  }, []);

  // Funkcija za ažuriranje stanja forme pri promjeni inputa
  const handleChange = (e) => {
    setForma({ ...forma, [e.target.name]: e.target.value });
  };

  // Slanje forme - validacija i POST zahtjev na backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { ime, prezime, email, telefon, poruka } = forma;

    // Validacija obaveznih polja
    if (!ime || !prezime || !email || !telefon || !poruka) {
      alert("Sva polja su obavezna.");
      return;
    }

    // Validacija emaila
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Unesite ispravan email.");
      return;
    }

    // Validacija telefona
    const telefonRegex = /^(\+?\d{2,3}[-\s/]?)?\d{6,}$/;
    if (!telefonRegex.test(telefon)) {
      alert("Unesite ispravan broj telefona (npr. +387 61 123 456).");
      return;
    }

    // Priprema objekta poruke za slanje
    const novaPoruka = {
      ime,
      prezime,
      email,
      telefon,
      korisnik: ulogovani?.username || '',
      poruka,
      datum: new Date().toISOString()
    };

    // Slanje poruke na backend i prikaz odgovora
    try {
      const res = await fetch("http://localhost:3001/poruke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaPoruka)
      });

      if (res.ok) {
        setForma({
          ime: ulogovani?.ime || '',
          prezime: ulogovani?.prezime || '',
          email: ulogovani?.email || '',
          telefon: ulogovani?.telefon || '',
          poruka: ''
        });
        setToast('Poruka uspješno poslana!');
        setTimeout(() => setToast(''), 3000);
      } else {
        alert("Greška pri slanju poruke.");
      }
    } catch (err) {
      alert("Došlo je do greške na serveru.");
    }
  };

  // Ako korisnik nije prijavljen, prikazuje poruku i dugme za login
  if (!ulogovani) {
    return (
      <div className="contact-page-container">
        <div className="contact-denied">
          <h2>Pristup odbijen</h2>
          <p>Molimo vas da se prijavite kako biste vidjeli kontakt formu.</p>
          <button className="login-btn" onClick={() => navigate('/login')}>
            Prijava
          </button>
        </div>
      </div>
    );
  }

  // Prikaz kontakt forme, informacija i Google mape
  return (
    <div className="contact-page-container">
      <div className="contact-card">
        <h2>Kontakt forma</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="ime"
            placeholder="Ime"
            value={forma.ime}
            onChange={handleChange}
          />
          <input
            type="text"
            name="prezime"
            placeholder="Prezime"
            value={forma.prezime}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={forma.email}
            onChange={handleChange}
          />
          <input
            type="tel"
            name="telefon"
            placeholder="Telefon"
            value={forma.telefon}
            onChange={handleChange}
          />
          <textarea
            name="poruka"
            placeholder="Vaša poruka..."
            value={forma.poruka}
            onChange={handleChange}
            rows="4"
          />
          <button type="submit">Pošalji</button>
        </form>
        {/* Prikaz toast poruke nakon uspješnog slanja */}
        {toast && <div className="toast">{toast}</div>}
        {/* Kontakt informacije firme */}
        <div className="contact-info">
          <strong>Adresa:</strong> Sarajevo, BiH<br />
          <strong>Telefon:</strong> +387 61 123 456<br />
          <strong>Email:</strong> info@buduciklasici.com<br />
          <strong>Radno vrijeme:</strong> Pon-Pet 08:00-17:00, Sub 09:00-14:00
        </div>
        {/* Google mapa sa lokacijom firme */}
        <div style={{ marginTop: 18, borderRadius: 8, overflow: 'hidden' }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4045.091068350559!2d17.911548151519266!3d44.20065402692949!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475ee238fb53d32f%3A0xf3e11869aa28a8ad!2sSTRONG%20AUTO!5e0!3m2!1shr!2sba!4v1747247084594!5m2!1shr!2sba"
            width="100%"
            height="220"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Lokacija"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default Contact;
