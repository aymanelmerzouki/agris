import { useEffect, useState } from 'react';
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
    const [form, setForm] = useState({
        plante_id: '', dateDebut: '', natureSol: '',
        superficieHa: '', parcelle: '', stadeVegetatif: 'germination', notesAgriculteur: '',
    });

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
                {showForm && (
                    <form onSubmit={handleSubmit} className="bg-white dark:bg-green-900 rounded-2xl shadow-md border border-gray-100 dark:border-green-800 p-6 mb-6 space-y-6">
                        <h2 className="font-bold text-gray-800 text-lg">Enregistrer une nouvelle culture</h2>

                        
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Plante *</label>
                            <select className="input" value={form.plante_id}
                                onChange={(e) => set('plante_id')(e.target.value)} required>
                                <option value="">Choisir une plante</option>
                                {plantes.map((p) => <option key={p.id} value={p.id}>{p.nom} — {p.espece}</option>)}
                            </select>
                        </div>

                        
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-3 block">
                                Nature du sol * <span className="text-gray-400 font-normal">(choisissez celle qui ressemble le plus à votre sol)</span>
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                                {NATURES_SOL.map((sol) => (
                                    <button key={sol.value} type="button"
                                        onClick={() => set('natureSol')(sol.value)}
                                        className={`rounded-xl border-2 overflow-hidden transition-all ${form.natureSol === sol.value ? sol.color + ' shadow-md scale-105' : 'border-gray-200 hover:border-gray-300'}`}>
                                        <img src={sol.img} alt={sol.label}
                                            className="w-full h-20 object-cover bg-gray-200"
                                            onError={(e) => { e.target.onerror=null; e.target.src=sol.fallback; }}
                                        />
                                        <div className="p-2 text-center">
                                            <p className="text-xs font-bold text-gray-800">{sol.label}</p>
                                            <p className="text-xs text-gray-400 leading-tight">{sol.desc}</p>
                                        </div>
                                        {form.natureSol === sol.value && (
                                            <div className="bg-green-500 text-white text-xs text-center py-0.5">✓ Sélectionné</div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">Superficie (ha) *</label>
                                <input className="input" type="number" step="0.01" min="0.01" placeholder="ex: 2.5"
                                    value={form.superficieHa}
                                    onChange={(e) => set('superficieHa')(e.target.value)} required />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">Parcelle</label>
                                <input className="input" placeholder="ex: P-12"
                                    value={form.parcelle}
                                    onChange={(e) => set('parcelle')(e.target.value)} />
                            </div>
                        </div>

                        
                        {calcLoading && (
                            <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-600 animate-pulse">
                                Calcul en cours...
                            </div>
                        )}
                        {calcul && !calcLoading && (
                            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-100">
                                <p className="text-sm font-semibold text-gray-700 mb-3">✅ Estimations calculées automatiquement</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white dark:bg-green-800 rounded-lg p-3 text-center shadow-sm">
                                        <p className="text-2xl font-extrabold text-blue-600">{calcul.BesoinsEau} L</p>
                                        <p className="text-xs text-gray-500">Besoins en eau / jour</p>
                                    </div>
                                    <div className="bg-white dark:bg-green-800 rounded-lg p-3 text-center shadow-sm">
                                        <p className="text-2xl font-extrabold text-green-600">{calcul.phSol}</p>
                                        <p className="text-xs text-gray-500">pH du sol estimé</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">Date de début *</label>
                                <input className="input" type="date" value={form.dateDebut}
                                    onChange={(e) => set('dateDebut')(e.target.value)} required />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">Stade végétatif</label>
                                <select className="input" value={form.stadeVegetatif}
                                    onChange={(e) => set('stadeVegetatif')(e.target.value)}>
                                    {STADES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Notes</label>
                            <textarea className="input" rows={2} placeholder="Observations..."
                                value={form.notesAgriculteur}
                                onChange={(e) => set('notesAgriculteur')(e.target.value)} />
                        </div>

                        <button className="btn-primary w-full py-3 text-base" type="submit"
                            disabled={!form.natureSol || !calcul}>
                            ✅ Enregistrer la culture
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
                        <a href="/plantes" className="mt-4 inline-block text-sm text-green-600 border border-green-300 px-4 py-2 rounded-xl hover:bg-green-50 transition">
                            Consulter la bibliothèque
                        </a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {suivis.map((s) => (
                            <div key={s.id} className="relative rounded-2xl border border-gray-100 dark:border-green-700/40 p-5 hover:shadow-lg transition bg-white dark:bg-white/10 dark:backdrop-blur-md shadow-sm">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white">{s.plante?.nom}</h3>
                                        <p className="text-xs text-gray-400 dark:text-green-200/80">{s.plante?.espece}</p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUTS[s.statut]?.color}`}>
                                        {STATUTS[s.statut]?.label}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {s.stadeVegetatif && (
                                        <span className="text-xs px-2 py-1 rounded-full font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                                            {s.stadeVegetatif}
                                        </span>
                                    )}
                                    {s.natureSol && (
                                        <span className="text-xs bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-1 rounded-full">
                                            🪨 {s.natureSol}
                                        </span>
                                    )}
                                    {s.parcelle && (
                                        <span className="text-xs bg-gray-100 dark:bg-green-800/50 text-gray-600 dark:text-green-300 px-2 py-1 rounded-full">
                                            📍 {s.parcelle}
                                        </span>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 text-center">
                                        <div className="flex items-center justify-center gap-1 mb-0.5">
                                            <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
                                                <path d="M12 2a10 10 0 00-7.07 17.07C6.39 20.56 9.08 21.5 12 21.5s5.61-.94 7.07-2.43A10 10 0 0012 2zm0 17c-3.87 0-7-3.13-7-7 0-2.38 1.19-4.47 3-5.74V14h2V8.26A6.97 6.97 0 0119 12c0 3.87-3.13 7-7 7z"/>
                                            </svg>
                                            <p className="text-blue-600 dark:text-blue-400 font-bold text-base">
                                                {Number(s.BesoinsEau).toLocaleString('fr-FR')} L
                                            </p>
                                        </div>
                                        <p className="text-gray-500 dark:text-gray-400">eau/jour</p>
                                    </div>
                                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2 text-center">
                                        <div className="flex items-center justify-center gap-1 mb-0.5">
                                            <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/>
                                            </svg>
                                            <p className="text-green-600 dark:text-green-400 font-bold text-base">{s.phSol ?? '—'}</p>
                                        </div>
                                        <p className="text-gray-500 dark:text-gray-400">pH sol</p>
                                    </div>
                                </div>
                                {s.notesAgriculteur && (
                                    <p className="text-xs text-gray-400 dark:text-green-300/70 mt-3 line-clamp-2 italic">"{s.notesAgriculteur}"</p>
                                )}
                                <p className="text-xs text-gray-300 dark:text-green-500/70 mt-3">
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
