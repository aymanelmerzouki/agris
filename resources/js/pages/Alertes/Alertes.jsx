import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, BellOff, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import api from '../../api';

const ICON_MAP = {
    warning: <AlertTriangle size={20} className="text-amber-500 shrink-0" />,
    check:   <CheckCircle  size={20} className="text-emerald-500 shrink-0" />,
    info:    <Info         size={20} className="text-blue-400 shrink-0" />,
};

const TYPE_LABEL = {
    agronomic:   'Agronomie',
    operational: 'Opérationnel',
};

export default function Alertes() {
    const [alertes, setAlertes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/alertes').then((r) => setAlertes(r.data.data));
    }, []);

    const marquerLues = async () => {
        await api.post('/alertes/marquer-lues');
        setAlertes((prev) => prev.map((a) => ({ ...a, read_at: new Date().toISOString() })));
    };

    return (
        <div className="min-h-screen pb-20 md:pb-8">
            <div className="bg-white border-b border-gray-200 dark:bg-zinc-950 dark:border-zinc-800 px-6 py-8">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-zinc-100 flex items-center gap-2">
                            <Bell size={24} /> Alertes
                        </h1>
                        <p className="text-gray-500 dark:text-zinc-400 text-sm mt-1">{alertes.length} alerte(s)</p>
                    </div>
                    <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:border dark:border-zinc-700 text-white dark:text-zinc-100 text-sm font-medium px-4 py-2 rounded-xl transition shadow-sm"
                        onClick={marquerLues}>
                        <CheckCheck size={18} /> Tout marquer lu
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 md:px-6 mt-6">
                {alertes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                        <div className="w-16 h-16 bg-gray-50 dark:bg-zinc-900 flex items-center justify-center rounded-full mb-4 text-gray-400">
                            <BellOff size={32} />
                        </div>
                        <p className="text-lg font-bold text-gray-800 dark:text-zinc-100">Aucune alerte pour le moment</p>
                        <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">Vous êtes à jour. Les nouvelles alertes apparaîtront ici.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {alertes.map((a) => {
                            const d = a.data ?? {};
                            const icon = ICON_MAP[d.icon] ?? ICON_MAP.info;
                            const typeLabel = TYPE_LABEL[d.type];
                            const isClickable = !!d.action_url;

                            return (
                                <div key={a.id}
                                    onClick={() => isClickable && navigate(d.action_url)}
                                    className={`rounded-2xl p-4 shadow-sm border flex gap-3 items-start
                                        ${a.read_at
                                            ? 'bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800'
                                            : 'bg-amber-50 dark:bg-zinc-800/60 border-amber-100 dark:border-zinc-700'}
                                        ${isClickable ? 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors' : ''}`}>
                                    <div className="mt-0.5">{icon}</div>
                                    <div className="flex-1 min-w-0">
                                        {typeLabel && (
                                            <p className="text-xs font-medium text-zinc-500 mb-1">{typeLabel}</p>
                                        )}
                                        <p className="text-sm font-medium text-gray-800 dark:text-zinc-100">
                                            {d.message ?? a.data?.message ?? '—'}
                                        </p>
                                        <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">
                                            {new Date(a.created_at).toLocaleDateString('fr-FR')}
                                        </p>
                                    </div>
                                    {!a.read_at && (
                                        <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
