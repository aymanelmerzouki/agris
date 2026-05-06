import React, { useEffect, useState } from 'react';

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
            className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-green-800 flex items-center justify-center text-lg hover:bg-gray-200 dark:hover:bg-green-800 transition">
            {dark ? '🌙' : '☀️'}
        </button>
    );
}
