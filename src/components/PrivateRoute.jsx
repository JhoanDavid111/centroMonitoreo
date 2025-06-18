import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div className="text-white">Cargando...</div>;
  }

  return currentUser ? children : <Navigate to="/" replace />;
}