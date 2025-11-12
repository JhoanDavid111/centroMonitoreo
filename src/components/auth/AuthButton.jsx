import tokens from '../../styles/theme.js';

// src/components/auth/AuthButton.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { auth, googleProvider, microsoftProvider } from '../../firebase/config';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logosEnergiaUpme.svg';
import { ALLOWED_DOMAINS } from '../../config/allowedDomains';

// Importar los iconos SVG desde la ruta correcta
import googleIcon from '../../assets/svg-icons/google.svg';
import microsoftIcon from '../../assets/svg-icons/microsoft.svg';
import imag6dwplus from '../../assets/6gwplus.svg';

export default function AuthButton() {
  // Estado para mensajes de error al usuario
  const [error, setError] = useState('');

  // Estados de carga
  const [unifiedLoading, setUnifiedLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState({ google: false, microsoft: false });

  // Hooks de React Router
  const navigate = useNavigate();
  const location = useLocation();

  // Obtener el usuario actual y la función para actualizar su rol desde el contexto
  const { updateUserRole, currentUser } = useAuth();

  /**
   * Función memoizada para validar el correo electrónico del usuario con una API externa.
   * Nota: Esta es una API externa de Google Apps Script, no requiere React Query ya que es una validación puntual.
   */
  const validateEmailWithAPI = useCallback(async (email) => {
    try {
      // API externa de Google - mantener fetch directo pero con timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      
      const response = await fetch(
        `https://script.google.com/macros/s/AKfycbwAOie4leu3GxulRCYziBv0-OTqyXxkJ77JUBFwBa4xvfUlKiTqGdvhXaLSm7UtJMp9/exec?email=${encodeURIComponent(email)}`,
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error('Error al validar el email con la API');
      }

      const data = await response.json();

      if (!data.success || !data.results || data.results.length === 0) {
        return { isValid: false, error: 'Correo no encontrado en la lista de autorizados.' };
      }

      const userData = data.results[0];
      if (!userData.acceso) {
        return { isValid: false, error: 'Usuario no tiene acceso permitido según la lista.' };
      }

      return {
        isValid: true,
        role: userData.rol,
        userData: userData
      };
    } catch (err) {
      console.error("Error en validación de email con API:", err);
      return { isValid: false, error: 'Error al comunicarse con el servicio de autorización.' };
    }
  }, []);

  /**
   * Realiza la verificación completa de autorización del usuario.
   */
  const performAuthorizationCheck = useCallback(async (userEmail) => {
    setUnifiedLoading(true);
    setError('');

    let firebaseAuthSuccess = true;
    let domainAllowed = false;
    let apiValidationSuccess = false;

    try {
      // 1. Validación de Dominio Permitido
      const emailDomain = userEmail.split('@')[1];
      domainAllowed = ALLOWED_DOMAINS.some(domain =>
        emailDomain === domain || userEmail.endsWith(`@${domain}`)
      );

      if (!domainAllowed) {
        await signOut(auth);
        setError(`Acceso denegado: Solo se permiten dominios de ${ALLOWED_DOMAINS.join(', ')}`);
        updateUserRole(null);
        return;
      }

      // 2. Validación con la API externa
      const validation = await validateEmailWithAPI(userEmail);

      if (!validation.isValid) {
        await signOut(auth);
        setError(validation.error || 'Correo no autorizado');
        updateUserRole(null);
        return;
      }

      apiValidationSuccess = true;

      if (firebaseAuthSuccess && domainAllowed && apiValidationSuccess) {
        updateUserRole(validation.role);
        if (location.pathname === '/login' || location.pathname === '/') {
          navigate('/6GW+');
        }
      }

    } catch (err) {
      console.error("Error durante la verificación de autorización:", err);
      setError('Ocurrió un error inesperado al verificar tus credenciales.');
      await signOut(auth);
      updateUserRole(null);
    } finally {
      setUnifiedLoading(false);
      setButtonLoading({ google: false, microsoft: false });
    }
  }, [updateUserRole, validateEmailWithAPI, navigate, location.pathname]);

  /**
   * Efecto para manejar el estado de autenticación inicial de Firebase
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await performAuthorizationCheck(user.email);
      } else {
        updateUserRole(null);
        setUnifiedLoading(false);
        setButtonLoading({ google: false, microsoft: false });

        if (location.pathname !== '/login' && location.pathname !== '/') {
          navigate('/login');
        }
      }
    });

    return () => unsubscribe();
  }, [performAuthorizationCheck, updateUserRole, navigate, location.pathname]);

  /**
   * Maneja el proceso de inicio de sesión
   */
  const handleLogin = async (provider, providerType) => {
    setError('');
    setButtonLoading(prev => ({ ...prev, [providerType]: true }));
    setUnifiedLoading(true);

    try {
      await signOut(auth);
      const result = await signInWithPopup(auth, provider);
      await performAuthorizationCheck(result.user.email);
    } catch (err) {
      console.error("Error de autenticación:", err);
      setError(err.message.includes('popup-closed')
        ? 'El popup de inicio de sesión fue cerrado.'
        : 'Error al autenticar. Inténtalo de nuevo.');
      setUnifiedLoading(false);
      setButtonLoading({ google: false, microsoft: false });
      await signOut(auth);
    }
  };

  /**
   * Maneja el cierre de sesión del usuario.
   */
  const handleLogout = async () => {
    try {
      await signOut(auth);
      updateUserRole(null);
      navigate('/');
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
      setError('Error al cerrar sesión. Por favor, inténtalo de nuevo.');
    }
  };

  // Muestra el spinner global de carga
  if (unifiedLoading) {
    return (
      <div className="flex items-center justify-center w-full">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-12 w-12 text-[color:var(--accent-primary)]" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4" opacity="0.25"/>
            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          <p className="mt-4 text-white">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Contenido principal del componente
  return (
    <div className="w-full max-w-md mx-auto px-4 py-8">
      {/* Logo 6GW+ centrado en la parte superior */}
      <div className="flex justify-center mb-6">
        <img src={imag6dwplus} alt="6GW+" className="h-16 object-contain" />
      </div>

      {/* Texto descriptivo */}
      <div className="text-center mb-8">
        <p 
          className="text-gray-300 mb-4"
          style={{
            fontFamily: '"Nunito Sans", sans-serif',
            fontSize: '28px',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: '35px'
          }}
        >
          Datos en acción que impulsan la<br />
          <strong style={{ color: tokens.colors.accent.primary, fontWeight: 700 }}>
            Transición Energética Justa
          </strong>.
        </p>
      </div>

      {/* Tarjeta de autenticación */}
      <div className="bg-[color:var(--surface-overlay)] bg-opacity-70 border border-[color:var(--border-default)] rounded-lg p-8 shadow-md w-full text-white">
        {/* Logo UPME centrado */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo Energia UPME" className="h-16 object-contain" />
        </div>

        {/* Título */}
        <h1 className="text-center text-xl font-bold mb-6">Centro de monitoreo</h1>

        {/* Botones de autenticación */}
        <div className="flex flex-col items-start gap-4">
          {!currentUser && (
            <>
              <button
                onClick={() => handleLogin(googleProvider, 'google')}
                className="w-full bg-[#FFC800] hover:bg-[#e6b400] text-black px-4 py-3 rounded font-medium transition-colors flex items-center justify-center"
                disabled={buttonLoading.google}
              >
                {buttonLoading.google ? (
                  <>
                    <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4" opacity="0.25"/>
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Autenticando...
                  </>
                ) : (
                  <>
                    <img src={googleIcon} alt="Google" className="w-5 h-5 mr-3" />
                    Ingresar con Google
                  </>
                )}
              </button>

              <button
                onClick={() => handleLogin(microsoftProvider, 'microsoft')}
                className="w-full bg-[#0078D4] hover:bg-[#106EBE] text-white px-4 py-3 rounded font-medium transition-colors flex items-center justify-center"
                disabled={buttonLoading.microsoft}
              >
                {buttonLoading.microsoft ? (
                  <>
                    <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4" opacity="0.25"/>
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Autenticando...
                  </>
                ) : (
                  <>
                    <img src={microsoftIcon} alt="Microsoft" className="w-5 h-5 mr-3" />
                    Ingresar con Microsoft
                  </>
                )}
              </button>
            </>
          )}

          {/* Mensajes de error */}
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