import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api';
import {
    Chart as ChartJS,
    ArcElement, Tooltip, Legend,
    CategoryScale, LinearScale, PointElement, LineElement,
    Filler,
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler);

const SOL_COLORS = {
    argileux: '#c2410c',
    sableux:  '#ca8a04',
    limoneux: '#92400e',
    calcaire: '#6b7280',
    humifere: '#44403c',
};

function StatCard({ icon, label, value, sub, color }) {
    return (
        <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-2xl font-extrabold text-gray-900">{value}</p>
                <p className="text-sm font-medium text-gray-700">{label}</p>
                {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
            </div>
        </div>
    );
}

function formatDate(d) {
    return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export default function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats]   = useState(null);
    const [news, setNews]     = useState([]);

    useEffect(() => {
        api.get('/dashboard-stats').then((r) => setStats(r.data));
        api.get('/news').then((r) => setNews(r.data?.slice(0, 4) ?? []));
    }, []);

    // Données graphique camembert sols
    const solLabels  = stats ? Object.keys(stats.repartition_sols) : [];
    const solValues  = stats ? Object.values(stats.repartition_sols) : [];
    const doughnutData = {
        labels: solLabels.map((s) => s.charAt(0).toUpperCase() + s.slice(1)),
        datasets: [{
            data: solValues,
            backgroundColor: solLabels.map((s) => SOL_COLORS[s] ?? '#10b981'),
            borderWidth: 2,
            borderColor: '#fff',
        }],
    };

    // Données graphique courbe évolution
    const evoLabels = stats?.evolution_cultures?.map((e) => e.mois) ?? [];
    const evoValues = stats?.evolution_cultures?.map((e) => e.total) ?? [];
    const lineData = {
        labels: evoLabels,
        datasets: [{
            label: 'Nouvelles cultures',
            data: evoValues,
            borderColor: '#16a34a',
            backgroundColor: 'rgba(22,163,74,0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#16a34a',
            pointRadius: 5,
        }],
    };

    const lineOptions = {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
            y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: '#f3f4f6' } },
            x: { grid: { display: false } },
        },
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
            {/* Hero */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-8">
                <div className="max-w-6xl mx-auto">
                    <p className="text-green-100 text-sm">Bienvenue sur Agris</p>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
                        Bonjour, {user?.name} 👋
                    </h1>
                    <p className="text-green-200 text-sm mt-1 capitalize">
                        {user?.role}{user?.nomEntreprise ? ` · ${user.nomEntreprise}` : ''}
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 md:px-6 mt-6 space-y-6">
                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard icon="🌿" label="Cultures actives" value={stats?.stats.cultures_actives ?? '—'} sub="en cours de suivi" color="bg-green-50" />
                    <StatCard icon="🛒" label="Offres disponibles" value={stats?.stats.offres_disponibles ?? '—'} sub="sur le marketplace" color="bg-blue-50" />
                    <StatCard icon="📚" label="Plantes référencées" value={stats?.stats.total_plantes ?? '—'} sub="dans la bibliothèque" color="bg-amber-50" />
                </div>

                {/* Graphiques */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Courbe évolution */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                        <h3 className="font-bold text-gray-800 mb-1">📈 Évolution des cultures</h3>
                        <p className="text-xs text-gray-400 mb-4">Nouvelles cultures enregistrées par mois</p>
                        {stats ? (
                            <Line data={lineData} options={lineOptions} />
                        ) : (
                            <div className="h-48 bg-gray-100 rounded-xl animate-pulse" />
                        )}
                    </div>

                    {/* Camembert sols */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                        <h3 className="font-bold text-gray-800 mb-1">🪨 Répartition des sols</h3>
                        <p className="text-xs text-gray-400 mb-4">Types de sols utilisés dans vos cultures</p>
                        {stats ? (
                            solValues.length > 0 ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-56 h-56">
                                        <Doughnut data={doughnutData} options={{ plugins: { legend: { position: 'bottom' } } }} />
                                    </div>
                                </div>
                            ) : (
                                <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
                                    Aucune culture enregistrée
                                </div>
                            )
                        ) : (
                            <div className="h-48 bg-gray-100 rounded-xl animate-pulse" />
                        )}
                    </div>
                </div>

                {/* Actualités */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-900">📰 Actualités agricoles</h2>
                        <span className="flex items-center gap-1.5 text-xs bg-green-50 text-green-600 border border-green-100 px-3 py-1.5 rounded-full font-medium">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            En direct
                        </span>
                    </div>
                    {news.length === 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[...Array(4)].map((_, i) => <div key={i} className="bg-gray-100 rounded-2xl h-48 animate-pulse" />)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {news.map((a, i) => (
                                <a key={i} href={a.url} target="_blank" rel="noreferrer"
                                    className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group">
                                    <div className="h-32 overflow-hidden">
                                        <img src={a.image || 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400'}
                                            alt={a.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400'; }} />
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
            </div>
        </div>
    );
}
