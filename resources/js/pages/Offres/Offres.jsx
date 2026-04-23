import { useEffect, useState } from 'react';
import api from '../../api';
import { useAuth } from '../../contexts/AuthContext';

export default function Offres() {
    const { user } = useAuth();
    const [offres, setOffres] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [plantes, setPlantes] = useState([]);
    const [form, setForm] = useState({ plante_id: '', prix: '', quantite: '', unite: 'kg', localisation: '', description: '', livraison: false, dateCreation: new Date().toISOString().split('T')[0], dateExpiration: '' });

    useEffect(() => {
        api.get('/offres').then((r) => setOffres(r.data.data));
        api.get('/plantes?per_page=100').then((r) => setPlantes(r.data.data));
    }, []);

    const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data } = await api.post('/offres', form);
        setOffres((prev) => [data, ...prev]);
        setShowForm(false);
    };

    const accepter = async (id) => {
        const { data } = await api.post(`/offres/${id}/accepter`);
        setOffres((prev) => prev.map((o) => (o.id === id ? data : o)));
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-green-950 pb-20 md:pb-8">
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-8">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold text-white">Marketplace</h1>
                        <p className="text-green-100 text-sm mt-1">Achetez et vendez en MAD</p>
                    </div>
                    {['agriculteur', 'manager'].includes(user?.role) && (
                        <button className="bg-white text-green-700 font-semibold text-sm px-4 py-2 rounded-xl shadow hover:bg-green-50 transition"
                            onClick={() => setShowForm(!showForm)}>
                            + Publier une offre
                        </button>
                    )}
                </div>
            </div>
            <div className="max-w-5xl mx-auto px-4 md:px-6 mt-6">
            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 mb-6 grid grid-cols-2 gap-4">
                    <select className="input col-span-2" value={form.plante_id} onChange={set('plante_id')}>
                        <option value="">Plante (optionnel)</option>
                        {plantes.map((p) => <option key={p.id} value={p.id}>{p.nom}</option>)}
                    </select>
                    <input className="input" type="number" placeholder="Prix" value={form.prix} onChange={set('prix')} required />
                    <input className="input" type="number" placeholder="Quantité" value={form.quantite} onChange={set('quantite')} required />
                    <select className="input" value={form.unite} onChange={set('unite')}>
                        {['kg', 'tonne', 'caisse', 'litre', 'unite'].map((u) => <option key={u} value={u}>{u}</option>)}
                    </select>
                    <input className="input" placeholder="Localisation" value={form.localisation} onChange={set('localisation')} />
                    <input className="input" type="date" value={form.dateExpiration} onChange={set('dateExpiration')} placeholder="Date expiration" />
                    <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={form.livraison} onChange={set('livraison')} /> Livraison disponible
                    </label>
                    <textarea className="input col-span-2" placeholder="Description" value={form.description} onChange={set('description')} />
                    <button className="btn-primary col-span-2" type="submit">Publier</button>
                </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {offres.map((o) => (
                    <div key={o.id} className="bg-white dark:bg-green-900 rounded-2xl shadow-sm border border-gray-100 dark:border-green-800 p-4 hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="font-bold text-gray-800 dark:text-white">{o.plante?.nom ?? 'Produit agricole'}</p>
                                <p className="text-sm text-gray-500 dark:text-green-200/80">{o.user?.name} · {o.localisation}</p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${o.statut === 'disponible' ? 'bg-green-100 dark:bg-green-800/50 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-green-800/30 text-gray-500 dark:text-gray-400'}`}>
                                {o.statut}
                            </span>
                        </div>
                        <p className="text-lg font-extrabold text-green-600 dark:text-green-400">{o.prix} MAD / {o.unite}</p>
                        <p className="text-sm text-gray-500 dark:text-green-300 mt-0.5">Qté: {o.quantite} {o.unite} {o.livraison && '· 🚚 Livraison'}</p>
                        {o.description && <p className="text-xs text-gray-400 dark:text-green-400/70 mt-1 line-clamp-2">{o.description}</p>}
                        {o.statut === 'disponible' && o.user_id !== user?.id && (
                            <button onClick={() => accepter(o.id)} className="btn-primary mt-3 w-full text-sm">
                                Acheter / Accepter
                            </button>
                        )}
                    </div>
                ))}
            </div>
            </div>
        </div>
    );
}
