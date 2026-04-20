import { useEffect, useState } from 'react';
import api from '../../api';
import { useAuth } from '../../contexts/AuthContext';

const STATUTS_TACHE = ['en_attente', 'en_cours', 'termine'];
const COULEURS = { en_attente: 'bg-gray-100 text-gray-600', en_cours: 'bg-yellow-100 text-yellow-700', termine: 'bg-green-100 text-green-700' };

export default function TodoLists() {
    const { user } = useAuth();
    const [lists, setLists] = useState([]);
    const [selected, setSelected] = useState(null);
    const [taches, setTaches] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({ titre: '', description: '', ouvrier_id: '', dateEcheance: '', priorite: 'normale', parcelle: '' });

    useEffect(() => {
        api.get('/todo-lists').then((r) => setLists(r.data.data ?? r.data));
        if (user?.role === 'manager') {
            api.get('/me').then(() => {
                // Charger les ouvrirs — on utilise un endpoint simple
            });
        }
    }, []);

    const selectList = async (list) => {
        setSelected(list);
        const { data } = await api.get(`/todo-lists/${list.id}/taches`);
        setTaches(data);
    };

    const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

    const handleCreateList = async (e) => {
        e.preventDefault();
        const { data } = await api.post('/todo-lists', { ...form, dateCreation: new Date().toISOString().split('T')[0] });
        setLists((prev) => [data, ...prev]);
        setShowForm(false);
    };

    const updateTacheStatut = async (tache, statut) => {
        const { data } = await api.put(`/todo-lists/${selected.id}/taches/${tache.id}`, { statut });
        setTaches((prev) => prev.map((t) => (t.id === tache.id ? data : t)));
    };

    return (
        <div className="p-6 flex gap-6">
            {/* Liste gauche */}
            <div className="w-1/3">
                <div className="flex items-center justify-between mb-3">
                    <h1 className="text-xl font-bold text-green-700">📋 Todo Lists</h1>
                    {user?.role === 'manager' && (
                        <button className="btn-primary text-sm" onClick={() => setShowForm(!showForm)}>+</button>
                    )}
                </div>

                {showForm && (
                    <form onSubmit={handleCreateList} className="bg-white rounded-xl shadow p-4 mb-4 space-y-2">
                        <input className="input" placeholder="Titre" value={form.titre} onChange={set('titre')} required />
                        <input className="input" placeholder="ID Ouvrier" type="number" value={form.ouvrier_id} onChange={set('ouvrier_id')} required />
                        <input className="input" type="date" value={form.dateEcheance} onChange={set('dateEcheance')} />
                        <select className="input" value={form.priorite} onChange={set('priorite')}>
                            {['basse', 'normale', 'haute', 'urgente'].map((p) => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <input className="input" placeholder="Parcelle" value={form.parcelle} onChange={set('parcelle')} />
                        <button className="btn-primary w-full text-sm" type="submit">Créer</button>
                    </form>
                )}

                <div className="space-y-2">
                    {lists.map((l) => (
                        <button key={l.id} onClick={() => selectList(l)}
                            className={`w-full text-left bg-white rounded-xl shadow p-3 hover:shadow-md transition ${selected?.id === l.id ? 'ring-2 ring-green-500' : ''}`}>
                            <p className="font-semibold">{l.titre}</p>
                            <p className="text-xs text-gray-400">{l.statut} · {l.nbreTaches} tâches</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tâches droite */}
            <div className="flex-1">
                {selected ? (
                    <>
                        <h2 className="text-xl font-bold mb-4">{selected.titre}</h2>
                        <div className="space-y-2">
                            {taches.map((t) => (
                                <div key={t.id} className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">{t.nomTache}</p>
                                        <p className="text-xs text-gray-400">{t.categorie} · {t.dureeEstimeeMin}min</p>
                                    </div>
                                    <select
                                        className={`text-xs px-2 py-1 rounded-full border-0 ${COULEURS[t.statut]}`}
                                        value={t.statut}
                                        onChange={(e) => updateTacheStatut(t, e.target.value)}>
                                        {STATUTS_TACHE.map((s) => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <p className="text-gray-400 mt-10 text-center">Sélectionnez une liste pour voir les tâches.</p>
                )}
            </div>
        </div>
    );
}
