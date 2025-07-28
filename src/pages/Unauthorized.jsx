// src/pages/Unauthorized.jsx
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Unauthorized() {
  const { userRole } = useAuth();
  
  return (
    <div className="min-h-screen bg-[#1d1d1d] flex items-center justify-center">
      <div className="text-center text-white p-6 max-w-md">
        <h1 className="text-2xl font-bold mb-4">Acceso no autorizado</h1>
        <p className="mb-4">
          Tu rol ({userRole || 'no definido'}) no tiene permisos para acceder a esta página.
        </p>
        <Link 
          to="/" 
          className="text-[#FFC800] hover:underline font-medium"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}