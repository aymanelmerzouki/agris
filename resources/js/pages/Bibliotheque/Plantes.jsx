import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

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
        <div className="p-6">
            <h1 className="text-2xl font-bold text-green-700 mb-4">📚 Bibliothèque des plantes</h1>
            <input className="input mb-6 max-w-sm" placeholder="Rechercher une plante..."
                value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {plantes.map((p) => (
                    <Link key={p.id} to={`/plantes/${p.id}`}
                        className="bg-white rounded-xl shadow p-4 hover:shadow-md transition">
                        {p.imageUrl && <img src={p.imageUrl} alt={p.nom} className="w-full h-40 object-cover rounded mb-3" />}
                        <h2 className="font-semibold text-lg">{p.nom}</h2>
                        <p className="text-sm text-gray-500">{p.espece} — {p.famille}</p>
                        <p className="text-xs text-gray-400 mt-1">🌡 {p.temperatureMin}°C / {p.temperatureMax}°C · ⏱ {p.dureePousseeJours}j</p>
                    </Link>
                ))}
            </div>
            {meta && (
                <div className="flex gap-2 mt-6 justify-center">
                    <button className="btn-secondary" disabled={page === 1} onClick={() => setPage(page - 1)}>Précédent</button>
                    <span className="py-2 px-3 text-sm">{page} / {meta.last_page}</span>
                    <button className="btn-secondary" disabled={page === meta.last_page} onClick={() => setPage(page + 1)}>Suivant</button>
                </div>
            )}
        </div>
    );
}
