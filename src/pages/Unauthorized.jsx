// src/pages/Unauthorized.jsx
// src/pages/Unauthorized.jsx
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';

export default function Unauthorized() {
    const { userRole } = useAuth();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            window.location.href = '/CentroMonitoreo'; // Redirigir al inicio con recarga
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    return (
        <div className="min-h-screen bg-[#1d1d1d] flex items-center justify-center">
            <div className="text-center text-white p-6 max-w-md">
                <h1 className="text-2xl font-bold mb-4">¡Sesión expirada!</h1>
                <p className="mb-4">
                    Para proteger tu cuenta, hemos cerrado tu sesión por inactividad. ¡Es solo una medida de seguridad!
                </p>
                <p className="mb-4">
                    Tu rol ({userRole || 'no definido'}) no tiene permisos para acceder a esta página.
                </p>
                <button
                    onClick={handleLogout}
                    className="text-[#FFC800] hover:underline font-medium"
                >
                    Iniciar sesión
                </button>
            </div>
        </div>
    );
}