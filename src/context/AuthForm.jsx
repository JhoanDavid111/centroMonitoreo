// src/context/AuthForm.jsx
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [step, setStep] = useState('login'); // 'login' | '2fa' | 'authenticated'
  const [user, setUser] = useState(null);

  // Usuario de prueba
  const validUser = {
    username: 'admin',
    password: '1234',
    code: '999999' // Código 2FA fijo
  };

  const login = (username, password) => {
    if (username === validUser.username && password === validUser.password) {
      setUser({ username });
      setStep('2fa');
    } else {
      alert('Credenciales incorrectas.');
    }
  };

  const verifyCode = (code) => {
    if (code === validUser.code) {
      setStep('authenticated');
    } else {
      alert('Código de verificación incorrecto.');
    }
  };

  const logout = () => {
    setUser(null);
    setStep('login');
  };

  return (
    <AuthContext.Provider value={{ step, user, login, verifyCode, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}