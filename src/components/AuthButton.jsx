// File: src/components/AuthButton.jsx
import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from '../firebase/config';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logosEnergiaUpme.svg';

export default function AuthButton() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();

  // Efecto para manejar cambios en la autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && !user.email.endsWith('@upme.gov.co')) {
        // Si hay un usuario no autorizado, cerrar sesión inmediatamente
        handleSilentLogout();
      }
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, []);

  const handleSilentLogout = async () => {
    try {
      await signOut(auth);
      setError('Solo cuentas institucionales @upme.gov.co permitidas');
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      // 1. Cerrar sesión previa si existe
      await signOut(auth);
      
      // 2. Autenticar con Google
      const result = await signInWithPopup(auth, googleProvider);
      
      // 3. Validar dominio institucional
      if (!result.user.email.endsWith('@upme.gov.co')) {
        await signOut(auth);
        setError('Solo cuentas institucionales @upme.gov.co permitidas');
        setLoading(false);
        return;
      }
      
      // 4. Redirigir solo si el correo es válido
      navigate('/dashboard');
      
    } catch (err) {
      console.error("Error de autenticación:", err);
      setError(err.message.includes('popup-closed') 
        ? 'El popup fue cerrado' 
        : 'Error al autenticar');
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
      setError('Error al cerrar sesión');
    }
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#262626]">
        <div className="text-white">Verificando autenticación...</div>
      </div>
    );
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#262626] font-sans">
      <div className="bg-[#1d1d1d] p-8 rounded shadow-md w-full max-w-sm text-white">
        <div className="flex justify-center mb-6">
          <img 
            src={logo} 
            alt="Logo Energía UPME" 
            className="h-16 object-contain"
          />
        </div>
        
        <h1 className="text-center text-xl font-bold mb-6">Centro de Monitoreo Energético</h1>
        
        {/* Contenedor de botones centrados */}
        <div className="flex flex-col items-center gap-4">
          {auth.currentUser ? (
            <button 
              onClick={handleLogout}
              className="w-full max-w-xs bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
              disabled={loading}
            >
              {loading ? 'Saliendo...' : 'Cerrar sesión'}
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="w-full max-w-xs bg-[#FFC800] hover:bg-[#e6b400] text-black px-4 py-2 rounded font-medium transition-colors flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4" opacity="0.25"/>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Autenticando...
                </>
              ) : 'Entrar con Google'}
            </button>
          )}
          
          {error && (
            <p className="mt-2 text-sm text-red-500 text-center w-full">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}