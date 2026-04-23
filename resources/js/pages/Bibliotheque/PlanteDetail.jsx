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
        <div className="min-h-screen bg-gray-50 dark:bg-green-950 p-6 max-w-2xl mx-auto">
            {plante.imageUrl && <img src={plante.imageUrl} alt={plante.nom} className="w-full h-56 object-cover rounded-xl mb-4" />}
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold text-green-700">{plante.nom}</h1>
                <button onClick={toggleFavori} className="text-2xl" title="Ajouter aux favoris">
                    {favori ? '❤️' : '🤍'}
                </button>
            </div>
            <p className="text-gray-500 italic mb-4">{plante.espece} · {plante.famille}</p>
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <Info label="Origine" value={plante.origine} />
                <Info label="Saison" value={plante.saisonPlantation} />
                <Info label="Température" value={`${plante.temperatureMin}°C – ${plante.temperatureMax}°C`} />
                <Info label="Durée pousse" value={`${plante.dureePousseeJours} jours`} />
                <Info label="Rendement" value={`${plante.rendementMoyenKgHa} kg/ha`} />
                <Info label="Irrigation" value={plante.typeIrrigation} />
                <Info label="Bio" value={plante.estBio ? 'Oui' : 'Non'} />
            </div>
            {plante.description && <p className="text-gray-700 mb-3">{plante.description}</p>}
            {plante.conditionsCulture && (
                <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-semibold mb-1">Conditions de culture</h3>
                    <p className="text-sm text-gray-700">{plante.conditionsCulture}</p>
                </div>
            )}
        </div>
    );
}

function Info({ label, value }) {
    return (
        <div className="bg-gray-50 rounded p-2">
            <span className="text-gray-400 text-xs">{label}</span>
            <p className="font-medium">{value ?? '—'}</p>
        </div>
    );
}
