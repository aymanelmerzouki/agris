import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function PrivateRoute({ children, roles }) {
    const { user, loading } = useAuth();

    if (loading) return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="flex flex-col items-center gap-3">
                <span className="text-4xl animate-bounce">🌱</span>
                <p className="text-gray-400 text-sm">Chargement...</p>
            </div>
        </div>
    );

    if (!user) return <Navigate to="/login" replace />;
    if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;

    return children;
}
