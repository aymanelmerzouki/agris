import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShoppingCart, Plus, X, Save, Search, MapPin, User, Truck, Tag, Bookmark, MessageSquare, Edit2, Trash2, Handshake } from 'lucide-react';
import api from '../../api';
import { useAuth } from '../../contexts/AuthContext';

const UNITES = ['kg', 'tonne', 'caisse', 'litre', 'unite'];
const INPUT = "bg-gray-50/50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-600 text-gray-800 dark:text-gray-100 text-sm rounded-xl focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-emerald-500/15 focus:border-emerald-500 block w-full p-3 transition-all outline-none";
const LABEL = "block mb-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider";

export default function Offres() {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const [offres, setOffres] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [plantes, setPlantes] = useState([]);
    const [mesVentes, setMesVentes] = useState([]);
    const [qteAchat, setQteAchat] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('toutes');
    const [suivies, setSuivies] = useState([]);
    const [negociationItem, setNegociationItem] = useState(null);
    const [negocForm, setNegocForm] = useState({ prix: '', quantite: '', message: '' });
    const [mesNegociations, setMesNegociations] = useState([]);
    const [toast, setToast] = useState('');
    const [editItem, setEditItem] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [form, setForm] = useState({
        plante_id: '', prix: '', quantite: '', unite: 'kg',
        localisation: '', description: '', livraison: false,
        dateCreation: new Date().toISOString().split('T')[0], dateExpiration: '',
    });

    useEffect(() => {
        api.get('/offres').then((r) => setOffres(r.data.data));
        api.get('/plantes?per_page=100').then((r) => setPlantes(r.data.data));
        api.get('/ventes').then((r) => setMesVentes(r.data)).catch(() => {});
        api.get('/negociations/mes').then((r) => setMesNegociations(r.data)).catch(() => {});
    }, []);

    useEffect(() => {
        const action = searchParams.get('action');
        const produit = searchParams.get('produit') || searchParams.get('recherche');
        const qteMax = searchParams.get('qte_max');
        const unite = searchParams.get('unite');
        if (produit) setSearchQuery(produit);
        if (action === 'vendre') {
            setShowForm(true);
            setForm((prev) => ({ ...prev, description: produit ?? '', quantite: qteMax ?? '', unite: unite ?? 'kg' }));
        }
    }, [searchParams]);

    const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data } = await api.post('/offres', form);
        setOffres((prev) => [data, ...prev]);
        setShowForm(false);
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        const { data } = await api.put(`/offres/${editItem.id}`, editForm);
        setOffres((prev) => prev.map((o) => o.id === editItem.id ? { ...o, ...data } : o));
        setEditItem(null);
    };

    const accepter = async (offre) => {
        const qte = parseFloat(qteAchat[offre.id]);
        if (!qte || qte <= 0) return alert('Veuillez saisir une quantité.');
        if (qte > offre.quantite) return alert(`Stock insuffisant. Maximum : ${offre.quantite} ${offre.unite}.`);
        try {
            const { data } = await api.post(`/offres/${offre.id}/accepter`, { quantite: qte });
            setMesVentes((prev) => [data, ...prev]);
            setQteAchat((prev) => { const n = { ...prev }; delete n[offre.id]; return n; });
            setOffres((prev) => prev.map((o) => o.id === offre.id
                ? { ...o, quantite: o.quantite - qte, statut: o.quantite - qte <= 0 ? 'vendu' : 'disponible' }
                : o));
        } catch (err) {
            alert(err.response?.data?.errors?.quantite?.[0] || err.response?.data?.message || 'Erreur lors de l\'achat.');
        }
    };

    const annuler = async (venteId, qte, offreId) => {
        if (!confirm('Annuler cet achat ?')) return;
        try {
            await api.delete(`/ventes/${venteId}/annuler`);
            setMesVentes((prev) => prev.filter((v) => v.id !== venteId));
            setOffres((prev) => prev.map((o) => o.id === offreId ? { ...o, quantite: o.quantite + qte, statut: 'disponible' } : o));
        } catch (err) {
            alert(err.response?.data?.message || 'Erreur.');
        }
    };

    const handleNegociation = async () => {
        try {
            const { data } = await api.post('/negociations', {
                offre_id: negociationItem.id,
                prix_propose: negocForm.prix,
                quantite_proposee: negocForm.quantite,
                message: negocForm.message,
            });
            setMesNegociations((prev) => [data, ...prev]);
            setNegociationItem(null);
            setToast('Votre proposition a été envoyée.');
            setTimeout(() => setToast(''), 3000);
        } catch (err) {
            alert(err.response?.data?.message || 'Erreur lors de l\'envoi.');
        }
    };

    const toggleSuivie = (id) => setSuivies((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);

    const supprimerOffre = async (id) => {
        if (!confirm('Supprimer cette offre ?')) return;
        await api.delete(`/offres/${id}`);
        setOffres((prev) => prev.filter((o) => o.id !== id));
    };

    const offresFiltrees = offres.filter((o) => {
        const matchSearch = !searchQuery || (o.plante?.nom ?? '').toLowerCase().includes(searchQuery.toLowerCase()) || (o.description ?? '').toLowerCase().includes(searchQuery.toLowerCase());
        if (activeTab === 'mes_offres') return matchSearch && o.user_id === user?.id;
        if (activeTab === 'suivies') return false; // handled separately below
        return matchSearch;
    });

    return (
        <div className="min-h-screen pb-20 md:pb-8">
            {/* Toast */}
            {toast && (
                <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-fadeIn">
                    {toast}
                </div>
            )}
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 dark:from-zinc-950 dark:to-zinc-950 px-6 py-8">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold text-white flex items-center gap-3"><ShoppingCart size={28} /> Marketplace</h1>
                        <p className="text-green-100 text-sm mt-1">Achetez et vendez en MAD</p>
                    </div>
                    {['agriculteur', 'manager'].includes(user?.role) && (
                        <button onClick={() => setShowForm(!showForm)}
                            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-4 py-2 rounded-xl transition">
                            {showForm ? <X size={18} /> : <Plus size={18} />}
                            {showForm ? 'Annuler' : 'Publier une offre'}
                        </button>
                    )}
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 md:px-6">
                <div className="mt-6 mb-6 relative">
                    <Search className="absolute left-4 top-3.5 text-gray-400 dark:text-zinc-400" size={20} />
                    <input type="text" placeholder="Rechercher un produit, une plante..."
                        value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-xl shadow-sm focus:ring-4 focus:ring-emerald-500/15 focus:border-emerald-500 transition-all outline-none text-gray-800 dark:text-zinc-100" />
                </div>

                <div className="flex gap-6 border-b border-gray-200 dark:border-zinc-800 mb-6">
                    {[
                        { key: 'toutes', label: 'Toutes les offres' },
                        { key: 'mes_offres', label: 'Mes offres', badge: offres.filter((o) => o.user_id === user?.id).length },
                        { key: 'suivies', label: 'Offres suivies', badge: mesNegociations.length },
                    ].map(({ key, label, badge }) => (
                        <button key={key} onClick={() => setActiveTab(key)}
                            className={activeTab === key
                                ? 'pb-3 text-sm font-bold text-emerald-600 border-b-2 border-emerald-600 flex items-center gap-2'
                                : 'pb-3 text-sm font-medium text-gray-500 dark:text-zinc-400 hover:text-gray-700 transition-colors flex items-center gap-2'}>
                            {label}
                            {badge > 0 && <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-1.5 py-0.5 rounded-full">{badge}</span>}
                        </button>
                    ))}
                </div>

                {showForm && (
                    <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6 mb-6 space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="md:col-span-2">
                                <label className={LABEL}>Plante associée</label>
                                <select className={INPUT} value={form.plante_id} onChange={set('plante_id')}>
                                    <option value="">Aucune</option>
                                    {plantes.map((p) => <option key={p.id} value={p.id}>{p.nom}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={LABEL}>Prix (MAD) *</label>
                                <input className={INPUT} type="number" min="0" step="0.01" placeholder="ex: 150" value={form.prix} onChange={set('prix')} required />
                            </div>
                            <div>
                                <label className={LABEL}>Quantité *</label>
                                <input className={INPUT} type="number" min="0" step="0.01" placeholder="ex: 200" value={form.quantite} onChange={set('quantite')} required />
                            </div>
                            <div>
                                <label className={LABEL}>Unité</label>
                                <select className={INPUT} value={form.unite} onChange={set('unite')}>
                                    {UNITES.map((u) => <option key={u} value={u}>{u}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={LABEL}>Localisation</label>
                                <input className={INPUT} placeholder="ex: Agadir" value={form.localisation} onChange={set('localisation')} />
                            </div>
                            <div>
                                <label className={LABEL}>Date d'expiration</label>
                                <input className={INPUT} type="date" value={form.dateExpiration} onChange={set('dateExpiration')} />
                            </div>
                            <div className="flex items-center gap-3">
                                <input type="checkbox" id="livraison" checked={form.livraison} onChange={set('livraison')} className="w-4 h-4 accent-emerald-600" />
                                <label htmlFor="livraison" className="text-sm text-gray-700 dark:text-zinc-300 font-medium">Livraison disponible</label>
                            </div>
                            <div className="md:col-span-2">
                                <label className={LABEL}>Description</label>
                                <textarea className={INPUT} placeholder="Détails de l'offre..." value={form.description} onChange={set('description')} rows={2} />
                            </div>
                        </div>
                        <button type="submit" className="flex items-center justify-center gap-2 w-full bg-emerald-600 dark:bg-emerald-700 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-all shadow-sm">
                            <Save size={18} /> Publier l'offre
                        </button>
                    </form>
                )}

                {activeTab === 'suivies' ? (
                    <div className="space-y-4">
                        {mesNegociations.length === 0 ? (
                            <p className="text-center text-gray-400 dark:text-zinc-500 py-20">Aucune négociation en cours.</p>
                        ) : mesNegociations.map((n) => (
                            <div key={n.id} className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
                                <div className="flex items-start justify-between mb-3">
                                    <p className="font-bold text-gray-800 dark:text-zinc-100">{n.offre?.plante?.nom ?? 'Produit agricole'}</p>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${n.statut === 'acceptee' ? 'bg-emerald-100 text-emerald-700' : n.statut === 'refusee' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-700'}`}>
                                        {n.statut === 'en_attente' ? 'En attente' : n.statut === 'acceptee' ? 'Acceptée' : 'Refusée'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-zinc-400">
                                    <span>Prix initial : <strong className="text-gray-700 dark:text-zinc-200">{n.offre?.prix} MAD</strong></span>
                                    <span>→</span>
                                    <span>Ta proposition : <strong className="text-emerald-600">{n.prix_propose} MAD</strong></span>
                                </div>
                                <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">Quantité demandée : {n.quantite_proposee} {n.offre?.unite}</p>
                                {n.message && <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1 italic">"{n.message}"</p>}
                            </div>
                        ))}
                    </div>
                ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {offresFiltrees.map((o) => (
                        <div key={o.id} className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-5 hover:shadow-md transition-shadow flex flex-col gap-3">
                            <div className="flex items-start justify-between">
                                <p className="font-bold text-gray-800 dark:text-zinc-100 text-base">{o.plante?.nom ?? 'Produit agricole'}</p>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${o.statut === 'disponible' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{o.statut}</span>
                                    {activeTab !== 'mes_offres' && (
                                        <button onClick={() => toggleSuivie(o.id)}>
                                            <Bookmark size={18} className={suivies.includes(o.id) ? 'text-emerald-500 fill-emerald-500' : 'text-gray-300 hover:text-gray-400'} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <p className="text-2xl font-black text-emerald-600">{o.prix} <span className="text-sm font-medium text-gray-400">MAD / {o.unite}</span></p>

                            <div className="flex flex-col gap-1.5 text-sm text-gray-500 dark:text-zinc-400">
                                <p className="flex items-center gap-2"><User size={14} /> {o.user?.name}</p>
                                {o.localisation && <p className="flex items-center gap-2"><MapPin size={14} /> {o.localisation}</p>}
                                {o.livraison && <p className="flex items-center gap-2"><Truck size={14} /> Livraison disponible</p>}
                            </div>

                            <p className="text-xs text-gray-400 dark:text-zinc-500">Qté : {o.quantite} {o.unite}</p>
                            {o.description && <p className="text-xs text-gray-400 dark:text-zinc-500 line-clamp-2 italic">{o.description}</p>}

                            {activeTab === 'mes_offres' ? (
                                <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100 dark:border-zinc-800">
                                    <button onClick={() => { setEditItem(o); setEditForm({ prix: o.prix, quantite: o.quantite, description: o.description ?? '', localisation: o.localisation ?? '' }); }}
                                        className="flex items-center gap-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 px-3 py-2 rounded-lg text-sm font-medium transition">
                                        <Edit2 size={16} /> Modifier
                                    </button>
                                    <button onClick={() => supprimerOffre(o.id)}
                                        className="flex items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 rounded-lg text-sm font-medium transition">
                                        <Trash2 size={16} /> Supprimer
                                    </button>
                                </div>
                            ) : (
                                o.user_id !== user?.id && (
                                    <div className="mt-auto pt-3 border-t border-gray-100 dark:border-zinc-800 flex flex-col gap-2">
                                        {o.statut === 'disponible' && (
                                            <div className="flex gap-2">
                                                <input type="number" min="0.01" max={o.quantite} step="0.01"
                                                    placeholder={`Max ${o.quantite}`}
                                                    value={qteAchat[o.id] || ''}
                                                    onChange={(e) => setQteAchat({ ...qteAchat, [o.id]: e.target.value })}
                                                    className="bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-800 dark:text-zinc-100 text-sm rounded-xl p-2.5 flex-1 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                                                <button onClick={() => accepter(o)}
                                                    className="flex items-center gap-1.5 bg-emerald-600 dark:bg-emerald-700 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white font-semibold px-4 rounded-xl transition-all text-sm">
                                                    <ShoppingCart size={14} /> Acheter
                                                </button>
                                            </div>
                                        )}
                                        <button onClick={() => { setNegociationItem(o); setNegocForm({ prix: '', message: '' }); }}
                                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 text-sm font-semibold rounded-xl transition-colors shadow-sm">
                                            <Handshake size={16} /> Négocier
                                        </button>
                                    </div>
                                )
                            )}
                        </div>
                    ))}
                </div>
                )}

                {mesVentes.length > 0 && (
                    <div className="mt-10">
                        <h2 className="text-[11px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-4">Mes achats</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {mesVentes.map((v) => (
                                <div key={v.id} className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-5 flex flex-col gap-3">
                                    <p className="font-bold text-gray-800 dark:text-zinc-100">{v.offre?.plante?.nom ?? 'Produit agricole'}</p>
                                    <p className="text-sm text-gray-500 dark:text-zinc-400">{v.quantite} {v.unite} · <span className="font-semibold text-emerald-600">{v.prix_total} MAD</span></p>
                                    <p className="flex items-center gap-2 text-xs text-gray-400 dark:text-zinc-500"><User size={12} /> {v.vendeur?.name}</p>
                                    <button onClick={() => annuler(v.id, v.quantite, v.offre_id)}
                                        className="mt-auto w-full text-sm bg-red-50 dark:bg-red-900/20 hover:bg-red-100 text-red-600 font-semibold py-2 rounded-xl transition">
                                        Annuler l'achat
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Modal édition */}
                {editItem && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/80 backdrop-blur-sm px-4">
                        <div className="bg-white dark:bg-zinc-900 dark:border dark:border-zinc-800 rounded-2xl shadow-xl p-6 w-full max-w-md space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-gray-800 dark:text-zinc-100">Modifier l'offre</h3>
                                <button onClick={() => setEditItem(null)}><X size={20} className="text-gray-400 dark:text-zinc-400" /></button>
                            </div>
                            <form onSubmit={handleEdit} className="space-y-4">
                                <div>
                                    <label className={LABEL}>Prix (MAD) *</label>
                                    <input className="w-full bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg p-3 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:focus:bg-zinc-950"
                                        type="number" min="0" step="0.01" value={editForm.prix} onChange={(e) => setEditForm({ ...editForm, prix: e.target.value })} required />
                                </div>
                                <div>
                                    <label className={LABEL}>Quantité *</label>
                                    <input className="w-full bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg p-3 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:focus:bg-zinc-950"
                                        type="number" min="0" step="0.01" value={editForm.quantite} onChange={(e) => setEditForm({ ...editForm, quantite: e.target.value })} required />
                                </div>
                                <div>
                                    <label className={LABEL}>Localisation</label>
                                    <input className="w-full bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg p-3 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:focus:bg-zinc-950"
                                        value={editForm.localisation} onChange={(e) => setEditForm({ ...editForm, localisation: e.target.value })} />
                                </div>
                                <div>
                                    <label className={LABEL}>Description</label>
                                    <textarea className="w-full bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg p-3 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:focus:bg-zinc-950 placeholder-gray-400 dark:placeholder-zinc-600"
                                        rows={2} value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
                                </div>
                                <div className="flex gap-3">
                                    <button type="button" onClick={() => setEditItem(null)}
                                        className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-300 dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 text-sm font-medium transition">
                                        Annuler
                                    </button>
                                    <button type="submit"
                                        className="flex-1 py-2.5 rounded-xl bg-emerald-600 dark:bg-emerald-700 hover:bg-emerald-700 text-white text-sm font-semibold transition">
                                        Enregistrer
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal négociation */}
                {negociationItem && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/80 backdrop-blur-sm px-4">
                        <div className="bg-white dark:bg-zinc-900 dark:border dark:border-zinc-800 rounded-2xl shadow-xl p-6 w-full max-w-md space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-gray-800 dark:text-zinc-100">Négocier — {negociationItem.plante?.nom ?? 'Produit'}</h3>
                                <button onClick={() => setNegociationItem(null)}><X size={20} className="text-gray-400 dark:text-zinc-400" /></button>
                            </div>
                            <div>
                                <label className={LABEL}>Prix proposé (MAD)</label>
                                <input className="w-full bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg p-3 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:focus:bg-zinc-950"
                                    type="number" min="0" step="0.01" placeholder={`Prix actuel : ${negociationItem.prix} MAD`}
                                    value={negocForm.prix} onChange={(e) => setNegocForm({ ...negocForm, prix: e.target.value })} />
                            </div>
                            <div>
                                <label className={LABEL}>Quantité souhaitée ({negociationItem.unite})</label>
                                <input className="w-full bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg p-3 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:focus:bg-zinc-950"
                                    type="number" min="0.01" max={negociationItem.quantite} step="0.01" placeholder={`Max : ${negociationItem.quantite} ${negociationItem.unite}`}
                                    value={negocForm.quantite} onChange={(e) => setNegocForm({ ...negocForm, quantite: e.target.value })} />
                            </div>
                            <div>
                                <label className={LABEL}>Message au vendeur</label>
                                <textarea className="w-full bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg p-3 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:focus:bg-zinc-950 placeholder-gray-400 dark:placeholder-zinc-600"
                                    rows={3} placeholder="Votre proposition..."
                                    value={negocForm.message} onChange={(e) => setNegocForm({ ...negocForm, message: e.target.value })} />
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setNegociationItem(null)}
                                    className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-300 dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 text-sm font-medium transition">
                                    Annuler
                                </button>
                                <button onClick={handleNegociation}
                                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 dark:bg-emerald-700 hover:bg-emerald-700 text-white text-sm font-semibold transition">
                                    Envoyer
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
