import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DarkModeToggle from './DarkModeToggle';
import {
    LayoutDashboard, BookOpen, Bookmark, ShoppingCart,
    Sprout, Package, ClipboardList, Bell, Leaf, Users
} from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const navItems = [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Accueil' },
        { to: '/plantes',   icon: BookOpen,         label: 'Bibliothèque' },
        ...(!['ouvrier'].includes(user?.role) ? [
            { to: '/favoris', icon: Bookmark,      label: 'Favoris' },
            { to: '/offres',  icon: ShoppingCart,  label: 'Marketplace' },
        ] : []),
        ...(['agriculteur', 'manager'].includes(user?.role) ? [
            { to: '/suivi',  icon: Sprout,  label: 'Cultures' },
            { to: '/stocks', icon: Package, label: 'Stocks' },
        ] : []),
        ...(['manager', 'ouvrier'].includes(user?.role) ? [
            { to: '/todo-lists', icon: ClipboardList, label: 'Tâches' },
        ] : []),
        ...(['manager'].includes(user?.role) ? [
            { to: '/equipe', icon: Users, label: 'Équipe' },
        ] : []),
        { to: '/alertes', icon: Bell, label: 'Alertes' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Desktop */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800 shadow-sm hidden md:flex items-center justify-between px-6 py-3">
                <Link to="/dashboard" className="flex items-center gap-2">
                    <Leaf size={22} className="text-green-600" />
                    <span className="text-lg font-extrabold text-green-700 tracking-tight">Agris</span>
                </Link>

                <nav className="flex items-center gap-1">
                    {navItems.map(({ to, icon: Icon, label }) => (
                        <Link key={to} to={to}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                                ${isActive(to)
                                    ? 'bg-green-600 text-white dark:bg-emerald-500/10 dark:text-emerald-400 dark:border dark:border-emerald-500/20'
                                    : 'text-gray-500 dark:text-zinc-400 hover:text-green-600 dark:hover:text-zinc-100 hover:bg-green-50 dark:hover:bg-zinc-800}'}`}>
                            <Icon size={16} />
                            <span>{label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    <DarkModeToggle />
                    <div className="text-right hidden lg:block">
                        <p className="text-sm font-semibold text-gray-800 dark:text-white">{user?.name}</p>
                        <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">
                        {user?.name?.[0]?.toUpperCase()}
                    </div>
                    <button onClick={handleLogout}
                        className="text-xs text-gray-400 hover:text-red-500 transition-colors duration-200 px-2 py-1 rounded-lg hover:bg-red-50">
                        Quitter
                    </button>
                </div>
            </header>

            {/* Mobile bottom nav */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-t border-gray-100 dark:border-zinc-800 flex md:hidden">
                {navItems.slice(0, 5).map(({ to, icon: Icon, label }) => (
                    <Link key={to} to={to}
                        className={`flex-1 flex flex-col items-center justify-center py-2.5 transition-colors duration-200
                            ${isActive(to) ? 'text-green-600' : 'text-gray-400 hover:text-green-500'}`}>
                        <Icon size={20} />
                        <span className="text-[10px] mt-0.5 font-medium">{label}</span>
                    </Link>
                ))}
            </nav>
        </>
    );
}
