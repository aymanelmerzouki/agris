import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

const STADES = ['germination', 'croissance', 'floraison', 'fructification', 'recolte'];
const STATUTS = { en_cours: '🟢 En cours', recolte: '🌾 Récolté', abandonne: '🔴 Abandonné' };

export default function SuiviPlantes() {
    const [suivis, setSuivis] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [plantes, setPlantes] = useState([]);
    const [form, setForm] = useState({ plante_id: '', dateDebut: '', BesoinsEau: '', superficieHa: '', parcelle: '', stadeVegetatif: 'germination', phSol: '', notesAgriculteur: '' });

    useEffect(() => {
        api.get('/suivi-plantes').then((r) => setSuivis(r.data.data));
        api.get('/plantes?per_page=100').then((r) => setPlantes(r.data.data));
    }, []);

    const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data } = await api.post('/suivi-plantes', form);
        setSuivis((prev) => [data, ...prev]);
        setShowForm(false);
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-green-700">🌿 Mes cultures</h1>
                <button className="btn-primary" onClick={() => setShowForm(!showForm)}>+ Nouvelle culture</button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 mb-6 grid grid-cols-2 gap-4">
                    <select className="input col-span-2" value={form.plante_id} onChange={set('plante_id')} required>
                        <option value="">Choisir une plante</option>
                        {plantes.map((p) => <option key={p.id} value={p.id}>{p.nom}</option>)}
                    </select>
                    <input className="input" type="date" placeholder="Date début" value={form.dateDebut} onChange={set('dateDebut')} required />
                    <input className="input" type="number" placeholder="Besoins eau (L/jour)" value={form.BesoinsEau} onChange={set('BesoinsEau')} required />
                    <input className="input" type="number" placeholder="Superficie (ha)" value={form.superficieHa} onChange={set('superficieHa')} />
                    <input className="input" placeholder="Parcelle" value={form.parcelle} onChange={set('parcelle')} />
                    <select className="input" value={form.stadeVegetatif} onChange={set('stadeVegetatif')}>
                        {STADES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <input className="input" type="number" step="0.1" placeholder="pH sol (0-14)" value={form.phSol} onChange={set('phSol')} />
                    <textarea className="input col-span-2" placeholder="Notes" value={form.notesAgriculteur} onChange={set('notesAgriculteur')} />
                    <button className="btn-primary col-span-2" type="submit">Enregistrer</button>
                </form>
            )}

            <div className="space-y-3">
                {suivis.map((s) => (
                    <div key={s.id} className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
                        <div>
                            <p className="font-semibold">{s.plante?.nom}</p>
                            <p className="text-sm text-gray-500">Parcelle: {s.parcelle ?? '—'} · Stade: {s.stadeVegetatif ?? '—'}</p>
                            <p className="text-xs text-gray-400">💧 {s.BesoinsEau}L/j · pH {s.phSol ?? '—'}</p>
                        </div>
                        <span className="text-sm">{STATUTS[s.statut]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
