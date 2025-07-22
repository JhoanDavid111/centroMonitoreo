// src/components/auth/AuthButton.jsx
import React, { useState } from 'react';
import { auth, googleProvider, microsoftProvider } from '../../firebase/config';
import { signInWithPopup, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logosEnergiaUpme.svg';
import { ALLOWED_DOMAINS } from '../../config/allowedDomains';

export default function AuthButton() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState({ google: false, microsoft: false });
  const navigate = useNavigate();

  // Función para validar el email con la API externa
    const validateEmailWithAPI = async (email) => {
        try {
            const response = await fetch(
                `https://script.google.com/macros/s/AKfycbwAOie4leu3GxulRCYziBv0-OTqyXxkJ77JUBFwBa4xvfUlKiTqGdvhXaLSm7UtJMp9/exec?email=${encodeURIComponent(email)}`
            );
            
            if (!response.ok) {
                throw new Error('Error al validar el email');
            }
            
            const data = await response.json();
            if (!data.success || data.count === 0) {
                return { isValid: false, error: 'Usuario no encontrado en el sistema' };
            }
            
            const userData = data.results[0];
            
            if (!userData.acceso) {
                return { isValid: false, error: 'Usuario no tiene acceso permitido' };
            }


            return {
                isValid: true,
                role: userData.rol,
                userData: userData
            };
        } catch (err) {
            console.error("Error en validación de email:", err);
            return { isValid: false, error: 'Error al validar credenciales' };
        }
    };
    //-----
  const handleLogin = async (provider, providerType) => {
    setError('');
    setLoading({ ...loading, [providerType]: true });

    try {
      await signOut(auth);
      const result = await signInWithPopup(auth, provider);
      const userEmail = result.user.email;

      // Validación de dominios permitidos
      const emailDomain = userEmail.split('@')[1];
      const isAllowed = ALLOWED_DOMAINS.some(domain =>
        emailDomain === domain || emailDomain.endsWith(`.${domain}`)
      );

      if (!userEmail || !isAllowed) {
        await signOut(auth);
        setError(`Solo cuentas con dominios permitidos: ${ALLOWED_DOMAINS.join(', ')}`);
        setLoading({ ...loading, [providerType]: false });
        return;
      }

      // Validación adicional con API externa
            const isEmailValid = await validateEmailWithAPI(userEmail);
            if (!isEmailValid) {
                await signOut(auth);
                setError(validation.error || 'No tienes permisos para acceder');
                setLoading({ ...loading, [providerType]: false });
                return;
            }
      // Actualizar el rol del usuario en el contexto // Almacenar el rol del usuario
            updateUserRole(validation.role);
      //-----
      // Redirigir al usuario después de iniciar sesión      
      navigate('/6GW+');
    } catch (err) {
      console.error("Error de autenticación:", err);
      setError(err.message.includes('popup-closed')
        ? 'El popup fue cerrado'
        : 'Error al autenticar');
      setLoading({ ...loading, [providerType]: false });
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
    <div className="min-h-screen flex items-center justify-center font-sans">
      <div className="bg-[#1d1d1d] bg-opacity-70 border border-[#666666] rounded-lg p-8 shadow-md w-full max-w-sm text-white">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo Energia UPME" className="h-16 object-contain" />
        </div>

        <h1 className="text-center text-xl font-bold mb-6">Centro de Monitoreo Energético</h1>

        <div className="flex flex-col items-center gap-4">
          {auth.currentUser ? (
            <button
              onClick={handleLogout}
              className="w-full max-w-xs bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
              disabled={loading.google || loading.microsoft}
            >
              {loading.google || loading.microsoft ? 'Saliendo...' : 'Cerrar sesión'}
            </button>
          ) : (
            <>
              <button
                onClick={() => handleLogin(googleProvider, 'google')}
                className="w-full max-w-xs bg-[#FFC800] hover:bg-[#e6b400] text-black px-4 py-2 rounded font-medium transition-colors flex items-center justify-center"
                disabled={loading.google || loading.microsoft}
              >
                {loading.google ? (
                  <>
                    <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4" opacity="0.25"/>
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Autenticando...
                  </>
                ) : 'Entrar con Google'}
              </button>

              <button
                onClick={() => handleLogin(microsoftProvider, 'microsoft')}
                className="w-full max-w-xs bg-[#0078D4] hover:bg-[#106EBE] text-white px-4 py-2 rounded font-medium transition-colors flex items-center justify-center"
                disabled={loading.google || loading.microsoft}
              >
                {loading.microsoft ? (
                  <>
                    <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4" opacity="0.25"/>
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Autenticando...
                  </>
                ) : 'Entrar con Microsoft'}
              </button>
            </>
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