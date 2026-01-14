'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header
      className="w-full bg-black/30 backdrop-blur-xl border-b border-white/10 px-6"
      style={{ height: 64 }}
    >
      <div style={{ position: 'relative', maxWidth: 1100, margin: '0 auto', height: '100%' }}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <h1 className="font-orbitron text-2xl brand-gradient">AI‑YouTube Studio</h1>
        </div>

        <nav
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none', padding: 0, margin: 0 }}>
            <li>
              <a href="/studio" className="font-inter">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/studio/new" className="font-inter">
                New Video
              </a>
            </li>
            <li>
              <a href="/studio/jobs" className="font-inter">
                Jobs
              </a>
            </li>
            <li>
              <a href="/studio/settings" className="font-inter">
                Settings
              </a>
            </li>
          </ul>
        </nav>

        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg hover:bg-white/10 transition"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
