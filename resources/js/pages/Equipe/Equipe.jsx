import React, { useEffect, useState } from 'react';
import { Copy, Check, Users, UserCheck, UserX } from 'lucide-react';
import api from '../../api';

export default function Equipe() {
    const [code, setCode] = useState('');
    const [demandes, setDemandes] = useState([]);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        api.get('/equipe/code').then((r) => setCode(r.data.code));
        api.get('/equipe/demandes').then((r) => setDemandes(r.data));
    }, []);

    const copier = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const accepter = async (id) => {
        await api.post(`/equipe/${id}/accepter`);
        setDemandes((prev) => prev.filter((d) => d.id !== id));
    };

    const refuser = async (id) => {
        await api.post(`/equipe/${id}/refuser`);
        setDemandes((prev) => prev.filter((d) => d.id !== id));
    };

    return (
        <div className="min-h-screen pb-20 md:pb-8">
            <div className="bg-white border-b border-gray-200 dark:bg-zinc-950 dark:border-zinc-800 px-6 py-8 mb-6">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-2">
                        <Users size={24} className="text-emerald-500" /> Mon Équipe
                    </h1>
                    <p className="text-gray-500 dark:text-zinc-400 text-sm mt-1">Gérez vos ouvriers et les demandes d'intégration</p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 md:px-6 mt-6 space-y-6">
                {/* Code d'exploitation */}
                <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Code d'exploitation</p>
                    <div className="flex items-center gap-3">
                        <span className="text-3xl font-black text-emerald-600 tracking-widest">{code || '------'}</span>
                        <button onClick={copier}
                            className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-lg text-sm font-medium transition">
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                            {copied ? 'Copié !' : 'Copier'}
                        </button>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-zinc-500 mt-2">Partagez ce code à vos ouvriers pour qu'ils rejoignent votre exploitation.</p>
                </div>

                {/* Demandes en attente */}
                <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">
                        Demandes en attente <span className="ml-2 bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full text-xs">{demandes.length}</span>
                    </p>
                    {demandes.length === 0 ? (
                        <p className="text-sm text-gray-400 dark:text-zinc-500 text-center py-6">Aucune demande en attente.</p>
                    ) : (
                        <div className="space-y-3">
                            {demandes.map((d) => (
                                <div key={d.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl">
                                    <div>
                                        <p className="font-semibold text-gray-800 dark:text-zinc-100 text-sm">{d.name}</p>
                                        <p className="text-xs text-gray-400 dark:text-zinc-500">{d.email}{d.poste ? ` · ${d.poste}` : ''}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => accepter(d.id)}
                                            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition">
                                            <UserCheck size={14} /> Accepter
                                        </button>
                                        <button onClick={() => refuser(d.id)}
                                            className="flex items-center gap-1.5 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 text-red-600 dark:text-red-400 text-xs font-semibold px-3 py-1.5 rounded-lg transition">
                                            <UserX size={14} /> Refuser
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
