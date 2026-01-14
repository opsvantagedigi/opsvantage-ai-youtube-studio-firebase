export function Header() {
  return (
    <header className="studio-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <img src="/brand-icon.png" alt="logo" style={{ width: 32, height: 32, borderRadius: 6 }} />
        <div style={{ fontWeight: 700 }}>AI-YouTube Studio</div>
      </div>
    </header>
  );
}
('use client');

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="w-full bg-black/30 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between">
      <h1 className="font-orbitron text-2xl brand-gradient">AI‑YouTube Studio</h1>

      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="p-2 rounded-lg hover:bg-white/10 transition"
      >
        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
    </header>
  );
}
