import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Map, X, Plus, Save, Trash2, Thermometer } from 'lucide-react';
import api from '../../api';

const STADES = ['germination', 'croissance', 'floraison', 'fructification', 'recolte'];

const NATURES_SOL = [
    {
        value: 'argileux',
        label: 'Argileux',
        desc: 'Lourd, retient bien l\'eau',
        img: '/images/sols/argileux.webp',
        fallback: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=300&q=80',
        color: 'border-orange-500 bg-orange-50',
    },
    {
        value: 'sableux',
        label: 'Sableux',
        desc: 'Léger, draine rapidement',
        img: '/images/sols/sableux.webp',
        fallback: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=300&q=80',
        color: 'border-yellow-400 bg-yellow-50',
    },
    {
        value: 'limoneux',
        label: 'Limoneux',
        desc: 'Équilibré, fertile',
        img: '/images/sols/limoneux.webp',
        fallback: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300&q=80',
        color: 'border-amber-500 bg-amber-50',
    },
    {
        value: 'calcaire',
        label: 'Calcaire',
        desc: 'Alcalin, caillouteux',
        img: '/images/sols/calcaire.webp',
        fallback: 'https://images.unsplash.com/photo-1531722569936-825d4eaf4af8?w=300&q=80',
        color: 'border-gray-400 bg-gray-50',
    },
    {
        value: 'humifere',
        label: 'Humifère',
        desc: 'Riche en matière organique',
        img: '/images/sols/humifere.webp',
        fallback: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&q=80',
        color: 'border-stone-600 bg-stone-50',
    },
];

const STADE_COLORS = {
    germination: 'bg-yellow-100 text-yellow-700',
    croissance: 'bg-blue-100 text-blue-700',
    floraison: 'bg-pink-100 text-pink-700',
    fructification: 'bg-orange-100 text-orange-700',
    recolte: 'bg-green-100 text-green-700',
};

const STATUTS = {
    en_cours: { label: 'En cours', color: 'bg-green-100 text-green-700' },
    recolte: { label: 'Récolté', color: 'bg-emerald-100 text-emerald-700' },
    abandonne: { label: 'Abandonné', color: 'bg-red-100 text-red-600' },
};

