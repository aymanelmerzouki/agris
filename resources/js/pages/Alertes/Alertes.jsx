import { useEffect, useState } from 'react';
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
        <div className="min-h-screen bg-gray-50 dark:bg-green-950 pb-20 md:pb-8">
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-8">
                <div className="max-w-xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold text-white">Alertes arrosage</h1>
                        <p className="text-green-100 text-sm mt-1">{alertes.length} alerte(s)</p>
                    </div>
                    <button className="bg-white/20 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/30 transition" onClick={marquerLues}>
                        Tout marquer lu
                    </button>
                </div>
            </div>

            <div className="max-w-xl mx-auto px-4 md:px-6 mt-6">
                {alertes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center text-gray-400 dark:text-green-300">
                        <p className="text-4xl mb-3">🔔</p>
                        <p className="font-medium">Aucune alerte pour le moment</p>
                        <p className="text-sm mt-1 opacity-70">Les alertes d'arrosage apparaîtront ici</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {alertes.map((a) => (
                            <div key={a.id} className={`rounded-2xl p-4 shadow-sm border ${a.read_at ? 'bg-white dark:bg-green-900 border-gray-100 dark:border-green-800' : 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700'}`}>
                                <p className="font-medium text-gray-800 dark:text-white">💧 {a.data?.message}</p>
                                <p className="text-xs text-gray-400 dark:text-green-400 mt-1">{new Date(a.created_at).toLocaleDateString('fr-FR')}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
