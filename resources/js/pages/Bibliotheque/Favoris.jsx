import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, BookmarkMinus } from 'lucide-react';
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
                    <h1 className="text-2xl font-extrabold text-white">Ma sélection</h1>
                    <p className="text-green-100 text-sm mt-1">{plantes.length} plante(s) sélectionnée(s)</p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 md:px-6 mt-6">
                {plantes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                        <Bookmark size={56} className="text-gray-300 dark:text-green-800 mb-4" />
                        <p className="font-semibold text-gray-600 dark:text-green-300">Votre sélection est vide.</p>
                        <p className="text-sm text-gray-400 dark:text-green-400 mt-1 mb-4">
                            Explorez la bibliothèque pour ajouter des plantes.
                        </p>
                        <Link to="/plantes"
                            className="bg-green-600 text-white text-sm font-medium px-5 py-2 rounded-xl hover:bg-green-700 transition">
                            Explorer la bibliothèque
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {plantes.map((p) => (
                            <div key={p.id} className="bg-white dark:bg-green-900 rounded-2xl shadow-sm border border-gray-100 dark:border-green-800 overflow-hidden hover:shadow-md transition">
                                {p.imageUrl && (
                                    <img src={p.imageUrl} alt={p.nom}
                                        className="w-full h-48 object-cover"
                                        onError={(e) => { e.target.style.display = 'none'; }} />
                                )}
                                <div className="p-4">
                                    <Link to={`/plantes/${p.id}`}
                                        className="font-bold text-gray-800 dark:text-white text-base hover:text-green-600 dark:hover:text-green-300 transition block">
                                        {p.nom}
                                    </Link>
                                    <p className="text-sm text-gray-500 dark:text-green-200/80 mt-0.5 italic">{p.espece}</p>
                                    {p.famille && <p className="text-xs text-gray-400 dark:text-green-400/70 mt-0.5">{p.famille}</p>}

                                    <div className="flex items-center justify-between mt-4">
                                        <Link to={`/suivi?plante_id=${p.id}`}
                                            className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition">
                                            + Démarrer cette culture
                                        </Link>
                                        <button onClick={() => retirer(p.id)}
                                            title="Retirer de la sélection"
                                            className="text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition">
                                            <BookmarkMinus size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
