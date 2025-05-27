import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Profil.css';

function Profil() {
  // Scroll na vrh stranice pri otvaranju
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Dohvatanje korisnika i logout funkcije iz AuthContext-a
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Stanja za korisničke upite, rezervacije i aktivni tab
  const [upiti, setUpiti] = useState([]);
  const [rezervacije, setRezervacije] = useState([]);
  const [tab, setTab] = useState('upiti');

  // Dohvatanje korisničkih upita i rezervacija sa servera pri promjeni korisnika
  useEffect(() => {
    if (user) {
      // Filtrira poruke koje pripadaju prijavljenom korisniku
      fetch('http://localhost:3001/poruke')
        .then(res => res.json())
        .then(data => {
          const filtrirane = data.filter(
            upit =>
              (upit.email && user.email && upit.email.trim().toLowerCase() === user.email.trim().toLowerCase()) ||
              (upit.korisnik && user.username && upit.korisnik.trim().toLowerCase() === user.username.trim().toLowerCase())
          );
          setUpiti(filtrirane);
        });

      // Filtrira rezervacije koje pripadaju prijavljenom korisniku
      fetch('http://localhost:3001/rezervacije')
        .then(res => res.json())
        .then(data => {
          setRezervacije(
            data.filter(
              rez =>
                (rez.email && user.email && rez.email === user.email) ||
                (rez.korisnik && user.username && rez.korisnik === user.username)
            )
          );
        });
    }
  }, [user]);

  // Funkcija za odjavu korisnika
  const handleLogout = () => {
    logout();
    navigate('/login'); // ili '/'
  };

  // Ako korisnik nije prijavljen, prikazuje poruku
  if (!user) {
    return <div className="profile-container">Morate biti prijavljeni da biste vidjeli profil.</div>;
  }

  // Prikaz profila, tabova i korisničkih podataka
  return (
    <div className="profile-page-bg">
      <div className="profile-grid">
        {/* Glavni podaci o korisniku i dugme za odjavu */}
        <section className="profile-main profile-box">
          <h2>Profil korisnika</h2>
          <p><strong>Korisničko ime:</strong> {user.username}</p>
          <p><strong>Ime:</strong> {user.ime}</p>
          <p><strong>Prezime:</strong> {user.prezime}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Telefon:</strong> {user.telefon}</p>
          <button onClick={handleLogout} className="footer-cta-btn">Odjavi se</button>
        </section>
        {/* Tabovi za prikaz upita i rezervacija */}
        <section className="profile-section profile-box">
          <div className="profile-tabs">
            <button
              className={tab === 'upiti' ? 'tab-btn active' : 'tab-btn'}
              onClick={() => setTab('upiti')}
            >
              Vaši upiti
            </button>
            <button
              className={tab === 'rezervacije' ? 'tab-btn active' : 'tab-btn'}
              onClick={() => setTab('rezervacije')}
            >
              Vaše rezervacije
            </button>
          </div>
          {/* Prikaz korisničkih upita */}
          {tab === 'upiti' && (
            <>
              {upiti.length > 0 ? (
                <ul>
                  {upiti.map((upit, idx) => (
                    <li key={idx} className="profile-card">
                      <div><strong>Ime:</strong> {upit.ime}</div>
                      <div><strong>Prezime:</strong> {upit.prezime}</div>
                      <div><strong>Email:</strong> {upit.email}</div>
                      <div><strong>Korisničko ime:</strong> {upit.korisnik}</div>
                      <div><strong>Poruka:</strong> {upit.poruka}</div>
                      {upit.datum && <div><strong>Datum:</strong> {new Date(upit.datum).toLocaleString()}</div>}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Nemate poslanih pita.</p>
              )}
            </>
          )}
          {/* Prikaz korisničkih rezervacija */}
          {tab === 'rezervacije' && (
            <>
              {rezervacije.length > 0 ? (
                <ul>
                  {rezervacije.map((rez, idx) => (
                    <li key={idx} className="profile-card">
                      {rez.username && <div><strong>Korisničko ime:</strong> {rez.username}</div>}
                      {rez.korisnik && <div><strong>Korisničko ime:</strong> {rez.korisnik}</div>}
                      <div><strong>Ime:</strong> {rez.ime}</div>
                      <div><strong>Prezime:</strong> {rez.prezime}</div>
                      <div><strong>Email:</strong> {rez.email}</div>
                      {rez.telefon && <div><strong>Telefon:</strong> {rez.telefon}</div>}
                      {rez.datum && <div><strong>Datum:</strong> {rez.datum}</div>}
                      {rez.vrijeme && <div><strong>Vrijeme:</strong> {rez.vrijeme}</div>}
                      {rez.odabraneUsluge && rez.odabraneUsluge.length > 0 && (
                        <div>
                          <strong>Odabrane usluge:</strong>
                          <ul>
                            {rez.odabraneUsluge.map((usluga, i) => (
                              <li key={i}>{usluga.naziv} - {usluga.cijena} KM</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {rez.ukupna_cijena && <div><strong>Ukupna cijena:</strong> {rez.ukupna_cijena} KM</div>}
                      {rez.napomena && <div><strong>Napomena:</strong> {rez.napomena}</div>}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Nemate rezervacija.</p>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default Profil;