import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase/config';
import { signInWithPopup, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function AuthButton() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
        setError('Solo cuentas institucionales @upme.gov.co');
        return;
      }
      
      // 4. Redirigir al dashboard
      navigate('/dashboard');
      
    } catch (err) {
      console.error("Error de autenticación:", err);
      setError(err.message.includes('popup-closed') 
        ? 'El popup fue cerrado' 
        : 'Error al autenticar');
    } finally {
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

  return (
    <div className="auth-container">
      {auth.currentUser ? (
        <button 
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
          disabled={loading}
        >
          {loading ? 'Saliendo...' : 'Cerrar sesión'}
        </button>
      ) : (
        <button
          onClick={handleLogin}
          className="bg-[#FFC800] hover:bg-[#e6b400] text-black px-4 py-2 rounded font-medium transition-colors"
          disabled={loading}
        >
          {loading ? (
            <span className="inline-flex items-center">
              <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4" opacity="0.25"/>
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Autenticando...
            </span>
          ) : 'Entrar con Google'}
        </button>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-500 animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
}