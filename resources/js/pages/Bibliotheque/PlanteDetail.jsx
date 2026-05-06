import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Bookmark, BookmarkCheck, Play } from 'lucide-react';
import api from '../../api';

export default function PlanteDetail() {
    const { id } = useParams();
    const [plante, setPlante] = useState(null);
    const [favori, setFavori] = useState(false);

    useEffect(() => {
        api.get(`/plantes/${id}`).then((r) => {
            setPlante(r.data);
            setFavori(r.data.favori ?? false);
        });
    }, [id]);

    const toggleFavori = async () => {
        const { data } = await api.post(`/plantes/${id}/favori`);
        setFavori(data.favori);
    };

    if (!plante) return <div className="min-h-screen p-6">Chargement...</div>;

    return (
        <div className="min-h-screen pb-8">
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 dark:from-zinc-800 dark:to-zinc-800 dark:border-b dark:border-zinc-700 px-6 py-8">
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-white">{plante.nom}</h1>
                        <p className="text-green-100 italic mt-1">
                            Espèce : {plante.espece} | Famille : {plante.famille}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to={`/suivi?plante_id=${plante.id}`}
                            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-4 py-2 rounded-xl transition">
                            <Play size={18} /> Démarrer cette culture
                        </Link>
                        <button
                            onClick={toggleFavori}
                            title={favori ? 'Retirer de ma sélection' : 'Ajouter à ma sélection'}
                            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-4 py-2 rounded-xl transition"
                        >
                            {favori
                                ? <BookmarkCheck size={18} className="text-white" />
                                : <Bookmark size={18} className="text-white" />
                            }
                            {favori ? 'Sélectionnée' : 'Ajouter à ma sélection'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 md:px-6 mt-6 space-y-4">
                {plante.imageUrl && (
                    <img src={plante.imageUrl} alt={plante.nom}
                        className="w-full h-56 object-cover rounded-2xl shadow"
                        onError={(e) => { e.target.style.display = 'none'; }} />
                )}

                <div className="grid grid-cols-2 gap-3 text-sm">
                    <Info label="Origine" value={plante.origine} />
                    <Info label="Saison" value={plante.saisonPlantation} />
                    <Info label="Température" value={`${plante.temperatureMin}°C – ${plante.temperatureMax}°C`} />
                    <Info label="Durée pousse" value={`${plante.dureePousseeJours} jours`} />
                    <Info label="Rendement" value={`${plante.rendementMoyenKgHa} kg/ha`} />
                    <Info label="Irrigation" value={plante.type_irrigation_formate} />
                    <Info label="Bio" value={plante.estBio ? 'Oui' : 'Non'} />
                </div>

                {plante.description && (
                    <div className="bg-white dark:bg-zinc-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-zinc-700">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Description</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{plante.description}</p>
                    </div>
                )}

                {plante.conditionsCulture && (
                    <div className="bg-white dark:bg-zinc-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-zinc-700">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Conditions de culture</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{plante.conditionsCulture}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function Info({ label, value }) {
    return (
        <div className="bg-white dark:bg-zinc-800 rounded-xl p-3 shadow-sm border border-gray-100 dark:border-zinc-700">
            <span className="text-gray-400 dark:text-gray-400 text-xs">{label}</span>
            <p className="font-semibold text-gray-800 dark:text-gray-100 mt-0.5">{value ?? '—'}</p>
        </div>
    );
}
