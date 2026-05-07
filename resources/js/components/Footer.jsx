import React from 'react';

export default function Footer() {
    return (
        <footer className="w-full bg-white dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-800 py-8 mt-auto">
            <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <p className="text-emerald-500 font-bold text-lg">AGRIS</p>
                    <p className="text-sm text-gray-500 dark:text-zinc-400 mt-2">Plateforme SaaS de gestion agricole et marketplace B2B.</p>
                </div>
                <div>
                    <p className="font-semibold text-gray-800 dark:text-zinc-100 mb-3">L'Équipe</p>
                    <ul className="space-y-1 text-sm">
                        <li><a href="mailto:ayman@agris.ma" className="text-gray-500 dark:text-zinc-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">Ayman</a></li>
                        <li><a href="mailto:yahya@agris.ma" className="text-gray-500 dark:text-zinc-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">Yahya</a></li>
                    </ul>
                </div>
                <div>
                    <p className="font-semibold text-gray-800 dark:text-zinc-100 mb-3">Laboratoire / Siège</p>
                    <p className="text-sm text-gray-500 dark:text-zinc-400">ENSIAS, Rabat</p>
                </div>
            </div>
            <div className="max-w-5xl mx-auto px-6 border-t border-gray-100 dark:border-zinc-800 mt-8 pt-4">
                <p className="text-xs text-zinc-500 text-center">© 2026 AGRIS. Tous droits réservés.</p>
            </div>
        </footer>
    );
}
