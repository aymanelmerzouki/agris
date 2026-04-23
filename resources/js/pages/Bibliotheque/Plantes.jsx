import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

const FALLBACK = 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400';

export default function Plantes() {
    const [plantes, setPlantes] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState(null);

    useEffect(() => {
        api.get('/plantes', { params: { page, search } }).then((r) => {
            setPlantes(r.data.data);
            setMeta(r.data);
        });
    }, [page, search]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-green-950 pb-20 md:pb-8">
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-8">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-2xl font-extrabold text-white">Bibliothèque des plantes</h1>
                    <p className="text-green-100 text-sm mt-1">{meta?.total ?? '—'} plantes référencées</p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 md:px-6 mt-6">
                <input
                    className="mb-6 max-w-sm w-full bg-white/10 dark:bg-green-900/50 border border-white/20 dark:border-green-700 rounded-lg px-3 py-2 text-sm text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-green-300"
                    placeholder="Rechercher une plante..."
                    value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {plantes.map((p) => (
                        <Link key={p.id} to={`/plantes/${p.id}`}
                            className="bg-white dark:bg-green-900 rounded-2xl shadow-sm border border-gray-100 dark:border-green-800 overflow-hidden hover:shadow-md transition group">
                            <div className="h-40 overflow-hidden bg-gray-100 dark:bg-green-800">
                                <img
                                    src={p.imageUrl || FALLBACK}
                                    alt={p.nom}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                    onError={(e) => { e.target.src = FALLBACK; }}
                                />
                            </div>
                            <div className="p-4">
                                <h2 className="font-bold text-gray-900 dark:text-white text-base">{p.nom}</h2>
                                <p className="text-sm text-gray-500 dark:text-green-200 mt-0.5">{p.espece} — {p.famille}</p>
                                <p className="text-xs text-gray-400 dark:text-green-300 mt-2">
                                    🌡 {p.temperatureMin}°C / {p.temperatureMax}°C · ⏱ {p.dureePousseeJours}j
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>

                {meta && (
                    <div className="flex gap-2 mt-6 justify-center">
                        <button className="btn-secondary" disabled={page === 1} onClick={() => setPage(page - 1)}>Précédent</button>
                        <span className="py-2 px-3 text-sm text-gray-600 dark:text-green-300">{page} / {meta.last_page}</span>
                        <button className="btn-secondary" disabled={page === meta.last_page} onClick={() => setPage(page + 1)}>Suivant</button>
                    </div>
                )}
            </div>
        </div>
    );
}
