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
        <div className="min-h-screen bg-gray-50 dark:bg-green-950 pb-20 md:pb-8">
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-8">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-2xl font-extrabold text-white">Mes favoris</h1>
                    <p className="text-green-100 text-sm mt-1">{plantes.length} plante(s) en favori</p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 md:px-6 mt-6">
                {plantes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center text-gray-400 dark:text-green-300">
                        <p className="text-4xl mb-3">❤️</p>
                        <p className="font-medium">Aucune plante en favori</p>
                        <p className="text-sm mt-1 opacity-70">Explorez la bibliothèque pour en ajouter</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {plantes.map((p) => (
                            <div key={p.id} className="bg-white dark:bg-green-900 rounded-2xl shadow-sm border border-gray-100 dark:border-green-800 p-4 hover:shadow-md transition">
                                <Link to={`/plantes/${p.id}`} className="font-bold text-gray-800 dark:text-white text-base hover:text-green-600 dark:hover:text-green-300 transition block">
                                    {p.nom}
                                </Link>
                                <p className="text-sm text-gray-500 dark:text-green-200/80 mt-0.5">{p.espece}</p>
                                {p.famille && <p className="text-xs text-gray-400 dark:text-green-400/70 mt-0.5">{p.famille}</p>}
                                <button onClick={() => retirer(p.id)} className="mt-3 text-xs text-red-400 dark:text-red-400/80 hover:text-red-600 transition">
                                    Retirer des favoris
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
