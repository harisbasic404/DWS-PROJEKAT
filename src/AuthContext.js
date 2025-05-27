// Uvoz potrebnih React funkcija
import React, { createContext, useState } from 'react';

// Kreiranje AuthContext-a za dijeljenje podataka o autentikaciji kroz aplikaciju
export const AuthContext = createContext();

// Provider komponenta koja omogućava pristup autentikaciji svim child komponentama
export const AuthProvider = ({ children }) => {
  // Stanje za korisnika, inicijalno pokušava učitati korisnika iz localStorage-a
  const [user, setUser] = useState(() => {
    const spremljen = localStorage.getItem('ulogovaniKorisnik');
    return spremljen ? JSON.parse(spremljen) : null;
  });

  // Funkcija za login - postavlja korisnika u stanje
  const login = (userData) => {
    setUser(userData);
    // (Može se dodati spremanje u localStorage ako treba)
  };

  // Funkcija za logout - briše korisnika iz stanja i localStorage-a
  const logout = () => {
    setUser(null);
    localStorage.removeItem('ulogovaniKorisnik');
  };

  // Omotava child komponente i omogućava im pristup user, login i logout funkcijama
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
