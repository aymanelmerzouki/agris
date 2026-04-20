import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '', role: 'agriculteur', nomEntreprise: '' });
    const [error, setError] = useState('');

    const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(form);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de l\'inscription.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-green-50">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow w-full max-w-sm space-y-4">
                <h1 className="text-2xl font-bold text-green-700 text-center">Créer un compte</h1>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <input className="input" placeholder="Nom complet" value={form.name} onChange={set('name')} required />
                <input className="input" type="email" placeholder="Email" value={form.email} onChange={set('email')} required />
                <input className="input" type="password" placeholder="Mot de passe" value={form.password} onChange={set('password')} required />
                <input className="input" type="password" placeholder="Confirmer le mot de passe" value={form.password_confirmation} onChange={set('password_confirmation')} required />
                <select className="input" value={form.role} onChange={set('role')}>
                    <option value="agriculteur">Agriculteur</option>
                    <option value="manager">Manager</option>
                    <option value="ouvrier">Ouvrier</option>
                </select>
                {form.role === 'manager' && (
                    <input className="input" placeholder="Nom de l'entreprise" value={form.nomEntreprise} onChange={set('nomEntreprise')} />
                )}
                <button className="btn-primary w-full" type="submit">S'inscrire</button>
                <p className="text-center text-sm">Déjà un compte ? <Link to="/login" className="text-green-600">Se connecter</Link></p>
            </form>
        </div>
    );
}
