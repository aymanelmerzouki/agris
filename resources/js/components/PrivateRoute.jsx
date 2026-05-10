import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function PrivateRoute({ children, roles }) {
    const { user, loading } = useAuth();

    if (!user && loading) return (
        <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-zinc-950">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!user) return <Navigate to="/login" replace />;
    if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;

    // Ouvrier non actif → redirige vers la racine (Home gère l'affichage)
    if (user.role === 'ouvrier' && user.statut_emploi !== 'actif') {
        return <Navigate to="/" replace />;
    }

    return children;
}
