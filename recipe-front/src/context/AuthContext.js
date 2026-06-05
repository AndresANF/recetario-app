import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // Esta IP (10.0.2.2) es para el emulador de Android. 
  // SI USAS TELÉFONO FÍSICO (Expo Go), cámbiala por la IP de tu PC (ej: 192.168.1.X)
  const API_URL = 'http://172.16.0.42:3000/api';

  const login = (user) => {
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, API_URL }}>
      {children}
    </AuthContext.Provider>
  );
};