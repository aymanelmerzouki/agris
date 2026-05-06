import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, useLocation as useRouterLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

import Landing from './pages/Landing/Landing';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Plantes from './pages/Bibliotheque/Plantes';
import PlanteDetail from './pages/Bibliotheque/PlanteDetail';
import Favoris from './pages/Bibliotheque/Favoris';
import SuiviPlantes from './pages/Suivi/SuiviPlantes';
import Stocks from './pages/Stocks/Stocks';
import Offres from './pages/Offres/Offres';
import TodoLists from './pages/TodoList/TodoLists';
import Alertes from './pages/Alertes/Alertes';

import '../css/app.css';

function Layout({ children }) {
    const location = useRouterLocation();
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-emerald-950 text-gray-900 dark:text-emerald-100 transition-colors duration-200">
            <Navbar />
            <main key={location.pathname} className="animate-fadeIn">
                {children}
            </main>
        </div>
    );
}

function Home() {
    const { user, loading } = useAuth();
    if (loading) return null;
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

                    <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
                    <Route path="/plantes" element={<PrivateRoute><Layout><Plantes /></Layout></PrivateRoute>} />
                    <Route path="/plantes/:id" element={<PrivateRoute><Layout><PlanteDetail /></Layout></PrivateRoute>} />
                    <Route path="/favoris" element={<PrivateRoute><Layout><Favoris /></Layout></PrivateRoute>} />
                    <Route path="/suivi" element={<PrivateRoute roles={['agriculteur', 'manager']}><Layout><SuiviPlantes /></Layout></PrivateRoute>} />
                    <Route path="/stocks" element={<PrivateRoute roles={['agriculteur', 'manager']}><Layout><Stocks /></Layout></PrivateRoute>} />
                    <Route path="/offres" element={<PrivateRoute roles={['agriculteur', 'manager']}><Layout><Offres /></Layout></PrivateRoute>} />
                    <Route path="/todo-lists" element={<PrivateRoute roles={['manager', 'ouvrier']}><Layout><TodoLists /></Layout></PrivateRoute>} />
                    <Route path="/alertes" element={<PrivateRoute><Layout><Alertes /></Layout></PrivateRoute>} />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    </StrictMode>
);
