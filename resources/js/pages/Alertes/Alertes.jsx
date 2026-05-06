import React, { useEffect, useState } from 'react';
import { Bell, CheckCheck, BellOff } from 'lucide-react';
import api from '../../api';

export default function Alertes() {
    const [alertes, setAlertes] = useState([]);

    useEffect(() => {
        api.get('/alertes').then((r) => setAlertes(r.data.data));
    }, []);

    const marquerLues = async () => {
        await api.post('/alertes/marquer-lues');
        setAlertes((prev) => prev.map((a) => ({ ...a, read_at: new Date().toISOString() })));
    };

    return (
        <div className="min-h-screen pb-20 md:pb-8">
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 dark:from-zinc-800 dark:to-zinc-800 dark:border-b dark:border-emerald-800 px-6 py-8">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                            <Bell size={24} /> Alertes
                        </h1>
                        <p className="text-green-100 text-sm mt-1">{alertes.length} alerte(s)</p>
                    </div>
                    <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-4 py-2 rounded-xl transition shadow-sm"
                        onClick={marquerLues}>
                        <CheckCheck size={18} /> Tout marquer lu
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 md:px-6 mt-6">
                {alertes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                        <div className="w-16 h-16 bg-gray-50 flex items-center justify-center rounded-full mb-4 text-gray-400">
                            <BellOff size={32} />
                        </div>
                        <p className="text-lg font-bold text-gray-800 dark:text-emerald-100 dark:text-emerald-100">Aucune alerte pour le moment</p>
                        <p className="text-sm text-gray-500 dark:text-emerald-300 mt-1">Vous êtes à jour. Les nouvelles alertes apparaîtront ici.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {alertes.map((a) => (
                            <div key={a.id} className={`rounded-2xl p-4 shadow-sm border ${a.read_at ? 'bg-white dark:bg-emerald-900 border-gray-100 dark:border-emerald-800' : 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700'}`}>
                                <p className="font-medium text-gray-800 dark:text-emerald-100">{a.data?.message}</p>
                                <p className="text-xs text-gray-400 dark:text-emerald-300 mt-1">{new Date(a.created_at).toLocaleDateString('fr-FR')}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
