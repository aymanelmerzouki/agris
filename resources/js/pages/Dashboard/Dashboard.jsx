import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api';
import { Sprout, ShoppingCart, BookOpen, TrendingUp, CheckCircle, Clock, ListTodo } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
    Chart as ChartJS,
    ArcElement, Tooltip, Legend,
    CategoryScale, LinearScale, PointElement, LineElement,
    Filler,
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler);

const SOL_COLORS = {
    argileux: '#c2410c', sableux: '#ca8a04', limoneux: '#92400e',
    calcaire: '#6b7280', humifere: '#44403c',
};

function StatCard({ icon: Icon, label, value, sub, gradient, glow }) {
    return (
        <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-green-900 dark:to-green-950 rounded-2xl border border-gray-100/50 dark:border-green-900/50 shadow-xl shadow-gray-900/5 p-5 flex items-center gap-4 overflow-hidden">
            <div className={`absolute -top-6 -left-6 w-24 h-24 rounded-full opacity-10 blur-2xl ${glow}`} />
            <div className={`relative z-10 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${gradient}`}>
                <Icon size={22} className="text-white" strokeWidth={2} />
            </div>
            <div className="relative z-10">
                <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{value}</p>
                <p className="text-sm font-semibold text-gray-700 dark:text-green-300">{label}</p>
                {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
            </div>
        </div>
    );
}

function formatDate(d) {
    return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function Skeleton() {
    return (
        <div className="min-h-screen pb-20 md:pb-8">
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 dark:from-zinc-800 dark:to-zinc-800 dark:border-b dark:border-zinc-800 px-6 py-8">
                <div className="max-w-6xl mx-auto space-y-2">
                    <div className="h-3 w-28 bg-green-400/40 rounded animate-pulse" />
                    <div className="h-7 w-44 bg-green-400/40 rounded animate-pulse" />
                </div>
            </div>
            <div className="max-w-6xl mx-auto px-4 md:px-6 mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => <div key={i} className="bg-gray-100 dark:bg-green-900 rounded-2xl h-24 animate-pulse" />)}
                </div>
            </div>
        </div>
    );
}

export default function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [news, setNews]   = useState([]);

    useEffect(() => {
        api.get('/dashboard-stats').then((r) => setStats(r.data));
        api.get('/news').then((r) => setNews(r.data?.slice(0, 4) ?? []));
    }, []);

    if (!stats) return <Skeleton />;

    if (stats.role === 'ouvrier') {
        return (
            <div className="min-h-screen pb-20 md:pb-8">
                <div className="bg-gradient-to-r from-green-600 to-emerald-500 dark:from-zinc-800 dark:to-zinc-800 dark:border-b dark:border-zinc-800 px-6 py-8">
                    <div className="max-w-2xl mx-auto">
                        <p className="text-green-100 text-sm">Bienvenue sur Agris</p>
                        <h1 className="text-2xl font-extrabold text-white mt-1">Bonjour, {user?.name}</h1>
                        <p className="text-green-200 text-sm mt-1">Ouvrier</p>
                    </div>
                </div>
                <div className="max-w-2xl mx-auto px-4 md:px-6 mt-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <StatCard icon={Clock} label="Tâches à faire" value={stats.taches_a_faire}
                            sub="en attente ou en cours"
                            gradient="bg-gradient-to-br from-orange-400 to-orange-600"
                            glow="bg-orange-400" />
                        <StatCard icon={CheckCircle} label="Tâches terminées" value={stats.taches_terminees}
                            sub="complétées"
                            gradient="bg-gradient-to-br from-emerald-400 to-green-600"
                            glow="bg-green-400" />
                    </div>
                    <Link to="/todo-lists"
                        className="flex items-center gap-4 bg-gradient-to-br from-white to-gray-50 dark:from-green-900 dark:to-green-950 rounded-2xl border border-gray-100/50 dark:border-green-900/50 shadow-xl shadow-gray-900/5 p-5 hover:shadow-2xl transition-all group">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                            <ListTodo size={22} className="text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 dark:text-white">Voir mon planning du jour</p>
                            <p className="text-sm text-gray-400">Consultez vos tâches assignées et mettez à jour leur statut</p>
                        </div>
                        <span className="ml-auto text-gray-300 group-hover:text-green-500 transition text-xl">→</span>
                    </Link>
                </div>
            </div>
        );
    }

    const solLabels = Object.keys(stats.repartition_sols ?? {});
    const solValues = Object.values(stats.repartition_sols ?? {});

    const doughnutData = {
        labels: solLabels.map((s) => s.charAt(0).toUpperCase() + s.slice(1)),
        datasets: [{ data: solValues, backgroundColor: solLabels.map((s) => SOL_COLORS[s] ?? '#10b981'), borderWidth: 3, borderColor: 'transparent', hoverOffset: 6 }],
    };

    const getGradient = (ctx, chartArea) => {
        if (!chartArea) return '#16a34a';
        const g = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        g.addColorStop(0, 'rgba(22,163,74,0.35)');
        g.addColorStop(1, 'rgba(22,163,74,0)');
        return g;
    };

    const lineData = {
        labels: stats.evolution_cultures?.map((e) => e.mois) ?? [],
        datasets: [{
            label: 'Nouvelles cultures',
            data: stats.evolution_cultures?.map((e) => e.total) ?? [],
            borderColor: '#16a34a',
            backgroundColor: (ctx) => getGradient(ctx.chart.ctx, ctx.chart.chartArea),
            fill: true, tension: 0.45,
            pointBackgroundColor: '#16a34a', pointBorderColor: '#fff', pointBorderWidth: 2, pointRadius: 5, pointHoverRadius: 7,
        }],
    };

    const lineOptions = {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
            y: { beginAtZero: true, ticks: { stepSize: 1, color: '#9ca3af' }, grid: { color: 'rgba(156,163,175,0.1)' }, border: { display: false } },
            x: { grid: { display: false }, ticks: { color: '#9ca3af' }, border: { display: false } },
        },
    };

    return (
        <div className="min-h-screen pb-20 md:pb-8">
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 dark:from-zinc-800 dark:to-zinc-800 dark:border-b dark:border-zinc-800 px-6 py-8">
                <div className="max-w-6xl mx-auto">
                    <p className="text-green-100 text-sm">Bienvenue sur Agris</p>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">Bonjour, {user?.name}</h1>
                    <p className="text-green-200 text-sm mt-1 capitalize">{user?.role}{user?.nomEntreprise ? ` · ${user.nomEntreprise}` : ''}</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 md:px-6 mt-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard icon={Sprout} label="Cultures actives" value={stats.stats.cultures_actives} sub="en cours de suivi" gradient="bg-gradient-to-br from-emerald-400 to-green-600" glow="bg-green-400" />
                    <StatCard icon={ShoppingCart} label="Offres disponibles" value={stats.stats.offres_disponibles} sub="sur le marketplace" gradient="bg-gradient-to-br from-blue-400 to-blue-600" glow="bg-blue-400" />
                    <StatCard icon={BookOpen} label="Plantes référencées" value={stats.stats.total_plantes} sub="dans la bibliothèque" gradient="bg-gradient-to-br from-amber-400 to-orange-500" glow="bg-amber-400" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-green-900 dark:to-green-950 rounded-2xl border border-gray-100/50 dark:border-green-900/50 shadow-xl shadow-gray-900/5 p-5">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center">
                                <TrendingUp size={16} className="text-white" />
                            </div>
                            <h3 className="font-bold text-gray-800 dark:text-white">Évolution des cultures</h3>
                        </div>
                        <p className="text-xs text-gray-400 mb-4 ml-10">Nouvelles cultures par mois</p>
                        <Line data={lineData} options={lineOptions} />
                    </div>

                    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-green-900 dark:to-green-950 rounded-2xl border border-gray-100/50 dark:border-green-900/50 shadow-xl shadow-gray-900/5 p-5">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
                            </div>
                            <h3 className="font-bold text-gray-800 dark:text-white">Répartition des sols</h3>
                        </div>
                        <p className="text-xs text-gray-400 mb-4 ml-10">Types de sols dans vos cultures</p>
                        {solValues.length > 0 ? (
                            <div className="flex items-center justify-center">
                                <div className="w-52 h-52">
                                    <Doughnut data={doughnutData} options={{ cutout: '70%', plugins: { legend: { position: 'bottom', labels: { padding: 16, font: { size: 12 } } } } }} />
                                </div>
                            </div>
                        ) : (
                            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">Aucune culture enregistrée</div>
                        )}
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Actualités agricoles</h2>
                        <span className="flex items-center gap-1.5 text-xs bg-green-50 dark:bg-green-900/30 text-green-600 border border-green-100 dark:border-green-800 px-3 py-1.5 rounded-full font-medium">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            En direct
                        </span>
                    </div>
                    {news.length === 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[...Array(4)].map((_, i) => <div key={i} className="bg-gray-100 dark:bg-green-900 rounded-2xl h-48 animate-pulse" />)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {news.map((a, i) => (
                                <a key={i} href={a.url} target="_blank" rel="noreferrer"
                                    className="bg-gradient-to-br from-white to-gray-50 dark:from-green-900 dark:to-green-950 border border-gray-100/50 dark:border-green-900/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
                                    <div className="h-32 overflow-hidden">
                                        <img src={a.image || 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400'} alt={a.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400'; }} />
                                    </div>
                                    <div className="p-3">
                                        <p className="text-xs font-semibold text-gray-800 dark:text-green-200 line-clamp-2 leading-snug">{a.title}</p>
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
