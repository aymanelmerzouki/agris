import React, { useEffect, useState } from 'react';
import { Calendar, ClipboardList, ListTodo, Plus, X, Trash2, Clock, Droplets, Sprout, Wrench, Scissors, Wheat, MoreHorizontal, CheckCircle2, Edit2 } from 'lucide-react';
import api from '../../api';
import { useAuth } from '../../contexts/AuthContext';

const CATEGORIE_ICONS = {
    irrigation: Droplets,
    recolte: Scissors,
    traitement: Wrench,
    semis: Sprout,
    entretien: Wrench,
    autre: MoreHorizontal,
};

const STATUTS_TACHE = [
    { value: 'en_attente', label: 'En attente', color: 'bg-gray-100 text-gray-600' },
    { value: 'en_cours',   label: 'En cours',   color: 'bg-yellow-100 text-yellow-700' },
    { value: 'termine',    label: 'Terminé',     color: 'bg-green-100 text-green-700' },
];

const CATEGORIES = ['irrigation', 'recolte', 'traitement', 'semis', 'entretien', 'autre'];
const PRIORITES  = ['basse', 'normale', 'haute', 'urgente'];
const PRIORITE_COLORS = { basse: 'bg-gray-100 text-gray-500', normale: 'bg-blue-100 text-blue-600', haute: 'bg-orange-100 text-orange-600', urgente: 'bg-red-500/10 text-red-400 border border-red-500/20' };

