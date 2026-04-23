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
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-green-700">🛒 Marketplace</h1>
                {['agriculteur', 'manager'].includes(user?.role) && (
                    <button className="btn-primary" onClick={() => setShowForm(!showForm)}>+ Publier une offre</button>
                )}
            </div>
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
                    <div key={o.id} className="bg-white rounded-xl shadow p-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold text-gray-800 dark:text-white">{o.plante?.nom ?? 'Produit agricole'}</p>
                                <p className="text-sm text-gray-500 dark:text-green-300">{o.user?.name} · {o.localisation}</p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${o.statut === 'disponible' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                {o.statut}
                            </span>
                        </div>
                        <p className="text-lg font-bold text-green-700 mt-2">{o.prix} MAD / {o.unite}</p>
                        <p className="text-sm text-gray-600">Qté: {o.quantite} {o.unite} {o.livraison && '· 🚚 Livraison'}</p>
                        {o.description && <p className="text-xs text-gray-400 mt-1">{o.description}</p>}
                        {o.statut === 'disponible' && o.user_id !== user?.id && (
                            <button onClick={() => accepter(o.id)} className="btn-primary mt-3 w-full text-sm">
                                Acheter / Accepter
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
