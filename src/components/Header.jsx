// src/components/Header.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useManualAuth } from '../context/ManualAuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import energiaLogo from '../assets/logosEnergiaUpme.svg';
import { HelpCircle, User, LogOut } from 'lucide-react';

export function Header() {
    const { currentUser } = useAuth();
    const { manualAuth, logout: manualLogout } = useManualAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Usuario activo (Google o Manual)
    const activeUser = currentUser || {
        email: manualAuth.email,
        displayName: manualAuth.displayName
    };

    const handleLogout = async () => {
        try {
            // Cerrar sesión en Firebase si está activo
            if (currentUser) {
                await signOut(auth);
            }
            
            // Cerrar sesión manual si está activo
            if (manualAuth.isAuthenticated) {
                manualLogout();
            }
            
            setIsDropdownOpen(false);
            window.location.href = '/CentroMonitoreo'; // Redirigir al home con recarga
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 h-24 bg-[#262626] border-b border-[#575756] flex items-center justify-between px-6 z-50">
            {/* Logos + título */}
            <div className="flex items-center w-1/2">
                <img src={energiaLogo} alt="Ministerio de Energía" className="h-16 w-auto" />
                <div className="h-12 border-l border-[#575756] ml-[100px] mr-7" />
                <h1 className="text-white" style={{
                    fontFamily: '"Nunito Sans", sans-serif',
                    fontSize: '28px',
                    fontWeight: 700,
                    lineHeight: '36px',
                }}>
                    Centro de Monitoreo
                </h1>
            </div>

            {/* Iconos de la derecha */}
            <div className="flex items-center space-x-6">
                <HelpCircle size={28} className="text-white cursor-pointer hover:text-gray-300" title="Ayuda" />
                
                {/* Menú de usuario */}
                <div className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center space-x-2 focus:outline-none"
                    >
                        <User size={28} className="text-white cursor-pointer hover:text-gray-300" title="Usuario" />
                        {activeUser && (
                            <span className="text-white text-sm hidden md:inline-block">
                                {activeUser.displayName || activeUser.email?.split('@')[0]}
                            </span>
                        )}
                    </button>

                    {isDropdownOpen && activeUser && (
                        <div className="absolute right-0 mt-2 w-48 bg-[#1d1d1d] rounded-md shadow-lg border border-[#575756] z-50">
                            <div className="px-4 py-3 border-b border-[#575756]">
                                <p className="text-sm text-white font-medium">
                                    {activeUser.displayName || 'Usuario'}
                                </p>
                                <p className="text-xs text-gray-300 truncate">
                                    {activeUser.email}
                                </p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full px-4 py-2 text-sm text-white hover:bg-[#FFC800] hover:text-black flex items-center space-x-2"
                            >
                                <LogOut size={16} />
                                <span>Cerrar sesión</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}