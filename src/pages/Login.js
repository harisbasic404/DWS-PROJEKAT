import React, { useEffect, useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import '../styles/Login.css';

function Login() {
  // Scroll na vrh stranice pri otvaranju
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Stanja za prikaz forme (login/registracija) i toast poruku
  const [prikaziRegistraciju, setPrikaziRegistraciju] = useState(false);
  const [toast, setToast] = useState('');

  return (
    <div className="login-page-container">
      <div className="login-card">
        {/* Dugmad za prebacivanje između prijave i registracije */}
        <div className="login-toggle">
          <button
            className={!prikaziRegistraciju ? "active" : ""}
            onClick={() => setPrikaziRegistraciju(false)}
            type="button"
          >
            Prijava
          </button>
          <button
            className={prikaziRegistraciju ? "active" : ""}
            onClick={() => setPrikaziRegistraciju(true)}
            type="button"
          >
            Registracija
          </button>
        </div>
        {/* Prikaz odgovarajuće forme na osnovu izbora */}
        {prikaziRegistraciju
          ? <RegisterForm setToast={setToast} onSuccess={() => setPrikaziRegistraciju(false)} />
          : <LoginForm />}
      </div>
      {/* Prikaz toast poruke ako postoji */}
      {toast && (
        <div className="toast">{toast}</div>
      )}
    </div>
  );
}

export default Login;
