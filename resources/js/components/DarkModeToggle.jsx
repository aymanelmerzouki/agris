import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function DarkModeToggle() {
    const [dark, setDark] = useState(() => {
        if (typeof window === 'undefined') return false;
        const saved = localStorage.getItem('theme');
        if (saved) return saved === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        if (dark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [dark]);

    return (
        <button onClick={() => setDark(!dark)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-emerald-900 text-gray-600 dark:text-emerald-400 transition-colors">
            {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
}
