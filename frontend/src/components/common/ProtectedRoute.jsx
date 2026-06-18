import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/books" replace />;
  }

  return children;
};

export default ProtectedRoute;
