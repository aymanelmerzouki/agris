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
        <div className="min-h-screen bg-gray-50 dark:bg-green-950 p-6 max-w-xl mx-auto">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-green-700">🔔 Alertes arrosage</h1>
                <button className="btn-secondary text-sm" onClick={marquerLues}>Tout marquer lu</button>
            </div>
            {alertes.length === 0 && <p className="text-gray-400">Aucune alerte pour le moment.</p>}
            <div className="space-y-3">
                {alertes.map((a) => (
                    <div key={a.id} className={`rounded-xl p-4 shadow ${a.read_at ? 'bg-white' : 'bg-blue-50 border border-blue-200'}`}>
                        <p className="font-medium">💧 {a.data?.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(a.created_at).toLocaleDateString('fr-FR')}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
