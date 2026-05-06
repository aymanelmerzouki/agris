import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Plus, X, Save, Trash2, MapPin, Calendar, AlertTriangle, ShoppingCart, Tag } from 'lucide-react';
import api from '../../api';

const UNITES = ['kg', 'tonne', 'caisse', 'litre', 'unite'];
const INPUT = "w-full bg-gray-50/50 border border-gray-200 text-gray-800 text-sm rounded-xl focus:bg-white focus:ring-4 focus:ring-emerald-500/15 focus:border-emerald-500 block p-3 transition-all outline-none";
const LABEL = "block mb-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider";

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
        <div className="min-h-screen pb-20 md:pb-8">
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-8">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold text-white flex items-center gap-3">
                            <Package size={28} /> Gestion des stocks
                        </h1>
                        <p className="text-green-200 text-sm mt-1">{stocks.length} produit(s) en stock</p>
                    </div>
                    <button onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-4 py-2 rounded-xl transition">
                        {showForm ? <X size={18} /> : <Plus size={18} />}
                        {showForm ? 'Annuler' : 'Ajouter'}
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 md:px-6 mt-6">
                {showForm && (
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 space-y-5">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="md:col-span-2">
                                <label className={LABEL}>Nom du produit *</label>
                                <input className={INPUT} placeholder="ex: Engrais NPK" value={form.produit} onChange={set('produit')} required />
                            </div>
                            <div>
                                <label className={LABEL}>Plante associée</label>
                                <select className={INPUT} value={form.plante_id} onChange={set('plante_id')}>
                                    <option value="">Aucune</option>
                                    {plantes.map((p) => <option key={p.id} value={p.id}>{p.nom}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={LABEL}>Unité</label>
                                <select className={INPUT} value={form.unite} onChange={set('unite')}>
                                    {UNITES.map((u) => <option key={u} value={u}>{u}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={LABEL}>Quantité *</label>
                                <input className={INPUT} type="number" min="0" step="0.01" placeholder="ex: 500" value={form.quantite} onChange={set('quantite')} required />
                            </div>
                            <div>
                                <label className={LABEL}>Seuil d'alerte</label>
                                <input className={INPUT} type="number" min="0" step="0.01" placeholder="ex: 100" value={form.seuilAlerte} onChange={set('seuilAlerte')} />
                            </div>
                            <div>
                                <label className={LABEL}>Localisation</label>
                                <input className={INPUT} placeholder="ex: Entrepôt A" value={form.localisation} onChange={set('localisation')} />
                            </div>
                            <div>
                                <label className={LABEL}>Date d'entrée</label>
                                <input className={INPUT} type="date" value={form.dateEntree} onChange={set('dateEntree')} />
                            </div>
                            <div>
                                <label className={LABEL}>Date d'expiration</label>
                                <input className={INPUT} type="date" value={form.dateExpiration} onChange={set('dateExpiration')} />
                            </div>
                            <div className="md:col-span-2">
                                <label className={LABEL}>Notes</label>
                                <textarea className={INPUT} placeholder="Observations..." value={form.notes} onChange={set('notes')} rows={2} />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button type="submit"
                                className="flex items-center justify-center gap-2 flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-all shadow-sm">
                                <Save size={18} /> Enregistrer
                            </button>
                            <button type="button" onClick={() => setShowForm(false)}
                                className="flex items-center justify-center gap-2 flex-1 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium py-3 rounded-xl transition-all shadow-sm">
                                <X size={18} /> Annuler
                            </button>
                        </div>
                    </form>
                )}

                {stocks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                        <Package size={56} className="text-gray-300 mb-4" />
                        <p className="font-semibold text-gray-600 dark:text-gray-400">Aucun stock enregistré.</p>
                        <p className="text-sm text-gray-400 mt-1">Ajoutez votre premier produit en stock.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {stocks.map((s) => (
                            <div key={s.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3 relative">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800 capitalize">{s.produit}</h3>
                                        {s.plante && <p className="text-xs text-emerald-600 mt-0.5">{s.plante.nom}</p>}
                                    </div>
                                    <button onClick={() => handleDelete(s.id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="flex items-end gap-2">
                                    <span className={`text-2xl font-black ${isAlerte(s) ? 'text-red-600' : 'text-emerald-600'}`}>
                                        {s.quantite}
                                    </span>
                                    <span className="text-sm font-medium text-gray-500 mb-0.5">{s.unite}</span>
                                    {isAlerte(s) && (
                                        <span className="ml-auto flex items-center gap-1 text-xs bg-red-50 text-red-500 border border-red-100 px-2 py-0.5 rounded-full font-medium">
                                            <AlertTriangle size={12} /> Stock faible
                                        </span>
                                    )}
                                </div>

                                {s.seuilAlerte > 0 && (
                                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                                        <div className={`h-1.5 rounded-full transition-all ${isAlerte(s) ? 'bg-red-400' : 'bg-emerald-400'}`}
                                            style={{ width: `${Math.min((s.quantite / (s.seuilAlerte * 2)) * 100, 100)}%` }} />
                                    </div>
                                )}

                                <div className="flex flex-col gap-1.5 mt-auto">
                                    {s.localisation && (
                                        <p className="flex items-center gap-2 text-sm text-gray-500">
                                            <MapPin size={16} className="text-gray-400 shrink-0" /> {s.localisation}
                                        </p>
                                    )}
                                    {s.dateExpiration && (
                                        <p className="flex items-center gap-2 text-sm text-gray-500">
                                            <Calendar size={16} className="text-gray-400 shrink-0" />
                                            Expire le {new Date(s.dateExpiration).toLocaleDateString('fr-FR')}
                                        </p>
                                    )}
                                </div>
                                <div className="pt-4 mt-2 border-t border-gray-100 flex gap-2">
                                    <Link
                                        to={`/offres?action=acheter&recherche=${encodeURIComponent(s.produit)}`}
                                        className="flex items-center justify-center gap-1.5 flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold py-2 rounded-xl transition-colors text-xs"
                                    >
                                        <ShoppingCart size={14} /> Acheter
                                    </Link>
                                    <Link
                                        to={`/offres?action=vendre&produit=${encodeURIComponent(s.produit)}&qte_max=${s.quantite}&unite=${s.unite}`}
                                        className="flex items-center justify-center gap-1.5 flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-xl transition-colors shadow-sm text-xs"
                                    >
                                        <Tag size={14} /> Vendre
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
