import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function RequireAuth({ children }) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="admin-loading">
        <p>Chargement…</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
