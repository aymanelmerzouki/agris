import React, { useEffect } from 'react';
import { Hourglass, CheckCircle2 } from 'lucide-react';
import api from '../../api';

export default function WaitingApproval({ onApproved }) {
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const { data } = await api.get('/me');
                if (data.statut_emploi === 'actif') {
                    clearInterval(interval);
                    onApproved();
                }
            } catch {}
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Hourglass size={36} className="text-amber-400 animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold text-zinc-100 mb-3">Demande envoyée</h2>
                <p className="text-zinc-400 text-sm leading-relaxed">
                    Votre gérant doit valider votre accès pour débloquer les outils.<br />
                    Cette page se met à jour automatiquement.
                </p>
                <div className="mt-8 flex items-center justify-center gap-2 text-xs text-zinc-600">
                    <CheckCircle2 size={14} /> Vérification toutes les 30 secondes
                </div>
            </div>
        </div>
    );
}
