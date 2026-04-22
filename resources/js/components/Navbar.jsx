import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DarkModeToggle from './DarkModeToggle';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const navItems = [
        { to: '/dashboard', icon: '🏠', label: 'Accueil' },
        { to: '/plantes', icon: '📚', label: 'Bibliothèque' },
        ...(!['ouvrier'].includes(user?.role) ? [
            { to: '/favoris', icon: '❤️', label: 'Favoris' },
            { to: '/offres', icon: '🛒', label: 'Marketplace' },
        ] : []),
        ...(['agriculteur', 'manager'].includes(user?.role)
            ? [{ to: '/suivi', icon: '🌿', label: 'Cultures' },
               { to: '/stocks', icon: '📦', label: 'Stocks' }]
            : []),
        ...(['manager', 'ouvrier'].includes(user?.role)
            ? [{ to: '/todo-lists', icon: '📋', label: 'Tâches' }]
            : []),
        ...(!['ouvrier'].includes(user?.role) ? [
            { to: '/alertes', icon: '🔔', label: 'Alertes' },
        ] : []),
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <>
            
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-700 shadow-sm hidden md:flex items-center justify-between px-6 py-3">
                <Link to="/dashboard" className="flex items-center gap-2">
                    <span className="text-2xl">🌱</span>
                    <span className="text-lg font-extrabold text-green-700 tracking-tight">Agris</span>
                </Link>

                <nav className="flex items-center gap-1">
                    {navItems.map((item) => (
                        <Link key={item.to} to={item.to}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all
                                ${isActive(item.to)
                                    ? 'bg-green-600 text-white shadow-md shadow-green-200'
                                    : 'text-gray-600 hover:bg-green-50 hover:text-green-700'}`}>
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    <DarkModeToggle />
                    <div className="text-right hidden lg:block">
                        <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                        <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">
                        {user?.name?.[0]?.toUpperCase()}
                    </div>
                    <button onClick={handleLogout}
                        className="text-xs text-gray-400 hover:text-red-500 transition px-2 py-1 rounded-lg hover:bg-red-50">
                        Quitter
                    </button>
                </div>
            </header>

            
            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-gray-100 flex md:hidden">
                {navItems.slice(0, 5).map((item) => (
                    <Link key={item.to} to={item.to}
                        className={`flex-1 flex flex-col items-center justify-center py-2.5 transition-all
                            ${isActive(item.to) ? 'text-green-600' : 'text-gray-400 hover:text-green-500'}`}>
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
                    </Link>
                ))}
            </nav>
        </>
    );
}
