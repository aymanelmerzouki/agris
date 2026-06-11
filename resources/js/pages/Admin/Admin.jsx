import React, { useEffect, useState } from 'react';
import { Users, ShieldCheck, CreditCard, Trash2, Search, TrendingUp } from 'lucide-react';
import api from '../../api';

const ROLES = ['agriculteur', 'manager', 'ouvrier', 'admin'];
const ROLE_COLORS = {
    agriculteur: 'bg-emerald-100 text-emerald-700',
    manager: 'bg-blue-100 text-blue-700',
    ouvrier: 'bg-amber-100 text-amber-700',
    admin: 'bg-purple-100 text-purple-700',
};
const STATUT_ABO_COLORS = {
    actif: 'bg-emerald-100 text-emerald-700',
    expire: 'bg-gray-100 text-gray-500',
    suspendu: 'bg-red-100 text-red-600',
};

function StatCard({ icon: Icon, label, value, gradient }) {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow ${gradient}`}>
                <Icon size={22} className="text-white" />
            </div>
            <div>
                <p className="text-2xl font-extrabold text-gray-900 dark:text-zinc-100">{value}</p>
                <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">{label}</p>
            </div>
        </div>
    );
}

export default function Admin() {
    const [stats, setStats] = useState(null);
    const [tab, setTab] = useState('utilisateurs');
    const [users, setUsers] = useState([]);
    const [abonnements, setAbonnements] = useState([]);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [toast, setToast] = useState('');

    const notify = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

    useEffect(() => {
        api.get('/admin/stats').then((r) => setStats(r.data)).catch(() => {});
    }, []);

    useEffect(() => {
        if (tab === 'utilisateurs') {
            api.get('/admin/utilisateurs', { params: { search, role: roleFilter } })
                .then((r) => setUsers(r.data.data ?? []));
        } else {
            api.get('/admin/abonnements').then((r) => setAbonnements(r.data.data ?? []));
        }
    }, [tab, search, roleFilter]);

    const changerRole = async (user, role) => {
        try {
            await api.patch(`/admin/utilisateurs/${user.id}/role`, { role });
            setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, role } : u)));
            notify('Rôle mis à jour.');
        } catch (err) {
            notify('❌ ' + (err.response?.data?.message || 'Erreur.'));
        }
    };

    const supprimerUser = async (id) => {
        if (!confirm('Supprimer définitivement cet utilisateur ?')) return;
        try {
            await api.delete(`/admin/utilisateurs/${id}`);
            setUsers((prev) => prev.filter((u) => u.id !== id));
            notify('Utilisateur supprimé.');
        } catch (err) {
            notify('❌ ' + (err.response?.data?.message || 'Erreur.'));
        }
    };

    const modifierAbo = async (abo, champ, valeur) => {
        try {
            const { data } = await api.patch(`/admin/abonnements/${abo.id}`, { [champ]: valeur });
            setAbonnements((prev) => prev.map((a) => (a.id === abo.id ? { ...a, ...data } : a)));
            notify('Abonnement mis à jour.');
        } catch {
            notify('❌ Erreur lors de la mise à jour.');
        }
    };

    return (
        <div className="min-h-screen pb-20 md:pb-8">
            {toast && (
                <div className="fixed top-4 right-4 z-50 bg-purple-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">
                    {toast}
                </div>
            )}

            <div className="bg-gradient-to-r from-purple-700 to-indigo-600 dark:from-zinc-800 dark:to-zinc-800 dark:border-b dark:border-zinc-800 px-6 py-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-2xl font-extrabold text-white flex items-center gap-3">
                        <ShieldCheck size={28} /> Administration
                    </h1>
                    <p className="text-purple-100 text-sm mt-1">Gestion des comptes utilisateurs et des abonnements</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 md:px-6 mt-6 space-y-6">
                {/* Statistiques */}
                {stats && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard icon={Users} label="Utilisateurs" value={stats.total_utilisateurs}
                            gradient="bg-gradient-to-br from-emerald-400 to-green-600" />
                        <StatCard icon={CreditCard} label="Abonnements actifs" value={stats.abonnements_actifs}
                            gradient="bg-gradient-to-br from-blue-400 to-blue-600" />
                        <StatCard icon={TrendingUp} label="Revenu total (MAD)" value={stats.revenu_total}
                            gradient="bg-gradient-to-br from-purple-400 to-indigo-600" />
                        <StatCard icon={ShieldCheck} label="Managers"
                            value={stats.repartition_roles?.manager ?? 0}
                            gradient="bg-gradient-to-br from-amber-400 to-orange-500" />
                    </div>
                )}

                {/* Onglets */}
                <div className="flex gap-6 border-b border-gray-200 dark:border-zinc-800">
                    {[
                        { key: 'utilisateurs', label: 'Utilisateurs' },
                        { key: 'abonnements', label: 'Abonnements' },
                    ].map(({ key, label }) => (
                        <button key={key} onClick={() => setTab(key)}
                            className={tab === key
                                ? 'pb-3 text-sm font-bold text-purple-600 border-b-2 border-purple-600'
                                : 'pb-3 text-sm font-medium text-gray-500 dark:text-zinc-400 hover:text-gray-700'}>
                            {label}
                        </button>
                    ))}
                </div>

                {tab === 'utilisateurs' ? (
                    <>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input value={search} onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Rechercher par nom ou email..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-500/30" />
                            </div>
                            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
                                className="px-4 py-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm outline-none">
                                <option value="">Tous les rôles</option>
                                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>

                        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-gray-400 border-b border-gray-100 dark:border-zinc-800">
                                        <th className="p-4 font-semibold">Nom</th>
                                        <th className="p-4 font-semibold">Email</th>
                                        <th className="p-4 font-semibold">Rôle</th>
                                        <th className="p-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u) => (
                                        <tr key={u.id} className="border-b border-gray-50 dark:border-zinc-800/50">
                                            <td className="p-4 font-medium text-gray-800 dark:text-zinc-100">{u.name}</td>
                                            <td className="p-4 text-gray-500 dark:text-zinc-400">{u.email}</td>
                                            <td className="p-4">
                                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${ROLE_COLORS[u.role]}`}>{u.role}</span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <select value={u.role} onChange={(e) => changerRole(u, e.target.value)}
                                                        className="text-xs px-2 py-1.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg outline-none">
                                                        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                                                    </select>
                                                    <button onClick={() => supprimerUser(u.id)}
                                                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {users.length === 0 && (
                                        <tr><td colSpan={4} className="p-8 text-center text-gray-400">Aucun utilisateur trouvé.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-gray-400 border-b border-gray-100 dark:border-zinc-800">
                                    <th className="p-4 font-semibold">Utilisateur</th>
                                    <th className="p-4 font-semibold">Plan</th>
                                    <th className="p-4 font-semibold">Statut</th>
                                    <th className="p-4 font-semibold">Prix (MAD)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {abonnements.map((a) => (
                                    <tr key={a.id} className="border-b border-gray-50 dark:border-zinc-800/50">
                                        <td className="p-4">
                                            <p className="font-medium text-gray-800 dark:text-zinc-100">{a.user?.name}</p>
                                            <p className="text-xs text-gray-400">{a.user?.email}</p>
                                        </td>
                                        <td className="p-4">
                                            <select value={a.plan} onChange={(e) => modifierAbo(a, 'plan', e.target.value)}
                                                className="text-xs px-2 py-1.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg outline-none">
                                                {['gratuit', 'basic', 'pro', 'entreprise'].map((p) => <option key={p} value={p}>{p}</option>)}
                                            </select>
                                        </td>
                                        <td className="p-4">
                                            <select value={a.statut} onChange={(e) => modifierAbo(a, 'statut', e.target.value)}
                                                className={`text-xs px-2 py-1 rounded-full font-medium border-0 ${STATUT_ABO_COLORS[a.statut]}`}>
                                                {['actif', 'expire', 'suspendu'].map((s) => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </td>
                                        <td className="p-4 font-semibold text-gray-700 dark:text-zinc-300">{a.prix}</td>
                                    </tr>
                                ))}
                                {abonnements.length === 0 && (
                                    <tr><td colSpan={4} className="p-8 text-center text-gray-400">Aucun abonnement.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