export default function TodoLists() {
    const { user } = useAuth();
    const [lists, setLists]       = useState([]);
    const [selected, setSelected] = useState(null);
    const [taches, setTaches]     = useState([]);
    const [ouvriers, setOuvriers] = useState([]);
    const [showListForm, setShowListForm] = useState(false);
    const [showTacheForm, setShowTacheForm] = useState(false);
    const [editTache, setEditTache] = useState(null);
    const [editTacheForm, setEditTacheForm] = useState({});

    const [listForm, setListForm] = useState({ titre: '', ouvrier_id: '' });
    const [tacheForm, setTacheForm] = useState({ nomTache: '', description: '', categorie: 'autre', priorite: 'normale', dureeEstimeeMin: '', parcelle: '', dateEcheance: '' });
    const [toast, setToast] = useState('');

    useEffect(() => {
        api.get('/todo-lists').then((r) => setLists(r.data.data ?? r.data));
        if (user?.role === 'manager') {
            api.get('/ouvriers').then((r) => setOuvriers(r.data));
        }
    }, []);

    const selectList = async (list) => {
        setSelected(list);
        setShowTacheForm(false);
        const { data } = await api.get(`/todo-lists/${list.id}/taches`);
        setTaches(data);
    };

    const handleCreateList = async (e) => {
        e.preventDefault();
        const { data } = await api.post('/todo-lists', { ...listForm, dateCreation: new Date().toISOString().split('T')[0] });
        setLists((prev) => [data, ...prev]);
        setShowListForm(false);
        setListForm({ titre: '', ouvrier_id: '' });
    };

    const handleDeleteList = async (id) => {
        if (!confirm('Supprimer cette liste et toutes ses tâches ?')) return;
        await api.delete(`/todo-lists/${id}`);
        setLists((prev) => prev.filter((l) => l.id !== id));
        if (selected?.id === id) setSelected(null);
    };

    const handleCreateTache = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...tacheForm, dureeEstimeeMin: tacheForm.dureeEstimeeMin || null };
            const { data } = await api.post(`/todo-lists/${selected.id}/taches`, payload);
            setTaches((prev) => [...prev, data]);
            setShowTacheForm(false);
            setTacheForm({ nomTache: '', description: '', categorie: 'autre', priorite: 'normale', dureeEstimeeMin: '', parcelle: '', dateEcheance: '' });
            setToast('Tâche ajoutée avec succès.');
            setTimeout(() => setToast(''), 3000);
        } catch (err) {
            const msg = err.response?.data?.message || Object.values(err.response?.data?.errors ?? {})[0]?.[0] || 'Erreur lors de l\'ajout.';
            setToast('❌ ' + msg);
            setTimeout(() => setToast(''), 4000);
        }
    };

    const updateStatut = async (tache, statut) => {
        const { data } = await api.put(`/todo-lists/${selected.id}/taches/${tache.id}`, { statut });
        setTaches((prev) => prev.map((t) => (t.id === tache.id ? data : t)));
    };

    const handleEditTache = async (e) => {
        e.preventDefault();
        const { data } = await api.put(`/todo-lists/${selected.id}/taches/${editTache.id}`, editTacheForm);
        setTaches((prev) => prev.map((t) => t.id === editTache.id ? data : t));
        setEditTache(null);
    };

    const setL = (k) => (e) => setListForm({ ...listForm, [k]: e.target.value });
    const setT = (k) => (e) => setTacheForm({ ...tacheForm, [k]: e.target.value });

    const ouvrierSelectionne = ouvriers.find((o) => o.id == listForm.ouvrier_id);

    return (
        <div className="min-h-screen pb-20 md:pb-8">
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 dark:from-zinc-950 dark:to-zinc-950 dark:border-b dark:border-zinc-800 px-6 py-8">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                            <ListTodo size={24} /> Tâches
                        </h1>
                        <p className="text-green-100 text-sm mt-1">{lists.length} liste(s)</p>
                    </div>
                    {user?.role === 'manager' && (
                        <button onClick={() => setShowListForm(!showListForm)}
                            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors shadow-sm">
                            {showListForm ? <X size={18} /> : <Plus size={18} />}
                            {showListForm ? 'Annuler' : 'Nouvelle liste'}
                        </button>
                    )}
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 md:px-6 mt-6 flex gap-6">
                
                <div className="w-72 flex-shrink-0">
                    
                    {showListForm && user?.role === 'manager' && (
                        <form onSubmit={handleCreateList} className="bg-white dark:bg-zinc-900 rounded-2xl shadow-md border border-gray-100 dark:border-zinc-800 p-4 mb-4 space-y-3">
                            <h3 className="font-bold text-gray-800 dark:text-zinc-100 text-sm">Nouvelle liste</h3>
                            <input className="input" placeholder="Titre *" value={listForm.titre} onChange={setL('titre')} required />
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Assigner à un ouvrier *</label>
                                <select className="input" value={listForm.ouvrier_id} onChange={setL('ouvrier_id')} required>
                                    <option value="">Choisir un ouvrier</option>
                                    {ouvriers.map((o) => (
                                        <option key={o.id} value={o.id}>{o.name}{o.poste ? ` — ${o.poste}` : ''}</option>
                                    ))}
                                </select>
                            </div>
                            <button className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-xl transition text-sm" type="submit">Créer la liste</button>
                        </form>
                    )}

                    
                    {lists.length === 0 ? (
                        <div className="w-full flex flex-col items-center justify-center min-h-[50vh] text-center text-gray-400 dark:text-zinc-400">
                            <ClipboardList size={48} className="text-zinc-500 mb-4 mx-auto" />
                            <p className="font-medium text-sm">Aucune liste de tâches</p>
                            {user?.role === 'manager' && (
                                <p className="text-xs mt-1 opacity-70">Créez une liste pour commencer</p>
                            )}
                        </div>
                    ) : (
                    <div className="space-y-2">
                        {lists.map((l) => (
                            <button key={l.id} onClick={() => selectList(l)}
                                className={`w-full text-left bg-white dark:bg-zinc-900 rounded-xl border p-3 transition-colors cursor-pointer ${selected?.id === l.id ? 'border-emerald-500 shadow-md' : 'border-gray-100 dark:border-zinc-800 shadow-sm hover:border-emerald-500/50'}`}>
                                <div className="flex items-center justify-between mb-1">
                                    <p className="font-semibold text-sm text-gray-900 dark:text-zinc-100 truncate">{l.titre}</p>
                                    <div className="flex items-center gap-1">
                                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${PRIORITE_COLORS[l.priorite]}`}>{l.priorite}</span>
                                        {user?.role === 'manager' && (
                                            <button onClick={(e) => { e.stopPropagation(); handleDeleteList(l.id); }}
                                                className="p-1 text-zinc-500 hover:text-red-400 dark:hover:bg-zinc-800 rounded transition-colors">
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 dark:text-zinc-400">{l.nbreTaches} tâche(s) · {STATUTS_TACHE.find(s => s.value === l.statut)?.label ?? l.statut}</p>
                                {l.dateEcheance && <p className="text-xs text-gray-300 mt-0.5 flex items-center gap-1"><Calendar size={14} />{new Date(l.dateEcheance).toLocaleDateString('fr-FR')}</p>}
                            </button>
                        ))}
                    </div>
                    )}
                </div>

                
                <div className="flex-1">
                    {/* Toast */}
                    {toast && (
                        <div className="mb-4 bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium animate-fadeIn">
                            {toast}
                        </div>
                    )}
                    {lists.length === 0 ? null : !selected ? (
                        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center text-gray-500 dark:text-zinc-400/60">
                            <ClipboardList size={48} className="text-zinc-500 mb-4 mx-auto" />
                            <p className="font-medium">Sélectionnez ou créez une liste pour y ajouter des tâches.</p>
                            <p className="text-sm mt-1 opacity-70">Cliquez sur une liste à gauche</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{selected.titre}</h2>
                                    <p className="text-sm text-gray-400">
                                        {selected.parcelle && `📍 ${selected.parcelle} · `}
                                        {taches.length} tâche(s)
                                    </p>
                                </div>
                                {user?.role === 'manager' && (
                                    <button onClick={() => setShowTacheForm(!showTacheForm)}
                                        className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition">
                                        {showTacheForm ? <X size={14} /> : <Plus size={14} />}
                                        {showTacheForm ? 'Annuler' : '+ Tâche'}
                                    </button>
                                )}
                            </div>

                            
                            {showTacheForm && (
                                <form onSubmit={handleCreateTache} className="bg-white dark:bg-zinc-900 rounded-2xl shadow-md border border-gray-100 dark:border-zinc-800 p-4 mb-4 grid grid-cols-2 gap-3">
                                    <input className="input col-span-2" placeholder="Nom de la tâche *" value={tacheForm.nomTache} onChange={setT('nomTache')} required />
                                    <div>
                                        <label className="text-xs text-gray-500 mb-1 block">Nature</label>
                                        <select className="input" value={tacheForm.categorie} onChange={setT('categorie')}>
                                            {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 mb-1 block">Priorité</label>
                                        <select className="input" value={tacheForm.priorite} onChange={setT('priorite')}>
                                            {PRIORITES.map((p) => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                                        </select>
                                    </div>
                                    <input className="input" placeholder="Parcelle" value={tacheForm.parcelle} onChange={setT('parcelle')} />
                                    <input className="input" type="date" value={tacheForm.dateEcheance} onChange={setT('dateEcheance')} />
                                    <input className="input" type="number" placeholder="Durée (min)" value={tacheForm.dureeEstimeeMin} onChange={setT('dureeEstimeeMin')} />
                                    <textarea className="input col-span-2 text-xs" rows={2} placeholder="Description agronomique" value={tacheForm.description} onChange={setT('description')} />
                                    <button className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-xl transition col-span-2 text-sm" type="submit">Ajouter la tâche</button>
                                </form>
                            )}

                            
                            <div className="space-y-2">
                                {taches.length === 0 && <p className="text-gray-400 dark:text-zinc-500 text-sm text-center py-10">Aucune tâche dans cette liste.</p>}
                                {taches.map((t) => {
                                    const CatIcon = CATEGORIE_ICONS[t.categorie] ?? MoreHorizontal;
                                    return (
                                    <div key={t.id} className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-4 rounded-xl shadow-sm hover:shadow-md transition">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                <CatIcon size={18} className="text-emerald-500 shrink-0" />
                                                <p className="font-semibold text-gray-900 dark:text-zinc-100 truncate">{t.nomTache}</p>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITE_COLORS[t.priorite]}`}>{t.priorite}</span>
                                                {user?.role === 'manager' && (<>
                                                    <button onClick={() => { setEditTache(t); setEditTacheForm({ nomTache: t.nomTache, description: t.description ?? '', categorie: t.categorie, priorite: t.priorite, dureeEstimeeMin: t.dureeEstimeeMin ?? '', statut: t.statut }); }}
                                                        className="p-1 text-zinc-400 hover:text-blue-400 dark:hover:bg-zinc-800 rounded transition-colors">
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button onClick={async () => {
                                                        if (!confirm('Supprimer cette tâche ?')) return;
                                                        await api.delete(`/todo-lists/${selected.id}/taches/${t.id}`);
                                                        setTaches((prev) => prev.filter((x) => x.id !== t.id));
                                                    }} className="p-1 text-zinc-400 hover:text-red-400 dark:hover:bg-zinc-800 rounded transition-colors">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </>)}
                                            </div>
                                        </div>

                                        {t.description && (
                                            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-2 ml-6">
                                                {t.description.length > 60 ? t.description.slice(0, 60) + '…' : t.description}
                                            </p>
                                        )}

                                        <div className="flex items-center gap-3 mt-3 ml-6">
                                            {t.dureeEstimeeMin && (
                                                <span className="flex items-center gap-1 text-xs text-zinc-400">
                                                    <Clock size={12} /> {t.dureeEstimeeMin} min
                                                </span>
                                            )}
                                            {t.completeeAt && (
                                                <span className="flex items-center gap-1 text-xs text-emerald-500">
                                                    <CheckCircle2 size={12} /> {new Date(t.completeeAt).toLocaleDateString('fr-FR')}
                                                </span>
                                            )}
                                            {user?.role === 'ouvrier' ? (
                                                <select
                                                    className="ml-auto text-xs px-2 py-1 rounded-full border-0 font-medium cursor-pointer bg-gray-100 dark:bg-zinc-800 dark:text-zinc-300"
                                                    value={t.statut}
                                                    onChange={async (e) => {
                                                        try {
                                                            await updateStatut(t, e.target.value);
                                                            setToast('Statut mis à jour.');
                                                            setTimeout(() => setToast(''), 2500);
                                                        } catch {
                                                            setToast('❌ Erreur lors de la mise à jour.');
                                                            setTimeout(() => setToast(''), 3000);
                                                        }
                                                    }}>
                                                    {STATUTS_TACHE.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                                                </select>
                                            ) : (
                                                <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium ${STATUTS_TACHE.find(s => s.value === t.statut)?.color}`}>
                                                    {STATUTS_TACHE.find(s => s.value === t.statut)?.label}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Modal édition tâche */}
            {editTache && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/80 backdrop-blur-sm px-4">
                    <div className="bg-white dark:bg-zinc-900 dark:border dark:border-zinc-800 rounded-2xl shadow-xl p-6 w-full max-w-md space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-gray-800 dark:text-zinc-100">Modifier la tâche</h3>
                            <button onClick={() => setEditTache(null)}><X size={20} className="text-gray-400 dark:text-zinc-400" /></button>
                        </div>
                        <form onSubmit={handleEditTache} className="space-y-3">
                            <input className="input" placeholder="Nom *" value={editTacheForm.nomTache} onChange={(e) => setEditTacheForm({...editTacheForm, nomTache: e.target.value})} required />
                            <div className="grid grid-cols-2 gap-3">
                                <select className="input" value={editTacheForm.categorie} onChange={(e) => setEditTacheForm({...editTacheForm, categorie: e.target.value})}>
                                    {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                                </select>
                                <select className="input" value={editTacheForm.priorite} onChange={(e) => setEditTacheForm({...editTacheForm, priorite: e.target.value})}>
                                    {PRIORITES.map((p) => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                                </select>
                                <input className="input" placeholder="Durée (min)" type="number" value={editTacheForm.dureeEstimeeMin} onChange={(e) => setEditTacheForm({...editTacheForm, dureeEstimeeMin: e.target.value})} />
                            </div>
                            <textarea className="input" rows={2} placeholder="Description" value={editTacheForm.description} onChange={(e) => setEditTacheForm({...editTacheForm, description: e.target.value})} />
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setEditTache(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-300 dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 text-sm font-medium transition">Annuler</button>
                                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition">Enregistrer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
