import { Link } from 'react-router-dom';

const features = [
    { icon: '📚', title: 'Bibliothèque agricole', desc: 'Accédez à une base de données complète de plantes marocaines avec toutes leurs caractéristiques.' },
    { icon: '💧', title: 'Alertes arrosage', desc: 'Recevez chaque matin la quantité exacte d\'eau nécessaire pour chaque culture.' },
    { icon: '🌿', title: 'Suivi des cultures', desc: 'Suivez le stade végétatif, le pH du sol et la progression de vos plantes en temps réel.' },
    { icon: '🛒', title: 'Marketplace', desc: 'Achetez et vendez vos récoltes directement entre agriculteurs en dirhams marocains.' },
    { icon: '📋', title: 'Gestion d\'équipe', desc: 'Assignez des tâches à vos ouvriers et suivez leur avancement en temps réel.' },
    { icon: '📦', title: 'Gestion des stocks', desc: 'Gérez vos stocks de produits agricoles et anticipez vos besoins.' },
];

const stats = [
    { value: '12+', label: 'Plantes marocaines' },
    { value: '100%', label: 'Données réelles' },
    { value: '3', label: 'Rôles utilisateurs' },
    { value: '24/7', label: 'Alertes automatiques' },
];

export default function Landing() {
    return (
        <div className="min-h-screen bg-white">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">🌱</span>
                    <span className="text-xl font-bold text-green-700">Agris</span>
                </div>
                <div className="flex gap-3">
                    <Link to="/login" className="px-4 py-2 text-sm text-green-700 font-medium hover:bg-green-50 rounded-lg transition">
                        Connexion
                    </Link>
                    <Link to="/register" className="px-4 py-2 text-sm bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition">
                        Commencer
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative pt-24 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-white" />
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-10"
                    style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div className="relative max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                            🇲🇦 Conçu pour l'agriculture marocaine
                        </span>
                        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-6">
                            Gérez vos cultures<br />
                            <span className="text-green-600">intelligemment</span>
                        </h1>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            Agris accompagne les agriculteurs et entreprises agricoles du Maroc avec des outils modernes : suivi des plantes, alertes arrosage, marketplace et gestion d'équipe.
                        </p>
                        <div className="flex gap-4">
                            <Link to="/register" className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition shadow-lg shadow-green-200">
                                Créer un compte gratuit
                            </Link>
                            <Link to="/login" className="px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition">
                                Se connecter →
                            </Link>
                        </div>
                    </div>
                    <div className="hidden lg:grid grid-cols-2 gap-4">
                        <img src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400" alt="Agriculture" className="rounded-2xl shadow-xl object-cover h-56 w-full" />
                        <img src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400" alt="Champ" className="rounded-2xl shadow-xl object-cover h-56 w-full mt-8" />
                        <img src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400" alt="Blé" className="rounded-2xl shadow-xl object-cover h-56 w-full -mt-4" />
                        <img src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400" alt="Safran" className="rounded-2xl shadow-xl object-cover h-56 w-full mt-4" />
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="bg-green-700 py-12">
                <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
                    {stats.map((s) => (
                        <div key={s.label}>
                            <p className="text-4xl font-extrabold">{s.value}</p>
                            <p className="text-green-200 text-sm mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section className="py-20 max-w-6xl mx-auto px-6">
                <div className="text-center mb-14">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">Tout ce dont vous avez besoin</h2>
                    <p className="text-gray-500 max-w-xl mx-auto">Une plateforme complète pour les agriculteurs indépendants et les entreprises agricoles marocaines.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((f) => (
                        <div key={f.title} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition group">
                            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-green-100 transition">
                                {f.icon}
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Plantes showcase */}
            <section className="bg-gray-50 py-20">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">Plantes marocaines référencées</h2>
                        <p className="text-gray-500">Des données réelles pour chaque culture</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { nom: 'Safran', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300', tag: 'Taliouine' },
                            { nom: 'Arganier', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300', tag: 'Endémique' },
                            { nom: 'Dattier', img: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=300', tag: 'Drâa-Tafilalet' },
                            { nom: 'Clémentine', img: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=300', tag: 'Souss' },
                        ].map((p) => (
                            <div key={p.nom} className="relative rounded-2xl overflow-hidden shadow group cursor-pointer">
                                <img src={p.img} alt={p.nom} className="w-full h-40 object-cover group-hover:scale-105 transition duration-300" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-3 left-3 text-white">
                                    <p className="font-semibold">{p.nom}</p>
                                    <p className="text-xs text-green-300">{p.tag}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-center">
                <h2 className="text-3xl font-bold mb-4">Prêt à moderniser votre exploitation ?</h2>
                <p className="text-green-100 mb-8 max-w-md mx-auto">Rejoignez les agriculteurs marocains qui utilisent Agris pour optimiser leurs cultures.</p>
                <Link to="/register" className="inline-block px-8 py-4 bg-white text-green-700 font-bold rounded-xl hover:bg-green-50 transition shadow-xl">
                    Commencer gratuitement →
                </Link>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm">
                <p>🌱 Agris — Plateforme agricole marocaine · {new Date().getFullYear()}</p>
            </footer>
        </div>
    );
}
