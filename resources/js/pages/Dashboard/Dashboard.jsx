import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const { user } = useAuth();

    const cards = [
        { to: '/plantes', icon: '📚', label: 'Bibliothèque', desc: 'Explorer les plantes' },
        { to: '/favoris', icon: '❤️', label: 'Favoris', desc: 'Mes plantes favorites' },
        { to: '/offres', icon: '🛒', label: 'Marketplace', desc: 'Offres agricoles' },
        { to: '/alertes', icon: '🔔', label: 'Alertes', desc: 'Arrosage du jour' },
        ...(['agriculteur', 'manager'].includes(user?.role)
            ? [{ to: '/suivi', icon: '🌿', label: 'Mes cultures', desc: 'Suivi des plantes' },
               { to: '/stocks', icon: '📦', label: 'Stocks', desc: 'Gestion des stocks' }]
            : []),
        ...(['manager', 'ouvrier'].includes(user?.role)
            ? [{ to: '/todo-lists', icon: '📋', label: 'Todo Lists', desc: 'Tâches à faire' }]
            : []),
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-green-700 mb-1">Bonjour, {user?.name} 👋</h1>
            <p className="text-gray-500 mb-6 capitalize">Rôle : {user?.role}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {cards.map((c) => (
                    <Link key={c.to} to={c.to}
                        className="bg-white rounded-xl shadow p-5 hover:shadow-md transition flex flex-col items-center text-center">
                        <span className="text-4xl mb-2">{c.icon}</span>
                        <p className="font-semibold">{c.label}</p>
                        <p className="text-xs text-gray-400">{c.desc}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
