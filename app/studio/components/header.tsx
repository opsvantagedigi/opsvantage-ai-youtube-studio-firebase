'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header
      className="w-full bg-black/30 backdrop-blur-xl border-b border-white/10"
      style={{ height: 84 }}
    >
      <div className="max-w-6xl mx-auto h-full flex items-center justify-between px-6">
        <div className="animate-fadeUp">
          <h1 className="text-2xl font-orbitron gradient-heading">Dashboard</h1>
          <p className="text-white/80 text-sm">Your creative control center</p>
        </div>

        <div className="text-sm text-white/80">
          <span className="mr-2">Powered by</span>
          <span className="font-orbitron gradient-heading">OpsVantage Digital</span>
        </div>

        <div>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg hover:bg-white/10 transition"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