export default function SuiviPlantes() {
    const [suivis, setSuivis] = useState([]);
    const [plantes, setPlantes] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [calcul, setCalcul] = useState(null);
    const [calcLoading, setCalcLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const [form, setForm] = useState({
        plante_id: searchParams.get('plante_id') ?? '', dateDebut: '', natureSol: '',
        superficieHa: '', parcelle: '', stadeVegetatif: 'germination', notesAgriculteur: '',
    });

    useEffect(() => {
        if (searchParams.get('plante_id')) setShowForm(true);
    }, []);

    useEffect(() => {
        Promise.all([
            api.get('/suivi-plantes'),
            api.get('/plantes?per_page=100'),
        ]).then(([s, p]) => {
            setSuivis(s.data.data ?? []);
            setPlantes(p.data.data ?? p.data ?? []);
        }).finally(() => setLoading(false));
    }, []);

    const set = (k) => (v) => {
        const newForm = { ...form, [k]: v };
        setForm(newForm);
        if (newForm.plante_id && newForm.natureSol && newForm.superficieHa > 0) {
            calculerAuto(newForm);
        }
    };

    const calculerAuto = async (f) => {
        setCalcLoading(true);
        try {
            const { data } = await api.post('/suivi-plantes/calculer', {
                plante_id: f.plante_id,
                natureSol: f.natureSol,
                superficieHa: f.superficieHa,
            });
            setCalcul(data);
        } catch {}
        finally { setCalcLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data } = await api.post('/suivi-plantes', form);
        setSuivis((prev) => [data, ...prev]);
        setShowForm(false);
        setCalcul(null);
        setForm({ plante_id: '', dateDebut: '', natureSol: '', superficieHa: '', parcelle: '', stadeVegetatif: 'germination', notesAgriculteur: '' });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-green-950 pb-20 md:pb-8">
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-8">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold text-white flex items-center gap-3"><Map size={28} /> Mes cultures</h1>
                        <p className="text-green-200 text-sm mt-1">{suivis.length} culture(s) suivie(s)</p>
                    </div>
                    <button onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-4 py-2 rounded-xl transition">
                        {showForm ? <X size={18} /> : <Plus size={18} />}
                        {showForm ? 'Annuler' : 'Nouvelle culture'}
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 md:px-6 mt-6">
                {showForm && (
                    <form onSubmit={handleSubmit} className="mb-6 space-y-4">

                        {/* Card 1 — Plante */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <label className="block mb-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Plante *</label>
                            <select className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 text-sm rounded-xl focus:bg-white focus:ring-4 focus:ring-emerald-500/15 focus:border-emerald-500 block p-3 transition-all outline-none"
                                value={form.plante_id} onChange={(e) => set('plante_id')(e.target.value)} required>
                                <option value="">Choisir une plante</option>
                                {plantes.map((p) => <option key={p.id} value={p.id}>{p.nom} — {p.espece}</option>)}
                            </select>
                        </div>

                        {/* Card 2 — Nature du sol */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <label className="block mb-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                Nature du sol *
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                                {NATURES_SOL.map((sol) => (
                                    <button key={sol.value} type="button"
                                        onClick={() => set('natureSol')(sol.value)}
                                        className={form.natureSol === sol.value
                                            ? 'border-2 border-emerald-500 ring-4 ring-emerald-50 bg-emerald-50/10 shadow-md transform scale-[1.02] transition-all rounded-xl overflow-hidden'
                                            : 'border border-gray-200 bg-white hover:border-gray-300 opacity-70 hover:opacity-100 transition-all cursor-pointer rounded-xl overflow-hidden'}>
                                        <img src={sol.img} alt={sol.label}
                                            className="w-full h-16 object-cover bg-gray-200"
                                            onError={(e) => { e.target.onerror=null; e.target.src=sol.fallback; }} />
                                        <div className="p-2 text-center">
                                            <p className="text-xs font-bold text-gray-800">{sol.label}</p>
                                            <p className="text-xs text-gray-400 leading-tight">{sol.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Card 3 — Parcelle */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block mb-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Superficie (ha) *</label>
                                    <input className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 text-sm rounded-xl focus:bg-white focus:ring-4 focus:ring-emerald-500/15 focus:border-emerald-500 block p-3 transition-all outline-none placeholder-gray-400"
                                        type="number" step="0.01" min="0.01" placeholder="ex: 2.5"
                                        value={form.superficieHa} onChange={(e) => set('superficieHa')(e.target.value)} required />
                                </div>
                                <div>
                                    <label className="block mb-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Parcelle</label>
                                    <input className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 text-sm rounded-xl focus:bg-white focus:ring-4 focus:ring-emerald-500/15 focus:border-emerald-500 block p-3 transition-all outline-none placeholder-gray-400"
                                        placeholder="ex: P-12"
                                        value={form.parcelle} onChange={(e) => set('parcelle')(e.target.value)} />
                                </div>
                            </div>
                        </div>

                        {/* Estimations calculées */}
                        {calcLoading && (
                            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-400 animate-pulse border border-gray-100">
                                Calcul en cours...
                            </div>
                        )}
                        {calcul && !calcLoading && (
                            <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm">
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">Estimations calculées automatiquement</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                                        <p className="text-2xl font-extrabold text-blue-600">{calcul.BesoinsEau} L</p>
                                        <p className="text-xs text-gray-500 mt-1">Besoins en eau / jour</p>
                                    </div>
                                    <div className="bg-emerald-50 rounded-xl p-4 text-center">
                                        <p className="text-2xl font-extrabold text-emerald-600">{calcul.phSol}</p>
                                        <p className="text-xs text-gray-500 mt-1">pH du sol estimé</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Card 4 — Planification */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block mb-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Date de début *</label>
                                    <input className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 text-sm rounded-xl focus:bg-white focus:ring-4 focus:ring-emerald-500/15 focus:border-emerald-500 block p-3 transition-all outline-none"
                                        type="date" value={form.dateDebut} onChange={(e) => set('dateDebut')(e.target.value)} required />
                                </div>
                                <div>
                                    <label className="block mb-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Stade végétatif</label>
                                    <select className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 text-sm rounded-xl focus:bg-white focus:ring-4 focus:ring-emerald-500/15 focus:border-emerald-500 block p-3 transition-all outline-none"
                                        value={form.stadeVegetatif} onChange={(e) => set('stadeVegetatif')(e.target.value)}>
                                        {STADES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="mt-6">
                                <label className="block mb-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Notes</label>
                                <textarea className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 text-sm rounded-xl focus:bg-white focus:ring-4 focus:ring-emerald-500/15 focus:border-emerald-500 block p-3 transition-all outline-none placeholder-gray-400"
                                    rows={2} placeholder="Observations agronomiques..."
                                    value={form.notesAgriculteur} onChange={(e) => set('notesAgriculteur')(e.target.value)} />
                            </div>
                        </div>

                        <button type="submit" disabled={!form.natureSol || !calcul}
                            className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl shadow-sm shadow-emerald-600/20 transition-all disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none">
                            <Save size={20} />
                            Enregistrer la culture
                        </button>
                        {!calcul && <p className="text-xs text-center text-gray-400">Sélectionnez une plante, un sol et une superficie pour continuer</p>}
                    </form>
                )}

                
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(3)].map((_, i) => <div key={i} className="bg-gray-100 rounded-2xl h-40 animate-pulse" />)}
                    </div>
                ) : suivis.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <p className="text-5xl mb-3">🌱</p>
                        <p className="font-medium">Aucune culture enregistrée.</p>
                        <Link to="/plantes" className="mt-4 inline-block text-sm text-green-600 border border-green-300 px-4 py-2 rounded-xl hover:bg-green-50 transition">
                            Consulter la bibliothèque
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {suivis.map((s) => (
                            <CultureCard key={s.id} s={s} onDelete={(id) => setSuivis((prev) => prev.filter((x) => x.id !== id))} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function CultureCard({ s, onDelete }) {
    const [liveData, setLiveData] = useState(null);

    useEffect(() => {
        api.get(`/suivi-plantes/${s.id}/live`).then((r) => setLiveData(r.data)).catch(() => {});
    }, [s.id]);

    const handleDelete = async () => {
        if (!confirm('Supprimer cette culture ?')) return;
        await api.delete(`/suivi-plantes/${s.id}`);
        onDelete(s.id);
    };

    return (
        <div className="relative rounded-2xl border border-gray-100 dark:border-green-700/40 p-5 hover:shadow-lg transition bg-white dark:bg-white/10 dark:backdrop-blur-md shadow-sm">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{s.plante?.nom}</h3>
                    <p className="text-xs text-gray-400 dark:text-green-200/80">{s.plante?.espece}</p>
                </div>
                <div className="flex items-center gap-2">
                    {liveData && (
                        <span className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                            <Thermometer size={12} /> {liveData.meteo.temperature}°C
                        </span>
                    )}
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUTS[s.statut]?.color}`}>
                        {STATUTS[s.statut]?.label}
                    </span>
                    <button onClick={handleDelete} className="text-gray-300 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-xs px-2 py-1 rounded-full font-medium bg-orange-100 text-orange-700">
                    {liveData ? liveData.stade_dynamique : (s.stadeVegetatif ?? '…')}
                </span>
                {s.natureSol && <span className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full">{s.natureSol}</span>}
                {s.parcelle && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{s.parcelle}</span>}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 text-center">
                    <p className="text-blue-600 font-bold text-base">
                        {liveData ? Number(liveData.besoin_eau_live).toLocaleString('fr-FR') : Number(s.BesoinsEau).toLocaleString('fr-FR')} L
                    </p>
                    <p className="text-gray-500">eau/jour</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2 text-center">
                    <p className="text-green-600 font-bold text-base">{s.phSol ?? '—'}</p>
                    <p className="text-gray-500">pH sol</p>
                </div>
            </div>

            {liveData && <p className="text-xs text-gray-400 mt-2">Jour {liveData.progression_jours} de culture</p>}
            {s.notesAgriculteur && <p className="text-xs text-gray-400 mt-2 line-clamp-2 italic">"{s.notesAgriculteur}"</p>}
            <p className="text-xs text-gray-300 mt-2">Depuis le {new Date(s.dateDebut).toLocaleDateString('fr-FR')}</p>
        </div>
    );
}
