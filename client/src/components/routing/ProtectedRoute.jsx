import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ROLE_DASHBOARDS = {
  worker:     '/worker/dashboard',
  contractor: '/contractor/dashboard',
  builder:    '/builder/dashboard',
  domestic:   '/domestic/dashboard',
};

/**
 * Redirects unauthenticated users to /auth/login
 * Optionally restricts by role
 */
export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  if (!user) return <Navigate to="/auth/login" state={{ from: location }} replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={ROLE_DASHBOARDS[user.role] || '/'} replace />;
  }

  return children;
};

/**
 * Redirects already-authenticated users away from auth pages
 */
export const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  if (user) return <Navigate to={ROLE_DASHBOARDS[user.role] || '/'} replace />;

  return children;
};
