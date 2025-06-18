import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase/config';

export default function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth();

  // Verificación adicional del email
  const isAuthorized = currentUser && currentUser.email?.endsWith('@upme.gov.co');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#262626]">
        <div className="text-white flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FFC800] mb-2"></div>
          <p>Verificando credenciales...</p>
        </div>
      </div>
    );
  }

  return isAuthorized ? children : <Navigate to="/" replace />;
}