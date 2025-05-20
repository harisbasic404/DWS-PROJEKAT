import React, { useEffect, useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import '../styles/Login.css';

function Login() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [prikaziRegistraciju, setPrikaziRegistraciju] = useState(false);
  const [toast, setToast] = useState('');

  return (
    <div className="login-page-container">
      <div className="login-card">
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
        {prikaziRegistraciju
          ? <RegisterForm setToast={setToast} onSuccess={() => setPrikaziRegistraciju(false)} />
          : <LoginForm />}
      </div>
      {toast && (
        <div className="toast">{toast}</div>
      )}
    </div>
  );
}

export default Login;
