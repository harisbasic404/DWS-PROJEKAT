import React, { useState } from 'react';

function RegisterForm() {
  const [ime, setIme] = useState('');
  const [prezime, setPrezime] = useState('');
  const [email, setEmail] = useState('');
  const [telefon, setTelefon] = useState('');
  const [password, setPassword] = useState('');
  const [poruka, setPoruka] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const passwordHelp = "Lozinka mora imati najmanje 8 karaktera, veliko i malo slovo i broj.";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !ime || !prezime || !telefon) {
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

    const noviKorisnik = {
      username: `${ime.toLowerCase()}.${prezime.toLowerCase()}`,
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

      <label>Ime:</label>
      <input type="text" value={ime} onChange={(e) => setIme(e.target.value)} required />

      <label>Prezime:</label>
      <input type="text" value={prezime} onChange={(e) => setPrezime(e.target.value)} required />

      <label>Email:</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

      <label>Telefon:</label>
      <input
        type="tel"
        value={telefon}
        onChange={(e) => setTelefon(e.target.value)}
        required
      />

      <label>Lozinka:</label>
      <div className="password-field">
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? "Sakrij lozinku" : "Prikaži lozinku"}
        >
          {showPassword ? "Sakrij" : "Prikaži"}
        </button>
      </div>
      <small style={{ color: "#8B1E1E" }}>{passwordHelp}</small>

      <button type="submit">Registruj se</button>
      {poruka && <p style={{ color: 'red' }}>{poruka}</p>}
    </form>
  );
}

export default RegisterForm;
