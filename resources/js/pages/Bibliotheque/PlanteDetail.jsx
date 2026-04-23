import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api';

export default function PlanteDetail() {
    const { id } = useParams();
    const [plante, setPlante] = useState(null);
    const [favori, setFavori] = useState(false);

    useEffect(() => {
        api.get(`/plantes/${id}`).then((r) => setPlante(r.data));
    }, [id]);

    const toggleFavori = async () => {
        const { data } = await api.post(`/plantes/${id}/favori`);
        setFavori(data.favori);
    };

    if (!plante) return <div className="min-h-screen bg-gray-50 dark:bg-green-950 p-6">Chargement...</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-green-950 pb-8">
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-8">
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-white">{plante.nom}</h1>
                        <p className="text-green-100 italic mt-1">{plante.espece} · {plante.famille}</p>
                    </div>
                    <button onClick={toggleFavori} className="text-3xl" title="Ajouter aux favoris">
                        {favori ? '❤️' : '🤍'}
                    </button>
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
                    <Info label="Irrigation" value={plante.typeIrrigation} />
                    <Info label="Bio" value={plante.estBio ? 'Oui' : 'Non'} />
                </div>

                {plante.description && (
                    <div className="bg-white dark:bg-green-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-green-800">
                        <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Description</h3>
                        <p className="text-sm text-gray-600 dark:text-green-100">{plante.description}</p>
                    </div>
                )}

                {plante.conditionsCulture && (
                    <div className="bg-white dark:bg-green-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-green-800">
                        <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Conditions de culture</h3>
                        <p className="text-sm text-gray-600 dark:text-green-100">{plante.conditionsCulture}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function Info({ label, value }) {
    return (
        <div className="bg-white dark:bg-green-900 rounded-xl p-3 shadow-sm border border-gray-100 dark:border-green-800">
            <span className="text-gray-400 dark:text-green-400 text-xs">{label}</span>
            <p className="font-semibold text-gray-800 dark:text-white mt-0.5">{value ?? '—'}</p>
        </div>
    );
}
