import React, { useEffect, useState } from 'react';
import api from '../../api';
import { useAuth } from '../../contexts/AuthContext';

const STATUTS_TACHE = [
    { value: 'en_attente', label: 'En attente', color: 'bg-gray-100 text-gray-600' },
    { value: 'en_cours',   label: 'En cours',   color: 'bg-yellow-100 text-yellow-700' },
    { value: 'termine',    label: 'Terminé',     color: 'bg-green-100 text-green-700' },
];

const CATEGORIES = ['irrigation', 'recolte', 'traitement', 'semis', 'entretien', 'autre'];
const PRIORITES  = ['basse', 'normale', 'haute', 'urgente'];
const PRIORITE_COLORS = { basse: 'bg-gray-100 text-gray-500', normale: 'bg-blue-100 text-blue-600', haute: 'bg-orange-100 text-orange-600', urgente: 'bg-red-100 text-red-600' };

export default function TodoLists() {
    const { user } = useAuth();
    const [lists, setLists]       = useState([]);
    const [selected, setSelected] = useState(null);
    const [taches, setTaches]     = useState([]);
    const [ouvriers, setOuvriers] = useState([]);
    const [showListForm, setShowListForm] = useState(false);
    const [showTacheForm, setShowTacheForm] = useState(false);

    const [listForm, setListForm] = useState({ titre: '', description: '', ouvrier_id: '', dateEcheance: '', priorite: 'normale', parcelle: '' });
    const [tacheForm, setTacheForm] = useState({ nomTache: '', description: '', categorie: 'autre', priorite: 'normale', dureeEstimeeMin: '' });

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
        setListForm({ titre: '', description: '', ouvrier_id: '', dateEcheance: '', priorite: 'normale', parcelle: '' });
    };

    const handleCreateTache = async (e) => {
        e.preventDefault();
        const { data } = await api.post(`/todo-lists/${selected.id}/taches`, tacheForm);
        setTaches((prev) => [...prev, data]);
        setShowTacheForm(false);
        setTacheForm({ nomTache: '', description: '', categorie: 'autre', priorite: 'normale', dureeEstimeeMin: '' });
    };

    const updateStatut = async (tache, statut) => {
        const { data } = await api.put(`/todo-lists/${selected.id}/taches/${tache.id}`, { statut });
        setTaches((prev) => prev.map((t) => (t.id === tache.id ? data : t)));
    };

    const setL = (k) => (e) => setListForm({ ...listForm, [k]: e.target.value });
    const setT = (k) => (e) => setTacheForm({ ...tacheForm, [k]: e.target.value });

    const ouvrierSelectionne = ouvriers.find((o) => o.id == listForm.ouvrier_id);

    return (
        <div className="min-h-screen pb-20 md:pb-8">

            <div className="w-full bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800 pb-6 mb-8 mt-4 px-6">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-2">Tâches</h1>
                        <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">{lists.length} liste(s)</p>
                    </div>
                    {user?.role === 'manager' && (
                        <button onClick={() => setShowListForm(!showListForm)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm text-sm">
                            {showListForm ? 'Annuler' : '+ Nouvelle liste'}
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
                                        <option key={o.id} value={o.id}>
                                            {o.name}{o.poste ? ` — ${o.poste}` : ''}
                                        </option>
                                    ))}
                                </select>
                                {ouvrierSelectionne && (
                                    <div className="mt-1 flex items-center gap-2 bg-green-50 rounded-lg px-2 py-1">
                                        <div className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center text-xs font-bold text-green-700">
                                            {ouvrierSelectionne.name[0]}
                                        </div>
                                        <span className="text-xs text-green-700 font-medium">{ouvrierSelectionne.name}</span>
                                    </div>
                                )}
                            </div>

                            <select className="input" value={listForm.priorite} onChange={setL('priorite')}>
                                {PRIORITES.map((p) => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                            </select>

                            <input className="input" type="date" placeholder="Date échéance" value={listForm.dateEcheance} onChange={setL('dateEcheance')} />
                            <input className="input" placeholder="Parcelle" value={listForm.parcelle} onChange={setL('parcelle')} />
                            <textarea className="input text-xs" rows={2} placeholder="Description" value={listForm.description} onChange={setL('description')} />
                            <button className="btn-primary w-full text-sm" type="submit">Créer la liste</button>
                        </form>
                    )}

                    
                    {lists.length === 0 ? (
                        <div className="w-full flex flex-col items-center justify-center min-h-[50vh] text-center text-gray-400 dark:text-zinc-400">
                            <p className="text-4xl mb-3">📋</p>
                            <p className="font-medium text-sm">Aucune liste de tâches</p>
                            {user?.role === 'manager' && (
                                <p className="text-xs mt-1 opacity-70">Créez une liste pour commencer</p>
                            )}
                        </div>
                    ) : (
                    <div className="space-y-2">
                        {lists.map((l) => (
                            <button key={l.id} onClick={() => selectList(l)}
                                className={`w-full text-left bg-white dark:bg-zinc-900 rounded-xl border p-3 hover:shadow-md transition ${selected?.id === l.id ? 'border-green-400 shadow-md' : 'border-gray-100 dark:border-zinc-800 shadow-sm'}`}>
                                <div className="flex items-center justify-between mb-1">
                                    <p className="font-semibold text-sm text-gray-900 dark:text-zinc-100 truncate">{l.titre}</p>
                                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${PRIORITE_COLORS[l.priorite]}`}>{l.priorite}</span>
                                </div>
                                <p className="text-xs text-gray-400 dark:text-zinc-400">{l.nbreTaches} tâche(s) · {l.statut}</p>
                                {l.dateEcheance && <p className="text-xs text-gray-300 mt-0.5">📅 {new Date(l.dateEcheance).toLocaleDateString('fr-FR')}</p>}
                            </button>
                        ))}
                    </div>
                    )}
                </div>

                
                <div className="flex-1">
                    {lists.length === 0 ? null : !selected ? (
                        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center text-gray-500 dark:text-zinc-400/60">
                            <p className="text-4xl mb-3">📋</p>
                            <p className="font-medium">Sélectionnez une liste</p>
                            <p className="text-sm mt-1">Cliquez sur une liste pour voir ses tâches</p>
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
                                        className="btn-primary text-sm">
                                        {showTacheForm ? 'Annuler' : '+ Tâche'}
                                    </button>
                                )}
                            </div>

                            
                            {showTacheForm && (
                                <form onSubmit={handleCreateTache} className="bg-white dark:bg-zinc-900 rounded-2xl shadow-md border border-gray-100 dark:border-zinc-800 p-4 mb-4 grid grid-cols-2 gap-3">
                                    <input className="input col-span-2" placeholder="Nom de la tâche *" value={tacheForm.nomTache} onChange={setT('nomTache')} required />

                                    
                                    <div>
                                        <label className="text-xs text-gray-500 mb-1 block">Nature de la tâche</label>
                                        <select className="input" value={tacheForm.categorie} onChange={setT('categorie')}>
                                            {CATEGORIES.map((c) => (
                                                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-500 mb-1 block">Priorité</label>
                                        <select className="input" value={tacheForm.priorite} onChange={setT('priorite')}>
                                            {PRIORITES.map((p) => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                                        </select>
                                    </div>

                                    <input className="input" type="number" placeholder="Durée estimée (min)" value={tacheForm.dureeEstimeeMin} onChange={setT('dureeEstimeeMin')} />
                                    <textarea className="input col-span-2 text-xs" rows={2} placeholder="Description" value={tacheForm.description} onChange={setT('description')} />
                                    <button className="btn-primary col-span-2 text-sm" type="submit">Ajouter la tâche</button>
                                </form>
                            )}

                            
                            <div className="space-y-2">
                                {taches.length === 0 && <p className="text-gray-400 text-sm text-center py-10">Aucune tâche dans cette liste.</p>}
                                {taches.map((t) => (
                                    <div key={t.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm p-4 flex items-center justify-between hover:shadow-md transition">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-medium text-gray-900 dark:text-zinc-100">{t.nomTache}</p>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${PRIORITE_COLORS[t.priorite]}`}>{t.priorite}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                                <span className="bg-gray-100 px-2 py-0.5 rounded-full">{t.categorie}</span>
                                                {t.dureeEstimeeMin && <span>⏱ {t.dureeEstimeeMin} min</span>}
                                                {t.completeeAt && <span>✅ {new Date(t.completeeAt).toLocaleDateString('fr-FR')}</span>}
                                            </div>
                                        </div>
                                        
                                        {user?.role === 'ouvrier' ? (
                                            <select
                                                className={`text-xs px-3 py-1.5 rounded-full border-0 font-medium cursor-pointer ${STATUTS_TACHE.find(s => s.value === t.statut)?.color}`}
                                                value={t.statut}
                                                onChange={(e) => updateStatut(t, e.target.value)}>
                                                {STATUTS_TACHE.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                                            </select>
                                        ) : (
                                            <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${STATUTS_TACHE.find(s => s.value === t.statut)?.color}`}>
                                                {STATUTS_TACHE.find(s => s.value === t.statut)?.label}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
