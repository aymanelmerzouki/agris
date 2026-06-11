import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, ShieldCheck, Building2, Mail, Lock } from 'lucide-react';
import api from '../../api';
import { useAuth } from '../../contexts/AuthContext';

const PRIX = 299;

export default function Abonnement() {
    const { user, refreshUser } = useAuth();
    const navigate = useNavigate();
    const [etape, setEtape] = useState('carte'); // 'carte' | 'otp'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [carte, setCarte] = useState({ titulaire: '', numero_carte: '', expiration: '', cvv: '' });
    const [code, setCode] = useState('');

    const formatNumero = (v) => v.replace(/\D/g, '').slice(0, 16);
    const formatExp = (v) => {
        const d = v.replace(/\D/g, '').slice(0, 4);
        return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
    };

    const envoyerCarte = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api.post('/abonnement/initier-paiement', carte);
            setEtape('otp');
        } catch (err) {
            const errs = err.response?.data?.errors;
            setError(errs ? Object.values(errs)[0][0] : (err.response?.data?.message || 'Erreur de validation.'));
        } finally {
            setLoading(false);
        }
    };

    const verifierOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api.post('/abonnement/verifier-otp', { code });
            await refreshUser();
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Code invalide ou expiré.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 px-4 py-10">
            <div className="w-full max-w-md">
                {/* Récapitulatif du plan */}
                <div className="bg-gradient-to-br from-emerald-600 to-green-700 rounded-2xl p-6 text-white shadow-lg mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <Building2 size={22} />
                        <h1 className="text-lg font-bold">Abonnement Entreprise</h1>
                    </div>
                    <p className="text-emerald-100 text-sm">
                        Bonjour {user?.name}, votre compte Entreprise{user?.nomEntreprise ? ` « ${user.nomEntreprise} »` : ''} donne accès
                        à la gestion d'équipe, aux tâches et au stock.
                    </p>
                    <div className="mt-4 flex items-end gap-2">
                        <span className="text-3xl font-black">{PRIX}</span>
                        <span className="text-emerald-100 mb-1">MAD / mois</span>
                    </div>
                    <p className="text-xs bg-white/20 inline-block px-2 py-1 rounded-full mt-2">🎁 Premier mois offert</p>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm p-6">
                    {error && <p className="text-red-500 text-sm mb-4 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>}

                    {etape === 'carte' ? (
                        <form onSubmit={envoyerCarte} className="space-y-4">
                            <div className="flex items-center gap-2 text-gray-700 dark:text-zinc-200 font-semibold">
                                <CreditCard size={18} /> Paiement par carte
                            </div>
                            <p className="text-xs text-gray-400 dark:text-zinc-500 flex items-center gap-1.5">
                                <ShieldCheck size={13} /> Paiement sécurisé — démonstration, aucun débit réel.
                            </p>

                            <input className="input" placeholder="Titulaire de la carte" value={carte.titulaire}
                                onChange={(e) => setCarte({ ...carte, titulaire: e.target.value })} required />
                            <input className="input" placeholder="Numéro de carte (16 chiffres)" inputMode="numeric"
                                value={carte.numero_carte}
                                onChange={(e) => setCarte({ ...carte, numero_carte: formatNumero(e.target.value) })} required />
                            <div className="flex gap-3">
                                <input className="input" placeholder="MM/AA" value={carte.expiration}
                                    onChange={(e) => setCarte({ ...carte, expiration: formatExp(e.target.value) })} required />
                                <input className="input" placeholder="CVV" inputMode="numeric"
                                    value={carte.cvv}
                                    onChange={(e) => setCarte({ ...carte, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })} required />
                            </div>

                            <button type="submit" disabled={loading}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2">
                                <Lock size={16} /> {loading ? 'Validation...' : 'Valider et recevoir le code'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={verifierOtp} className="space-y-4">
                            <div className="flex items-center gap-2 text-gray-700 dark:text-zinc-200 font-semibold">
                                <Mail size={18} /> Code de validation
                            </div>
                            <p className="text-xs text-gray-400 dark:text-zinc-500">
                                Un code à 6 chiffres a été envoyé à <strong>{user?.email}</strong>. Saisissez-le pour activer votre abonnement.
                            </p>
                            <input className="input text-center text-2xl font-black tracking-widest" inputMode="numeric"
                                placeholder="••••••" maxLength={6} value={code}
                                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} required />
                            <button type="submit" disabled={loading || code.length !== 6}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50">
                                {loading ? 'Vérification...' : 'Activer mon abonnement'}
                            </button>
                            <button type="button" onClick={() => { setEtape('carte'); setError(''); }}
                                className="w-full text-sm text-gray-400 hover:text-gray-600 transition">
                                ← Revenir au paiement
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
