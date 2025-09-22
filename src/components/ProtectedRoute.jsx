import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuthStore();
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export const PublicRoute = ({ children }) => {
  const { isLoggedIn } = useAuthStore();
  
  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
};