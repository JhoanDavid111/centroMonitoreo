import React, { useState } from 'react';
import { auth, googleProvider } from '../../firebase/config';
import { signInWithPopup, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logosEnergiaUpme.svg';
import { ALLOWED_DOMAINS } from '../../config/allowedDomains';
import { AUTHORIZED_MICROSOFT_USERS } from '../../config/authorizedMicrosoftUsers';
import { useManualAuth } from '../../context/ManualAuthContext';

export default function AuthButton() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState({ google: false, microsoft: false });
    const [manualEmail, setManualEmail] = useState('');
    const [temporaryKey, setTemporaryKey] = useState('');
    const [showMicrosoftAuth, setShowMicrosoftAuth] = useState(false);
    const navigate = useNavigate();
    const { login, logout: manualLogout } = useManualAuth();

    // Manejo de autenticación con Google
    const handleGoogleLogin = async () => {
        setError('');
        setLoading({ ...loading, google: true });

        try {
            await signOut(auth);
            const result = await signInWithPopup(auth, googleProvider);
            validateGoogleEmail(result.user.email);
        } catch (err) {
            handleAuthError(err, 'google');
        }
    };

    const validateGoogleEmail = (email) => {
        const emailDomain = email.split('@')[1];
        const isAllowed = ALLOWED_DOMAINS.some(domain =>
            emailDomain === domain || emailDomain.endsWith(`.${domain}`)
        );

        if (!email || !isAllowed) {
            signOut(auth).catch(console.error);
            setError(`Solo cuentas con dominios permitidos: ${ALLOWED_DOMAINS.join(', ')}`);
            setLoading({ ...loading, google: false });
            return;
        }

        navigate('/dashboard');
    };

    // Autenticación manual para Microsoft
    const handleMicrosoftLogin = () => {
        setError('');
        setLoading({ ...loading, microsoft: true });

        // Normalizar el email
        const normalizedEmail = manualEmail.trim().toLowerCase();

        // Validaciones
        if (!normalizedEmail || !normalizedEmail.includes('@')) {
            setError('Por favor ingrese un correo electrónico válido');
            setLoading({ ...loading, microsoft: false });
            return;
        }

        if (!temporaryKey) {
            setError('Por favor ingrese la clave');
            setLoading({ ...loading, microsoft: false });
            return;
        }

        // Buscar usuario autorizado
        const authorizedUser = AUTHORIZED_MICROSOFT_USERS.find(user => {
            const userEmailNormalized = user.email.trim().toLowerCase();
            return (
                userEmailNormalized === normalizedEmail &&
                user.temporaryKey === temporaryKey &&
                new Date(user.expiresAt) >= new Date()
            );
        });

        if (!authorizedUser) {
            // Mensaje descriptivo
            const userExists = AUTHORIZED_MICROSOFT_USERS.some(
                user => user.email.trim().toLowerCase() === normalizedEmail
            );
            
            setError(userExists 
                ? 'Clave  incorrecta o expirada' 
                : 'Usuario no autorizado');
            setLoading({ ...loading, microsoft: false });
            return;
        }

        // Registrar autenticación exitosa
        login(
            normalizedEmail,
            authorizedUser.fullName,
            authorizedUser.displayName || authorizedUser.fullName.split(' ')[0]
        );
        navigate('/dashboard');
    };

    // Manejo de errores de autenticación
    const handleAuthError = (err, providerType) => {
        console.error("Error de autenticación:", err);
        setError(err.message.includes('popup-closed')
            ? 'El popup fue cerrado'
            : 'Error al autenticar');
        setLoading({ ...loading, [providerType]: false });
    };

    // Cierre de sesión unificado
    const handleLogout = async () => {
        try {
            // Cerrar sesión en Firebase si está activo
            if (auth.currentUser) {
                await signOut(auth);
            }
            
            // Cerrar sesión manual si está activo
            if (localStorage.getItem('microsoftAuth') === 'true') {
                manualLogout();
            }
            
            // Redirigir y forzar recarga para limpiar estados
            navigate('/');
            window.location.reload();
        } catch (err) {
            console.error("Error al cerrar sesión:", err);
            setError('Error al cerrar sesión');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#262626] font-sans">
            <div className="bg-[#1d1d1d] p-8 rounded shadow-md w-full max-w-sm text-white">
                <div className="flex justify-center mb-6">
                    <img
                        src={logo}
                        alt="Logo Energia UPME"
                        className="h-16 object-contain"
                    />
                </div>

                <h1 className="text-center text-xl font-bold mb-6">Centro de Monitoreo Energético</h1>

                <div className="flex flex-col items-center gap-4">
                    {auth.currentUser || localStorage.getItem('microsoftAuth') === 'true' ? (
                        <button
                            onClick={handleLogout}
                            className="w-full max-w-xs bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
                            disabled={loading.google || loading.microsoft}
                        >
                            {loading.google || loading.microsoft ? 'Saliendo...' : 'Cerrar sesión'}
                        </button>
                    ) : (
                        <>
                            {/* Botón de Google */}
                            <button
                                onClick={handleGoogleLogin}
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

                            {/* Autenticación para Microsoft */}
                            {!showMicrosoftAuth ? (
                                <button
                                    onClick={() => setShowMicrosoftAuth(true)}
                                    className="w-full max-w-xs bg-[#0078D4] hover:bg-[#106EBE] text-white px-4 py-2 rounded font-medium transition-colors"
                                    disabled={loading.google || loading.microsoft}
                                >
                                    Entrar con Microsoft
                                </button>
                            ) : (
                                <div className="w-full max-w-xs space-y-3">
                                    <input
                                        type="email"
                                        value={manualEmail}
                                        onChange={(e) => setManualEmail(e.target.value)}
                                        placeholder="tu.correo@minenergia.gov.co"
                                        className="w-full px-4 py-2 rounded text-black"
                                        disabled={loading.microsoft}
                                    />
                                    <input
                                        type="password"
                                        value={temporaryKey}
                                        onChange={(e) => setTemporaryKey(e.target.value)}
                                        placeholder="Clave"
                                        className="w-full px-4 py-2 rounded text-black"
                                        disabled={loading.microsoft}
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleMicrosoftLogin}
                                            className="flex-1 bg-[#0078D4] hover:bg-[#106EBE] text-white px-4 py-2 rounded font-medium transition-colors flex items-center justify-center"
                                            disabled={loading.microsoft}
                                        >
                                            {loading.microsoft ? (
                                                <>
                                                    <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                                                        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4" opacity="0.25"/>
                                                        <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                                    </svg>
                                                    Verificando...
                                                </>
                                            ) : 'Ingresar'}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowMicrosoftAuth(false);
                                                setManualEmail('');
                                                setTemporaryKey('');
                                            }}
                                            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-medium transition-colors"
                                            disabled={loading.microsoft}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            )}
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