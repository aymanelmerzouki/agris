import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api';

function formatDate(d) {
    return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

const CATEGORIES = ['Toutes', 'Marché', 'Technique', 'Météo', 'Innovation'];

function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
            <div className="h-44 bg-gray-200" />
            <div className="p-4 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-4/5" />
                <div className="h-3 bg-gray-100 rounded w-1/2 mt-3" />
            </div>
        </div>
    );
}

export default function Dashboard() {
    const { user } = useAuth();
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('Toutes');

    useEffect(() => {
        api.get('/news')
            .then((r) => setNews(r.data ?? []))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
            {/* Hero greeting */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-8 md:py-10">
                <div className="max-w-5xl mx-auto">
                    <p className="text-green-100 text-sm mb-1">Bienvenue sur Agris</p>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                        Bonjour, {user?.name} 👋
                    </h1>
                    <p className="text-green-200 text-sm mt-1 capitalize">
                        {user?.role}{user?.nomEntreprise ? ` · ${user.nomEntreprise}` : ''}
                    </p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 md:px-6 -mt-4">
                {/* Section titre */}
                <div className="flex items-center justify-between mb-5 mt-8">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">📰 Actualités agricoles</h2>
                        <p className="text-gray-400 text-xs mt-0.5">Dernières nouvelles du secteur</p>
                    </div>
                    <span className="flex items-center gap-1.5 text-xs bg-green-50 text-green-600 border border-green-100 px-3 py-1.5 rounded-full font-medium">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        En direct
                    </span>
                </div>

                {/* Filtres catégories */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
                    {CATEGORIES.map((cat) => (
                        <button key={cat} onClick={() => setActiveCategory(cat)}
                            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all
                                ${activeCategory === cat
                                    ? 'bg-green-600 text-white shadow-md shadow-green-200'
                                    : 'bg-white text-gray-500 border border-gray-200 hover:border-green-300 hover:text-green-600'}`}>
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Article à la une */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="md:col-span-2"><SkeletonCard /></div>
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                ) : (
                    <>
                        {news[0] && (
                            <a href={news[0].url} target="_blank" rel="noreferrer"
                                className="group block mb-5 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 relative">
                                <div className="relative h-64 md:h-80">
                                    <img
                                        src={news[0].image || 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=900'}
                                        alt={news[0].title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=900'; }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                                            🔥 À la une
                                        </span>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                                        <h3 className="text-lg md:text-2xl font-bold leading-tight mb-2 drop-shadow">
                                            {news[0].title}
                                        </h3>
                                        <p className="text-gray-300 text-sm line-clamp-2 hidden md:block">
                                            {news[0].description}
                                        </p>
                                        <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                                            <span className="bg-white/10 backdrop-blur px-2 py-1 rounded-full">📡 {news[0].source}</span>
                                            <span>{formatDate(news[0].date)}</span>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        )}

                        {/* Grille articles */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {news.slice(1).map((article, i) => (
                                <a key={i} href={article.url} target="_blank" rel="noreferrer"
                                    className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                                    <div className="h-40 overflow-hidden relative">
                                        <img
                                            src={article.image || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400'}
                                            alt={article.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400'; }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-green-700 transition-colors">
                                            {article.title}
                                        </h3>
                                        <p className="text-xs text-gray-400 line-clamp-2 mb-3">{article.description}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs bg-gray-50 text-gray-500 px-2 py-1 rounded-full border border-gray-100">
                                                📡 {article.source}
                                            </span>
                                            <span className="text-xs text-gray-400">{formatDate(article.date)}</span>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
