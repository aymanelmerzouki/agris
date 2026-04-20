import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api';

const cards = (role) => [
    { to: '/plantes', icon: '📚', label: 'Bibliothèque', desc: 'Explorer les plantes' },
    { to: '/favoris', icon: '❤️', label: 'Favoris', desc: 'Mes plantes favorites' },
    { to: '/offres', icon: '🛒', label: 'Marketplace', desc: 'Offres agricoles' },
    { to: '/alertes', icon: '🔔', label: 'Alertes', desc: 'Arrosage du jour' },
    ...(['agriculteur', 'manager'].includes(role)
        ? [{ to: '/suivi', icon: '🌿', label: 'Mes cultures', desc: 'Suivi des plantes' },
           { to: '/stocks', icon: '📦', label: 'Stocks', desc: 'Gestion des stocks' }]
        : []),
    ...(['manager', 'ouvrier'].includes(role)
        ? [{ to: '/todo-lists', icon: '📋', label: 'Todo Lists', desc: 'Tâches à faire' }]
        : []),
];

function formatDate(d) {
    return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export default function Dashboard() {
    const { user } = useAuth();
    const [news, setNews] = useState([]);

    useEffect(() => {
        api.get('/news').then((r) => setNews(r.data?.slice(0, 4) ?? []));
    }, []);

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Bonjour, {user?.name} 👋</h1>
                <p className="text-gray-500 text-sm capitalize mt-1">Rôle : {user?.role} {user?.nomEntreprise && `· ${user.nomEntreprise}`}</p>
            </div>

            {/* Raccourcis */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
                {cards(user?.role).map((c) => (
                    <Link key={c.to} to={c.to}
                        className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 hover:shadow-md transition flex flex-col items-center text-center group">
                        <span className="text-3xl mb-2 group-hover:scale-110 transition">{c.icon}</span>
                        <p className="font-semibold text-sm">{c.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{c.desc}</p>
                    </Link>
                ))}
            </div>

            {/* Actualités */}
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">📰 Actualités agricoles</h2>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">En direct</span>
            </div>

            {news.length === 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-gray-100 rounded-2xl h-48 animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {news.map((a, i) => (
                        <a key={i} href={a.url} target="_blank" rel="noreferrer"
                            className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group">
                            <div className="h-32 overflow-hidden">
                                <img
                                    src={a.image || 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400'}
                                    alt={a.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400'; }}
                                />
                            </div>
                            <div className="p-3">
                                <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug">{a.title}</p>
                                <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                                    <span>{a.source}</span>
                                    <span>{formatDate(a.date)}</span>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}
