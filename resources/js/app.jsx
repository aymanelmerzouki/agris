import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, useLocation as useRouterLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Landing from './pages/Landing/Landing';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Plantes from './pages/Bibliotheque/Plantes';
import PlanteDetail from './pages/Bibliotheque/PlanteDetail';
import Favoris from './pages/Bibliotheque/Favoris';
import SuiviPlantes from './pages/Suivi/SuiviPlantes';
import Offres from './pages/Offres/Offres';
import TodoLists from './pages/TodoList/TodoLists';
import Alertes from './pages/Alertes/Alertes';
import Equipe from './pages/Equipe/Equipe';
import PortailOuvrier from './pages/Equipe/PortailOuvrier';
import WaitingApproval from './pages/Equipe/WaitingApproval';
import Admin from './pages/Admin/Admin';
import Abonnement from './pages/Abonnement/Abonnement';

import '../css/app.css';

function Layout({ children }) {
    const location = useRouterLocation();
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 transition-colors duration-200">
            <Navbar />
            <main key={location.pathname} className="animate-fadeIn flex-1">
                {children}
            </main>
            <Footer />
        </div>
    );
}

function Home() {
    const { user, loading, refreshUser } = useAuth();
    if (loading) return null;
    if (user?.role === 'ouvrier') {
        if (!user.statut_emploi || user.statut_emploi === 'aucun') {
            return <PortailOuvrier statut={user.statut_emploi} onDemandeSoumise={refreshUser} />;
        }
        if (user.statut_emploi === 'en_attente') {
            return <WaitingApproval onApproved={refreshUser} />;
        }
        if (user.statut_emploi === 'actif') {
            return <Navigate to="/dashboard" replace />;
        }
    }
    if (user?.role === 'admin') {
        return <Navigate to="/admin" replace />;
    }
    return user ? <Navigate to="/dashboard" replace /> : <Landing />;
}

createRoot(document.getElementById('app')).render(
    <StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/abonnement" element={<PrivateRoute roles={['manager']}><Abonnement /></PrivateRoute>} />

                    <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
                    <Route path="/plantes" element={<PrivateRoute><Layout><Plantes /></Layout></PrivateRoute>} />
                    <Route path="/plantes/:id" element={<PrivateRoute><Layout><PlanteDetail /></Layout></PrivateRoute>} />
                    <Route path="/favoris" element={<PrivateRoute><Layout><Favoris /></Layout></PrivateRoute>} />
                    <Route path="/suivi" element={<PrivateRoute roles={['agriculteur', 'manager']}><Layout><SuiviPlantes /></Layout></PrivateRoute>} />
                    <Route path="/offres" element={<PrivateRoute roles={['agriculteur', 'manager']}><Layout><Offres /></Layout></PrivateRoute>} />
                    <Route path="/todo-lists" element={<PrivateRoute roles={['manager', 'ouvrier']}><Layout><TodoLists /></Layout></PrivateRoute>} />
                    <Route path="/alertes" element={<PrivateRoute><Layout><Alertes /></Layout></PrivateRoute>} />
                    <Route path="/equipe" element={<PrivateRoute roles={['manager']}><Layout><Equipe /></Layout></PrivateRoute>} />
                    <Route path="/admin" element={<PrivateRoute roles={['admin']}><Layout><Admin /></Layout></PrivateRoute>} />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    </StrictMode>
);
