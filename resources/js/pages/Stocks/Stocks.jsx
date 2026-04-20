import { useEffect, useState } from 'react';
import api from '../../api';

const UNITES = ['kg', 'tonne', 'caisse', 'litre', 'unite'];

export default function Stocks() {
    const [stocks, setStocks] = useState([]);
    const [plantes, setPlantes] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ produit: '', plante_id: '', quantite: '', unite: 'kg', seuilAlerte: '', localisation: '', dateEntree: new Date().toISOString().split('T')[0], dateExpiration: '', notes: '' });

    useEffect(() => {
        api.get('/stocks').then((r) => setStocks(r.data.data ?? r.data));
        api.get('/plantes?per_page=100').then((r) => setPlantes(r.data.data));
    }, []);

    const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data } = await api.post('/stocks', form);
        setStocks((prev) => [data, ...prev]);
        setShowForm(false);
        setForm({ produit: '', plante_id: '', quantite: '', unite: 'kg', seuilAlerte: '', localisation: '', dateEntree: new Date().toISOString().split('T')[0], dateExpiration: '', notes: '' });
    };

    const handleDelete = async (id) => {
        await api.delete(`/stocks/${id}`);
        setStocks((prev) => prev.filter((s) => s.id !== id));
    };

    const isAlerte = (s) => s.seuilAlerte && s.quantite <= s.seuilAlerte;

    return (
        <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-8">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold text-white">📦 Gestion des stocks</h1>
                        <p className="text-green-200 text-sm mt-1">{stocks.length} produit(s) en stock</p>
                    </div>
                    <button onClick={() => setShowForm(!showForm)}
                        className="bg-white text-green-700 font-semibold text-sm px-4 py-2 rounded-xl shadow hover:bg-green-50 transition">
                        + Ajouter
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 md:px-6 mt-6">
                {showForm && (
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-6 grid grid-cols-2 gap-4">
                        <input className="input col-span-2" placeholder="Nom du produit *" value={form.produit} onChange={set('produit')} required />
                        <select className="input" value={form.plante_id} onChange={set('plante_id')}>
                            <option value="">Plante associée (optionnel)</option>
                            {plantes.map((p) => <option key={p.id} value={p.id}>{p.nom}</option>)}
                        </select>
                        <select className="input" value={form.unite} onChange={set('unite')}>
                            {UNITES.map((u) => <option key={u} value={u}>{u}</option>)}
                        </select>
                        <input className="input" type="number" placeholder="Quantité *" value={form.quantite} onChange={set('quantite')} required />
                        <input className="input" type="number" placeholder="Seuil d'alerte" value={form.seuilAlerte} onChange={set('seuilAlerte')} />
                        <input className="input" placeholder="Localisation" value={form.localisation} onChange={set('localisation')} />
                        <input className="input" type="date" value={form.dateEntree} onChange={set('dateEntree')} />
                        <input className="input" type="date" placeholder="Date expiration" value={form.dateExpiration} onChange={set('dateExpiration')} />
                        <textarea className="input col-span-2" placeholder="Notes" value={form.notes} onChange={set('notes')} rows={2} />
                        <div className="col-span-2 flex gap-3">
                            <button className="btn-primary flex-1" type="submit">Enregistrer</button>
                            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Annuler</button>
                        </div>
                    </form>
                )}

                {stocks.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <p className="text-4xl mb-3">📦</p>
                        <p>Aucun stock enregistré.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {stocks.map((s) => (
                            <div key={s.id} className={`bg-white rounded-2xl shadow-sm border p-5 hover:shadow-md transition ${isAlerte(s) ? 'border-red-200 bg-red-50' : 'border-gray-100'}`}>
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-bold text-gray-900">{s.produit}</h3>
                                        {s.plante && <p className="text-xs text-green-600 mt-0.5">🌿 {s.plante.nom}</p>}
                                    </div>
                                    {isAlerte(s) && (
                                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">⚠️ Stock bas</span>
                                    )}
                                </div>
                                <div className="text-2xl font-extrabold text-green-700 mb-1">
                                    {s.quantite} <span className="text-sm font-normal text-gray-400">{s.unite}</span>
                                </div>
                                {s.seuilAlerte && (
                                    <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
                                        <div className={`h-1.5 rounded-full ${isAlerte(s) ? 'bg-red-400' : 'bg-green-400'}`}
                                            style={{ width: `${Math.min((s.quantite / (s.seuilAlerte * 2)) * 100, 100)}%` }} />
                                    </div>
                                )}
                                <div className="text-xs text-gray-400 space-y-0.5">
                                    {s.localisation && <p>📍 {s.localisation}</p>}
                                    {s.dateExpiration && <p>📅 Expire le {new Date(s.dateExpiration).toLocaleDateString('fr-FR')}</p>}
                                </div>
                                <button onClick={() => handleDelete(s.id)}
                                    className="mt-3 text-xs text-red-400 hover:text-red-600 transition">
                                    Supprimer
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
