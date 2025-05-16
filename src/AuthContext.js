import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const spremljen = localStorage.getItem('ulogovaniKorisnik');
    return spremljen ? JSON.parse(spremljen) : null;
  });

  const login = (userData) => {
    setUser(userData);
 
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ulogovaniKorisnik');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
