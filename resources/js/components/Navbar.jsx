import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="bg-green-700 text-white px-6 py-3 flex items-center justify-between">
            <Link to="/" className="text-xl font-bold">🌱 Agris</Link>
            <div className="flex gap-4 items-center text-sm">
                <Link to="/plantes">Bibliothèque</Link>
                <Link to="/favoris">Favoris</Link>
                {['agriculteur', 'manager'].includes(user?.role) && (
                    <>
                        <Link to="/suivi">Mes cultures</Link>
                        <Link to="/stocks">Stocks</Link>
                    </>
                )}
                <Link to="/offres">Offres</Link>
                {['manager', 'ouvrier'].includes(user?.role) && (
                    <Link to="/todo-lists">Todo Lists</Link>
                )}
                <Link to="/alertes">🔔</Link>
                <button onClick={handleLogout} className="bg-green-900 px-3 py-1 rounded">
                    Déconnexion
                </button>
            </div>
        </nav>
    );
}
