import { useEffect, useState } from 'react';
import api from '../../api';
import { useAuth } from '../../contexts/AuthContext';

export default function Offres() {
    const { user } = useAuth();
    const [offres, setOffres] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [plantes, setPlantes] = useState([]);
    const [mesVentes, setMesVentes] = useState([]);
    const [qteAchat, setQteAchat] = useState({});
    const [form, setForm] = useState({ plante_id: '', prix: '', quantite: '', unite: 'kg', localisation: '', description: '', livraison: false, dateCreation: new Date().toISOString().split('T')[0], dateExpiration: '' });

    useEffect(() => {
        api.get('/offres').then((r) => setOffres(r.data.data));
        api.get('/plantes?per_page=100').then((r) => setPlantes(r.data.data));
        api.get('/ventes').then((r) => setMesVentes(r.data)).catch(() => {});
    }, []);

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
        if (qte > offre.quantite) return alert(`Stock insuffisant. Maximum disponible : ${offre.quantite} ${offre.unite}.`);
        try {
            const { data } = await api.post(`/offres/${offre.id}/accepter`, { quantite: qte });
            setMesVentes((prev) => [data, ...prev]);
            setQteAchat((prev) => { const n = { ...prev }; delete n[offre.id]; return n; });
            setOffres((prev) => prev.map((o) => o.id === offre.id
                ? { ...o, quantite: o.quantite - qte, statut: o.quantite - qte <= 0 ? 'vendu' : 'disponible' }
                : o
            ));
        } catch (err) {
            const msg = err.response?.data?.errors?.quantite?.[0]
                || err.response?.data?.message
                || 'Erreur lors de l\'achat.';
            alert(msg);
        }
    };

    const annuler = async (venteId, qte, offreId, unite) => {
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
                            <div className="mt-3 flex gap-2">
                                <input
                                    type="number"
                                    min="0.01"
                                    max={o.quantite}
                                    step="0.01"
                                    placeholder={`Qté (max ${o.quantite})`}
                                    value={qteAchat[o.id] || ''}
                                    onChange={(e) => setQteAchat({ ...qteAchat, [o.id]: e.target.value })}
                                    className="input flex-1 text-sm"
                                />
                                <button onClick={() => accepter(o)} className="btn-primary text-sm px-3">
                                    Acheter
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {mesVentes.length > 0 && (
                <div className="mt-10">
                    <h2 className="text-lg font-bold text-gray-700 dark:text-white mb-3">Mes achats</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {mesVentes.map((v) => (
                            <div key={v.id} className="bg-white dark:bg-green-900 rounded-2xl shadow-sm border border-gray-100 dark:border-green-800 p-4">
                                <p className="font-bold text-gray-800 dark:text-white">{v.offre?.plante?.nom ?? 'Produit agricole'}</p>
                                <p className="text-sm text-gray-500 dark:text-green-300 mt-1">{v.quantite} {v.unite} · {v.prix_total} MAD</p>
                                <p className="text-xs text-gray-400 dark:text-green-400/70 mt-0.5">Vendeur : {v.vendeur?.name}</p>
                                <button onClick={() => annuler(v.id, v.quantite, v.offre_id, v.unite)} className="mt-3 w-full text-sm bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-1.5 rounded-xl transition">
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
