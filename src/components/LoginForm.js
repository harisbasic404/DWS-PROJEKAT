import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

function LoginForm() {
  const [userInput, setUserInput] = useState(''); // Može biti email ili username
  const [password, setPassword] = useState('');
  const [poruka, setPoruka] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState('');

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userInput || !password) {
      setPoruka('Unesite email/korisničko ime i lozinku.');
      return;
    }

    // Provjeri da li je email ili username
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInput);

    try {
      const res = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [isEmail ? 'email' : 'username']: userInput,
          password
        })
      });

      if (!res.ok) {
        setPoruka('Pogrešan email/korisničko ime ili lozinka.');
        return;
      }

      const korisnik = await res.json();

      login(korisnik);

      localStorage.setItem('ulogovaniKorisnik', JSON.stringify({
        username: korisnik.username,
        ime: korisnik.ime,
        prezime: korisnik.prezime,
        email: korisnik.email,
        role: korisnik.role,
        telefon: korisnik.telefon
      }));

      if (korisnik.role === 'admin') navigate('/admin');
      else navigate('/reservation');

      setPoruka('');
    } catch (error) {
      setPoruka('Greška pri povezivanju sa serverom.');
    }
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2>Prijava</h2>

      <label>Email ili korisničko ime:</label>
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        required
        className="input-fullwidth"
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

      <button type="submit">Prijavi se</button>
      {poruka && <p style={{ color: 'red' }}>{poruka}</p>}
    </form>
  );
}

export default LoginForm;
