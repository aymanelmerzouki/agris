import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

export default function Favoris() {
    const [plantes, setPlantes] = useState([]);

    useEffect(() => {
        api.get('/favoris').then((r) => setPlantes(r.data.data));
    }, []);

    const retirer = async (id) => {
        await api.post(`/plantes/${id}/favori`);
        setPlantes((prev) => prev.filter((p) => p.id !== id));
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-green-700 mb-4">❤️ Mes favoris</h1>
            {plantes.length === 0 && <p className="text-gray-500">Aucune plante en favori.</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {plantes.map((p) => (
                    <div key={p.id} className="bg-white rounded-xl shadow p-4">
                        <Link to={`/plantes/${p.id}`} className="font-semibold text-lg hover:text-green-700">{p.nom}</Link>
                        <p className="text-sm text-gray-500">{p.espece}</p>
                        <button onClick={() => retirer(p.id)} className="mt-2 text-xs text-red-400 hover:text-red-600">
                            Retirer des favoris
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
