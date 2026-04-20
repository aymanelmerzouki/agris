import { useEffect, useState } from 'react';
import api from '../../api';

const STADES = ['germination', 'croissance', 'floraison', 'fructification', 'recolte'];
const STADE_COLORS = {
    germination: 'bg-yellow-100 text-yellow-700',
    croissance: 'bg-blue-100 text-blue-700',
    floraison: 'bg-pink-100 text-pink-700',
    fructification: 'bg-orange-100 text-orange-700',
    recolte: 'bg-green-100 text-green-700',
};
const STATUTS = { en_cours: { label: 'En cours', color: 'bg-green-100 text-green-700' }, recolte: { label: 'Récolté', color: 'bg-emerald-100 text-emerald-700' }, abandonne: { label: 'Abandonné', color: 'bg-red-100 text-red-600' } };

export default function SuiviPlantes() {
    const [suivis, setSuivis] = useState([]);
    const [plantes, setPlantes] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ plante_id: '', dateDebut: '', BesoinsEau: '', superficieHa: '', parcelle: '', stadeVegetatif: 'germination', phSol: '', notesAgriculteur: '' });

    useEffect(() => {
        Promise.all([
            api.get('/suivi-plantes'),
            api.get('/plantes?per_page=100'),
        ]).then(([s, p]) => {
            setSuivis(s.data.data ?? []);
            setPlantes(p.data.data ?? []);
        }).finally(() => setLoading(false));
    }, []);

    const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data } = await api.post('/suivi-plantes', form);
        setSuivis((prev) => [data, ...prev]);
        setShowForm(false);
        setForm({ plante_id: '', dateDebut: '', BesoinsEau: '', superficieHa: '', parcelle: '', stadeVegetatif: 'germination', phSol: '', notesAgriculteur: '' });
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-8">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold text-white">🌿 Mes cultures</h1>
                        <p className="text-green-200 text-sm mt-1">{suivis.length} culture(s) suivie(s)</p>
                    </div>
                    <button onClick={() => setShowForm(!showForm)}
                        className="bg-white text-green-700 font-semibold text-sm px-4 py-2 rounded-xl shadow hover:bg-green-50 transition">
                        {showForm ? 'Annuler' : '+ Nouvelle culture'}
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 md:px-6 mt-6">
                {/* Formulaire */}
                {showForm && (
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-6">
                        <h2 className="font-bold text-gray-800 mb-4">Enregistrer une nouvelle culture</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <select className="input col-span-2" value={form.plante_id} onChange={set('plante_id')} required>
                                <option value="">Choisir une plante *</option>
                                {plantes.map((p) => <option key={p.id} value={p.id}>{p.nom} — {p.espece}</option>)}
                            </select>
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Date de début *</label>
                                <input className="input" type="date" value={form.dateDebut} onChange={set('dateDebut')} required />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Besoins en eau (L/jour) *</label>
                                <input className="input" type="number" placeholder="ex: 25" value={form.BesoinsEau} onChange={set('BesoinsEau')} required />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Superficie (ha)</label>
                                <input className="input" type="number" step="0.1" placeholder="ex: 2.5" value={form.superficieHa} onChange={set('superficieHa')} />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Parcelle</label>
                                <input className="input" placeholder="ex: P-12" value={form.parcelle} onChange={set('parcelle')} />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Stade végétatif</label>
                                <select className="input" value={form.stadeVegetatif} onChange={set('stadeVegetatif')}>
                                    {STADES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">pH du sol (0–14)</label>
                                <input className="input" type="number" step="0.1" min="0" max="14" placeholder="ex: 6.5" value={form.phSol} onChange={set('phSol')} />
                            </div>
                            <div className="col-span-2">
                                <label className="text-xs text-gray-500 mb-1 block">Notes</label>
                                <textarea className="input" rows={3} placeholder="Observations, traitements appliqués..." value={form.notesAgriculteur} onChange={set('notesAgriculteur')} />
                            </div>
                            <button className="btn-primary col-span-2 py-3" type="submit">
                                ✅ Enregistrer la culture
                            </button>
                        </div>
                    </form>
                )}

                {/* Liste */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(3)].map((_, i) => <div key={i} className="bg-gray-100 rounded-2xl h-40 animate-pulse" />)}
                    </div>
                ) : suivis.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <p className="text-5xl mb-3">🌱</p>
                        <p className="font-medium">Aucune culture enregistrée.</p>
                        <p className="text-sm mt-1">Cliquez sur "+ Nouvelle culture" pour commencer.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {suivis.map((s) => (
                            <div key={s.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-bold text-gray-900">{s.plante?.nom}</h3>
                                        <p className="text-xs text-gray-400">{s.plante?.espece}</p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUTS[s.statut]?.color}`}>
                                        {STATUTS[s.statut]?.label}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-3">
                                    {s.stadeVegetatif && (
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${STADE_COLORS[s.stadeVegetatif]}`}>
                                            {s.stadeVegetatif}
                                        </span>
                                    )}
                                    {s.parcelle && (
                                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                            📍 {s.parcelle}
                                        </span>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                                    <div className="bg-blue-50 rounded-lg p-2 text-center">
                                        <p className="text-blue-600 font-bold text-base">{s.BesoinsEau}L</p>
                                        <p>eau/jour</p>
                                    </div>
                                    <div className="bg-green-50 rounded-lg p-2 text-center">
                                        <p className="text-green-600 font-bold text-base">{s.phSol ?? '—'}</p>
                                        <p>pH sol</p>
                                    </div>
                                </div>

                                {s.notesAgriculteur && (
                                    <p className="text-xs text-gray-400 mt-3 line-clamp-2 italic">"{s.notesAgriculteur}"</p>
                                )}

                                <p className="text-xs text-gray-300 mt-3">
                                    Depuis le {new Date(s.dateDebut).toLocaleDateString('fr-FR')}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
