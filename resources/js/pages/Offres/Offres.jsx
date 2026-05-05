import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShoppingCart, Plus, X, Save, Search, MapPin, User, Truck, Tag, Bookmark, MessageSquare, Edit2, Trash2, Handshake } from 'lucide-react';
import api from '../../api';
import { useAuth } from '../../contexts/AuthContext';

const UNITES = ['kg', 'tonne', 'caisse', 'litre', 'unite'];
const INPUT = "bg-gray-50/50 border border-gray-200 text-gray-800 text-sm rounded-xl focus:bg-white focus:ring-4 focus:ring-emerald-500/15 focus:border-emerald-500 block w-full p-3 transition-all outline-none";
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
    const [negocForm, setNegocForm] = useState({ prix: '', message: '' });
    const [form, setForm] = useState({
        plante_id: '', prix: '', quantite: '', unite: 'kg',
        localisation: '', description: '', livraison: false,
        dateCreation: new Date().toISOString().split('T')[0], dateExpiration: '',
    });

    useEffect(() => {
        api.get('/offres').then((r) => setOffres(r.data.data));
        api.get('/plantes?per_page=100').then((r) => setPlantes(r.data.data));
        api.get('/ventes').then((r) => setMesVentes(r.data)).catch(() => {});
    }, []);

    useEffect(() => {
        const action = searchParams.get('action');
        const produit = searchParams.get('produit') || searchParams.get('recherche');
        const qteMax = searchParams.get('qte_max');
        const unite = searchParams.get('unite');

        if (produit) setSearchQuery(produit);
        if (action === 'vendre') {
            setShowForm(true);
            setForm((prev) => ({
                ...prev,
                description: produit ?? '',
                quantite: qteMax ?? '',
                unite: unite ?? 'kg',
            }));
        }
    }, [searchParams]);

    const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data } = await api.post('/offres', form);
        setOffres((prev) => [data, ...prev]);
        setShowForm(false);
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
                : o
            ));
        } catch (err) {
            alert(err.response?.data?.errors?.quantite?.[0] || err.response?.data?.message || 'Erreur lors de l\'achat.');
        }
    };

    const annuler = async (venteId, qte, offreId) => {
        if (!confirm('Annuler cet achat et restaurer le stock ?')) return;
        try {
            await api.delete(`/ventes/${venteId}/annuler`);
            setMesVentes((prev) => prev.filter((v) => v.id !== venteId));
            setOffres((prev) => prev.map((o) => o.id === offreId
                ? { ...o, quantite: o.quantite + qte, statut: 'disponible' }
                : o
            ));
        } catch (err) {
            alert(err.response?.data?.message || 'Erreur lors de l\'annulation.');
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
        if (activeTab === 'suivies') return matchSearch && suivies.includes(o.id);
        return matchSearch;
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-green-950 pb-20 md:pb-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-8">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold text-white flex items-center gap-3">
                            <ShoppingCart size={28} /> Marketplace
                        </h1>
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
                {/* Barre de recherche */}
                <div className="mt-6 mb-6 relative">
                    <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                    <input type="text" placeholder="Rechercher un produit, une plante..."
                        value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-xl shadow-sm focus:ring-4 focus:ring-emerald-500/15 focus:border-emerald-500 transition-all outline-none text-gray-800" />
                </div>

                {/* Onglets */}
                <div className="max-w-5xl mx-auto flex gap-6 border-b border-gray-200 mb-6">
                    {[
                        { key: 'toutes', label: 'Toutes les offres' },
                        { key: 'mes_offres', label: `Mes offres`, badge: offres.filter((o) => o.user_id === user?.id).length },
                        { key: 'suivies', label: 'Offres suivies', badge: suivies.length },
                    ].map(({ key, label, badge }) => (
                        <button key={key} onClick={() => setActiveTab(key)}
                            className={activeTab === key
                                ? 'pb-3 text-sm font-bold text-emerald-600 border-b-2 border-emerald-600 flex items-center gap-2'
                                : 'pb-3 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-2'}>
                            {label}
                            {badge > 0 && <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-1.5 py-0.5 rounded-full">{badge}</span>}
                        </button>
                    ))}
                </div>
                {showForm && (
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 space-y-5">
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
                                <label htmlFor="livraison" className="text-sm text-gray-700 font-medium">Livraison disponible</label>
                            </div>
                            <div className="md:col-span-2">
                                <label className={LABEL}>Description</label>
                                <textarea className={INPUT} placeholder="Détails de l'offre..." value={form.description} onChange={set('description')} rows={2} />
                            </div>
                        </div>
                        <button type="submit"
                            className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-all shadow-sm">
                            <Save size={18} /> Publier l'offre
                        </button>
                    </form>
                )}

                {/* Grille des offres */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {offresFiltrees.map((o) => (
                        <div key={o.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow flex flex-col gap-3">
                            <div className="flex items-start justify-between">
                                <p className="font-bold text-gray-800 text-base">{o.plante?.nom ?? 'Produit agricole'}</p>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${o.statut === 'disponible' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                                        {o.statut}
                                    </span>
                                    {activeTab !== 'mes_offres' && (
                                        <button onClick={() => toggleSuivie(o.id)} className="transition-colors">
                                            <Bookmark size={18} className={suivies.includes(o.id) ? 'text-emerald-500 fill-emerald-500' : 'text-gray-300 hover:text-gray-400'} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <p className="text-2xl font-black text-emerald-600">{o.prix} <span className="text-sm font-medium text-gray-400">MAD / {o.unite}</span></p>

                            <div className="flex flex-col gap-1.5 text-sm text-gray-500">
                                <p className="flex items-center gap-2"><User size={14} className="text-gray-400" /> {o.user?.name}</p>
                                {o.localisation && <p className="flex items-center gap-2"><MapPin size={14} className="text-gray-400" /> {o.localisation}</p>}
                                {o.livraison && <p className="flex items-center gap-2"><Truck size={14} className="text-gray-400" /> Livraison disponible</p>}
                            </div>

                            <p className="text-xs text-gray-400">Qté disponible : {o.quantite} {o.unite}</p>
                            {o.description && <p className="text-xs text-gray-400 line-clamp-2 italic">{o.description}</p>}

                            {activeTab === 'mes_offres' ? (
                                <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
                                    <button className="flex items-center gap-2 text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-lg text-sm font-medium transition">
                                        <Edit2 size={16} /> Modifier
                                    </button>
                                    <button onClick={() => supprimerOffre(o.id)} className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg text-sm font-medium transition">
                                        <Trash2 size={16} /> Supprimer
                                    </button>
                                </div>
                            ) : (
                                o.user_id !== user?.id && (
                                    <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-2">
                                        {o.statut === 'disponible' && (
                                            <div className="flex gap-2">
                                                <input type="number" min="0.01" max={o.quantite} step="0.01"
                                                    placeholder={`Max ${o.quantite}`}
                                                    value={qteAchat[o.id] || ''}
                                                    onChange={(e) => setQteAchat({ ...qteAchat, [o.id]: e.target.value })}
                                                    className="bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl p-2.5 flex-1 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                                                <button onClick={() => accepter(o)}
                                                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 rounded-xl transition-all text-sm">
                                                    <ShoppingCart size={14} /> Acheter
                                                </button>
                                            </div>
                                        )}
                                        <button onClick={() => { setNegociationItem(o); setNegocForm({ prix: '', message: '' }); }}
                                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl transition-colors shadow-sm">
                                            <Handshake size={16} /> Négocier
                                        </button>
                                    </div>
                                )
                            )}
                        </div>
                    ))}
                </div>

                {/* Modale négociation */}
                {negociationItem && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
                        <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-gray-800">Négocier — {negociationItem.plante?.nom ?? 'Produit'}</h3>
                                <button onClick={() => setNegociationItem(null)}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
                            </div>
                            <div>
                                <label className={LABEL}>Prix proposé (MAD)</label>
                                <input className={INPUT} type="number" min="0" step="0.01" placeholder={`Prix actuel : ${negociationItem.prix} MAD`}
                                    value={negocForm.prix} onChange={(e) => setNegocForm({ ...negocForm, prix: e.target.value })} />
                            </div>
                            <div>
                                <label className={LABEL}>Message au vendeur</label>
                                <textarea className={INPUT} rows={3} placeholder="Votre proposition..."
                                    value={negocForm.message} onChange={(e) => setNegocForm({ ...negocForm, message: e.target.value })} />
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setNegociationItem(null)}
                                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition">
                                    Annuler
                                </button>
                                <button onClick={() => { alert('Négociation envoyée (fonctionnalité à brancher sur l\'API).'); setNegociationItem(null); }}
                                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition">
                                    Envoyer
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Mes achats */}
                {mesVentes.length > 0 && (
                    <div className="mt-10">
                        <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">Mes achats</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {mesVentes.map((v) => (
                                <div key={v.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3">
                                    <p className="font-bold text-gray-800">{v.offre?.plante?.nom ?? 'Produit agricole'}</p>
                                    <p className="text-sm text-gray-500">{v.quantite} {v.unite} · <span className="font-semibold text-emerald-600">{v.prix_total} MAD</span></p>
                                    <p className="flex items-center gap-2 text-xs text-gray-400"><User size={12} /> {v.vendeur?.name}</p>
                                    <button onClick={() => annuler(v.id, v.quantite, v.offre_id)}
                                        className="mt-auto w-full text-sm bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2 rounded-xl transition">
                                        Annuler l'achat
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
