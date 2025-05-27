import React, { useEffect, useContext, useState } from 'react';
import { AuthContext } from '../AuthContext';
import { TextField, MenuItem, Select, Button, Checkbox, FormControlLabel } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { format, addHours, setHours, setMinutes } from "date-fns";
import '../styles/Reservation.css';

function Reservation() {
  // Scroll na vrh stranice pri otvaranju
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Dohvatanje korisnika iz AuthContext-a
  const { user } = useContext(AuthContext);

  // Stanja za usluge, formu, toast poruku i zauzete termine
  const [usluge, setUsluge] = useState([]);
  const [forma, setForma] = useState({
    ime: user?.ime || '',
    prezime: user?.prezime || '',
    email: user?.email || '',
    telefon: user?.telefon || '',
    odabraneUsluge: [],
    datum: null,
    vrijeme: "",
    ukupnaCijena: 0
  });
  const [toast, setToast] = useState('');
  const [zauzetiTermini, setZauzetiTermini] = useState([]);

  // Dohvatanje servisnih usluga sa servera pri prvom renderu
  useEffect(() => {
    fetch('http://localhost:3001/servisneUsluge')
      .then(res => res.json())
      .then(data => setUsluge(data));
  }, []);

  // Popunjavanje forme podacima korisnika ako je prijavljen
  useEffect(() => {
    if (user) {
      setForma(f => ({
        ...f,
        ime: user.ime || '',
        prezime: user.prezime || '',
        email: user.email || '',
        telefon: user.telefon || ''
      }));
    }
  }, [user]);

  // Dohvatanje zauzetih termina za odabrani datum
  useEffect(() => {
    if (forma.datum) {
      fetch("http://localhost:3001/rezervacije")
        .then(res => res.json())
        .then(data => {
          const dan = format(forma.datum, "yyyy-MM-dd");
          const zauzeti = data.filter(r => {
            if (!r.datum) return false;
            const rDatum = r.datum.length > 10 ? r.datum.slice(0, 10) : r.datum;
            return rDatum === dan;
          });
          // Formatira vrijeme na "HH:mm"
          setZauzetiTermini(zauzeti.map(r => {
            if (!r.vrijeme) return "";
            const [h, m] = r.vrijeme.split(':');
            return `${h.padStart(2, '0')}:${m.padStart(2, '0')}`;
          }));
        })
        .catch(() => setZauzetiTermini([]));
    } else {
      setZauzetiTermini([]);
    }
  }, [forma.datum]);

  // Ažuriranje forme pri promjeni inputa
  const handleChange = (e) => {
    setForma({ ...forma, [e.target.name]: e.target.value });
  };

  // Dodavanje ili uklanjanje usluge iz forme i izračun ukupne cijene
  const handleServiceChange = (usluga, checked) => {
    let updatedUsluge = [...forma.odabraneUsluge];
    if (checked) {
      updatedUsluge.push(usluga);
    } else {
      updatedUsluge = updatedUsluge.filter(u => u.naziv !== usluga.naziv);
    }
    const ukupnaCijena = updatedUsluge.reduce((total, u) => total + u.cijena, 0);
    setForma({
      ...forma,
      odabraneUsluge: updatedUsluge,
      ukupnaCijena
    });
  };

  // Slanje forme - validacija i POST zahtjev na backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { ime, prezime, email, telefon, odabraneUsluge, datum, vrijeme } = forma;
    if (!ime || !prezime || !email || !telefon || !odabraneUsluge.length || !datum || !vrijeme) {
      alert("Sva polja su obavezna.");
      return;
    }
    const rezervacija = {
      korisnik: user.username,
      ime,
      prezime,
      email,
      telefon,
      odabraneUsluge,
      datum: datum ? format(datum, "yyyy-MM-dd") : "",
      vrijeme,
      ukupna_cijena: forma.ukupnaCijena
    };
    try {
      const res = await fetch("http://localhost:3001/rezervacije", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rezervacija),
      });
      if (res.ok) {
        setToast('Rezervacija uspješno poslana!');
        setForma({
          ime: user?.ime || '',
          prezime: user?.prezime || '',
          email: user?.email || '',
          telefon: user?.telefon || '',
          odabraneUsluge: [],
          datum: null,
          vrijeme: "",
          ukupnaCijena: 0
        });
        setTimeout(() => setToast(''), 3000);
      } else if (res.status === 409) {
        alert("Odabrani termin je već zauzet. Molimo odaberite drugo vrijeme.");
      } else {
        alert("Greška pri slanju rezervacije.");
      }
    } catch (err) {
      alert("Došlo je do greške na serveru.");
    }
  };

  // Ako korisnik nije prijavljen, prikazuje poruku i dugme za login
  if (!user) {
    return (
      <div className="reservation-page-container">
        <div className="reservation-denied">
          <h2>Pristup odbijen</h2>
          <p>Molimo vas da se prijavite kako biste napravili rezervaciju.</p>
          <button className="login-btn" onClick={() => window.location.href = '/login'}>
            Prijava
          </button>
        </div>
      </div>
    );
  }

  // Prikaz forme za rezervaciju termina i usluga
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="reservation-page">
        <form className="reservation-form" onSubmit={handleSubmit}>
          <p>Korisnik: {user.username}</p>
          {/* Polja za unos podataka */}
          <TextField
            type="text"
            name="ime"
            label="Ime"
            value={forma.ime}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            type="text"
            name="prezime"
            label="Prezime"
            value={forma.prezime}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            type="email"
            name="email"
            label="Email"
            value={forma.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            type="text"
            name="telefon"
            label="Telefon"
            value={forma.telefon}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          {/* Prikaz svih dostupnih usluga sa cijenama */}
          <h3>Odaberite usluge:</h3>
          {usluge.map((usluga) => (
            <FormControlLabel
              key={usluga.naziv}
              control={
                <Checkbox
                  checked={forma.odabraneUsluge.some(u => u.naziv === usluga.naziv)}
                  onChange={(e) => handleServiceChange(usluga, e.target.checked)}
                  name="usluga"
                />
              }
              label={`${usluga.naziv} - ${usluga.cijena} KM`}
            />
          ))}

          {/* Odabir datuma rezervacije */}
          <DatePicker
            name="datum"
            label="Datum"
            value={forma.datum}
            onChange={(date) => {
              const danUSedmici = date?.getDay();
              if (danUSedmici === 0) {
                alert("Nedjeljom ne radimo. Molimo odaberite drugi dan.");
                return;
              }
              setForma({ ...forma, datum: date, vrijeme: "" });
            }}
            renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
          />

          {/* Odabir vremena rezervacije, prikazuje samo slobodne termine */}
          <Select
            name="vrijeme"
            label="Vrijeme"
            value={forma.vrijeme}
            onChange={(e) => setForma({ ...forma, vrijeme: e.target.value })}
            fullWidth
            margin="normal"
            displayEmpty
            disabled={!forma.datum || getTerminiZaDan(forma.datum).length === 0}
          >
            <MenuItem value="" disabled>
              {forma.datum
                ? getTerminiZaDan(forma.datum).length === 0
                  ? "Nema termina za odabrani dan"
                  : "Odaberite vrijeme"
                : "Prvo odaberite datum"}
            </MenuItem>
            {getTerminiZaDan(forma.datum).map((time) => {
              const isZauzet = zauzetiTermini.includes(time);
              return (
                <MenuItem
                  key={time}
                  value={time}
                  disabled={isZauzet}
                  style={{
                    color: isZauzet ? "#b30000" : "#228B22",
                    fontWeight: isZauzet ? "bold" : "normal",
                    backgroundColor: isZauzet ? "#ffe6e6" : "#e6ffe6"
                  }}
                >
                  {time} {isZauzet ? "(zauzeto)" : "(slobodno)"}
                </MenuItem>
              );
            })}
          </Select>

          {/* Prikaz ukupne cijene odabranih usluga */}
          <p>Ukupna cijena: {forma.ukupnaCijena} KM</p>

          {/* Dugme za slanje rezervacije */}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Pošaljite rezervaciju
          </Button>
        </form>
        {/* Prikaz toast poruke nakon uspješnog slanja */}
        {toast && <div className="toast">{toast}</div>}
      </div>
    </LocalizationProvider>
  );
}

// Funkcija za generisanje termina na osnovu dana u sedmici
function getTerminiZaDan(datum) {
  if (!datum) return [];
  const danUSedmici = datum.getDay(); // 0 = Nedjelja, 1 = Ponedjeljak, ..., 6 = Subota
  let termini = [];

  if (danUSedmici === 0) {
    // Nedjelja - nema termina
    return [];
  } else if (danUSedmici === 6) {
    // Subota: 09:00 - 14:00
    let time = setHours(setMinutes(datum, 0), 9);
    for (let i = 0; i < 6; i++) {
      termini.push(format(time, "HH:mm"));
      time = addHours(time, 1);
    }
  } else {
    // Ponedjeljak - Petak: 08:00 - 17:00
    let time = setHours(setMinutes(datum, 0), 8);
    for (let i = 0; i < 10; i++) {
      termini.push(format(time, "HH:mm"));
      time = addHours(time, 1);
    }
  }
  return termini;
}

export default Reservation;
