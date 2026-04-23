import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(form.email, form.password);
            navigate('/');
        } catch {
            setError('Email ou mot de passe incorrect.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-green-50">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow w-full max-w-sm space-y-4">
                <h1 className="text-2xl font-bold text-green-700 text-center">🌱 Agris</h1>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <input
                    className="w-full border border-green-200 rounded-lg px-3 py-2 text-sm bg-green-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                    type="email" placeholder="Email" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                <input
                    className="w-full border border-green-200 rounded-lg px-3 py-2 text-sm bg-green-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                    type="password" placeholder="Mot de passe" value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                <button className="btn-primary w-full" type="submit">Se connecter</button>
                <p className="text-center text-sm text-gray-600">Pas de compte ? <Link to="/register" className="text-green-600 font-medium">S'inscrire</Link></p>
            </form>
        </div>
    );
}
