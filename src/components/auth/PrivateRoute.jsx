// src/components/auth/PrivateRoute.jsx
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { ALLOWED_DOMAINS } from '../../config/allowedDomains';

export default function PrivateRoute({
  children,
  allowedRoles, // Nuevo prop opcional para validación de roles
  redirectTo = "/" // Prop para personalizar la redirección
 }) {
  const { currentUser,userRole, loading } = useAuth();

  // Verificación de dominios permitidos
  const isDomainAuthorized = currentUser && 
    ALLOWED_DOMAINS.some(domain =>
      currentUser.email?.endsWith(`@${domain}`) || 
      currentUser.email?.endsWith(`.${domain}`)
    );
  
  // Verificación de roles (solo si se especifican roles permitidos)
  const isRoleAuthorized = !allowedRoles || 
                           (userRole && allowedRoles.includes(userRole));

  const isAuthorized = isDomainAuthorized && isRoleAuthorized;  
    

  if (loading) {
    return <div className="text-white">Cargando...</div>;
  }

  if (!isAuthorized) {
        // Redirigir a la ruta especificada (por defecto "/")
        return <Navigate to={redirectTo} replace />;
    }

    return children;
}