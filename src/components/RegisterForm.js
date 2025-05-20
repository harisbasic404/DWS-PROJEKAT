import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

function RegisterForm({ setToast, onSuccess }) {
  const [ime, setIme] = useState('');
  const [prezime, setPrezime] = useState('');
  const [email, setEmail] = useState('');
  const [telefon, setTelefon] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [poruka, setPoruka] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState(''); // Dodano

  const passwordHelp = "Lozinka mora imati najmanje 8 karaktera, veliko i malo slovo i broj.";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPoruka('');
    setUsernameError('');

    if (!email || !password || !ime || !prezime || !telefon || !username) {
      setPoruka('Sva polja su obavezna.');
      return;
    }

    // Validacija telefona
    const telefonRegex = /^(\+?\d{2,3}[-\s/]?)?\d{6,}$/;
    if (!telefonRegex.test(telefon)) {
      setPoruka('Unesite ispravan broj telefona (npr. +387 61 123 456).');
      return;
    }

    // Validacija lozinke
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passRegex.test(password)) {
      setPoruka(passwordHelp);
      return;
    }

    // Provjera jedinstvenosti username-a
    try {
      const resUser = await fetch(`http://localhost:3001/users?username=${encodeURIComponent(username)}`);
      const dataUser = await resUser.json();
      if (dataUser.length > 0) {
        setUsernameError('Korisničko ime je zauzeto.');
        return;
      }
    } catch (err) {
      setUsernameError('Greška pri provjeri korisničkog imena.');
      return;
    }

    const noviKorisnik = {
      username,
      ime,
      prezime,
      email,
      password,
      telefon,
      role: 'guest'
    };

    try {
      const res = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noviKorisnik)
      });

      if (res.ok) {
        setPoruka('Registracija uspješna!');
        setIme('');
        setPrezime('');
        setEmail('');
        setPassword('');
        setTelefon('');
        setUsername('');
        if (setToast) setToast('Registracija uspješna! Možete se prijaviti.');
        if (onSuccess) onSuccess();
      } else {
        setPoruka('Greška prilikom registracije.');
      }
    } catch (error) {
      setPoruka('Server nije dostupan.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2>Registracija</h2>

      <label>Korisničko ime:</label>
      <input
        type="text"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
          setUsernameError('');
        }}
        required
        className="input-fullwidth"
      />
      {usernameError && (
        <div style={{ color: '#b32e2e', marginBottom: 8, fontSize: '0.97em' }}>
          {usernameError}
        </div>
      )}

      <label>Ime:</label>
      <input type="text" value={ime} onChange={(e) => setIme(e.target.value)} required />

      <label>Prezime:</label>
      <input type="text" value={prezime} onChange={(e) => setPrezime(e.target.value)} required />

      <label>Email:</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

      <label>Telefon:</label>
      <PhoneInput
        country={'ba'} // default BiH, možeš promijeniti
        value={telefon}
        onChange={phone => setTelefon(phone)}
        inputProps={{
          name: 'telefon',
          required: true,
          autoFocus: false
        }}
        inputStyle={{ width: '100%' }}
      />

      <label>Lozinka:</label>
      <div className="password-field">
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input-fullwidth password-input"
        />
        <button
          type="button"
          className="show-hide-btn"
          onClick={() => setShowPassword((prev) => !prev)}
          tabIndex={-1}
          aria-label={showPassword ? "Sakrij lozinku" : "Prikaži lozinku"}
        >
          {showPassword ? (
            // Ikonica otvorenog oka
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <ellipse cx="12" cy="12" rx="10" ry="7" stroke="#8B1E1E" strokeWidth="2"/>
              <circle cx="12" cy="12" r="3" stroke="#8B1E1E" strokeWidth="2"/>
            </svg>
          ) : (
            // Ikonica oka sa crtom (zatvoreno)
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M3 3L21 21" stroke="#8B1E1E" strokeWidth="2" strokeLinecap="round"/>
              <path d="M10.58 10.58C10.21 10.95 10 11.45 10 12C10 13.1 10.9 14 12 14C12.55 14 13.05 13.79 13.42 13.42" stroke="#8B1E1E" strokeWidth="2"/>
              <path d="M17.94 17.94C16.13 19.25 14.13 20 12 20C7 20 2.73 16.11 1 12C1.73 10.27 2.87 8.73 4.34 7.59M9.9 5.08C10.59 5.03 11.29 5 12 5C17 5 21.27 8.89 23 13C22.37 14.45 21.38 15.74 20.13 16.81" stroke="#8B1E1E" strokeWidth="2"/>
            </svg>
          )}
        </button>
      </div>
      <small style={{ color: "#8B1E1E" }}>{passwordHelp}</small>

      <button type="submit">Registruj se</button>
      {poruka && <p style={{ color: 'red' }}>{poruka}</p>}
    </form>
  );
}

export default RegisterForm;
