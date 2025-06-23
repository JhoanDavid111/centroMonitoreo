import { useAuth } from '../../context/AuthContext';
import { useManualAuth } from '../../context/ManualAuthContext';
import { Navigate } from 'react-router-dom';
import { ALLOWED_DOMAINS } from '../../config/allowedDomains';
import { AUTHORIZED_MICROSOFT_USERS } from '../../config/authorizedMicrosoftUsers';

export default function PrivateRoute({ children }) {
    const { currentUser, loading: authLoading } = useAuth();
    const { manualAuth, loading: manualAuthLoading } = useManualAuth();

    const loading = authLoading || manualAuthLoading;

    // Verificación para Google
    const isGoogleAuthorized = currentUser && 
        ALLOWED_DOMAINS.some(domain =>
            currentUser.email?.endsWith(`@${domain}`) ||
            currentUser.email?.endsWith(`.${domain}`)
        );

    // Verificación para Microsoft
    const isMicrosoftAuthorized = manualAuth.isAuthenticated && 
        AUTHORIZED_MICROSOFT_USERS.some(user => 
            user.email.toLowerCase() === manualAuth.email?.toLowerCase() &&
            new Date(user.expiresAt) >= new Date()
        );

    if (loading) {
        return <div className="text-white">Cargando...</div>;
    }

    return (isGoogleAuthorized || isMicrosoftAuthorized) ? children : <Navigate to="/" replace />;
}