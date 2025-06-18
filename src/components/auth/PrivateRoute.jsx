// src/components/auth/PrivateRoute.jsx
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { ALLOWED_DOMAINS } from '../../config/allowedDomains';

export default function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth();

  // Verificación de dominios permitidos
  const isAuthorized = currentUser && 
    ALLOWED_DOMAINS.some(domain => 
      currentUser.email?.endsWith(`@${domain}`) || 
      currentUser.email?.endsWith(`.${domain}`)
    );

  if (loading) {
    return <div className="text-white">Cargando...</div>;
  }

  return isAuthorized ? children : <Navigate to="/" replace />;
}