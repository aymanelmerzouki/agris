import React, { useState } from 'react';
import { Building2, Clock } from 'lucide-react';
import api from '../../api';

export default function PortailOuvrier({ statut, onDemandeSoumise }) {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const soumettre = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/onboarding/soumettre', { code: code.toUpperCase() });
            onDemandeSoumise();
        } catch (err) {
            setError(err.response?.data?.message || 'Code invalide.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm p-8 w-full max-w-md text-center">
                <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 size={32} className="text-emerald-600" />
                </div>

                {statut === 'en_attente' ? (
                    <>
                        <Clock size={24} className="text-amber-500 mx-auto mb-3" />
                        <h2 className="text-xl font-bold text-gray-800 dark:text-zinc-100 mb-2">Demande envoyée</h2>
                        <p className="text-sm text-gray-500 dark:text-zinc-400">En attente de l'approbation de votre gérant.</p>
                    </>
                ) : (
                    <>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-zinc-100 mb-2">Rejoindre une exploitation</h2>
                        <p className="text-sm text-gray-500 dark:text-zinc-400 mb-6">Saisissez le code d'exploitation fourni par votre gérant.</p>
                        <form onSubmit={soumettre} className="space-y-4">
                            <input
                                className="w-full text-center text-2xl font-black tracking-widest uppercase bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:focus:bg-zinc-950"
                                placeholder="AGR-X7K"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                maxLength={10}
                                required
                            />
                            {error && <p className="text-sm text-red-500">{error}</p>}
                            <button type="submit" disabled={loading}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50">
                                {loading ? 'Envoi...' : 'Envoyer la demande'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
