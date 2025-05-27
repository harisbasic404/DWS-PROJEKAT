// Uvoz React biblioteka i glavne App komponente
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Uvoz globalnih CSS stilova
import './styles/index.css';
// Uvoz AuthProvider-a za upravljanje autentikacijom kroz cijelu aplikaciju
import { AuthProvider } from './AuthContext';

// Kreiranje root elementa za React aplikaciju
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderovanje aplikacije unutar React.StrictMode i AuthProvider-a
root.render(
  <React.StrictMode>
    {/* Omotava aplikaciju u AuthProvider da bi svi dijelovi imali pristup autentikaciji */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
