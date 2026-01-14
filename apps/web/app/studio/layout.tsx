import React from 'react';

export const metadata = {
  title: 'Studio - AI YouTube Studio',
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex min-h-screen text-white font-inter"
      style={{ background: 'var(--background)' }}
    >
      <aside className="w-64 p-6 border-r" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <h2 className="text-xl font-orbitron mb-6">AI-YouTube Studio</h2>
        <nav className="space-y-4">
          <a href="/studio" className="block">
            Dashboard
          </a>
          <a href="/studio/new" className="block">
            New Video
          </a>
          <a href="/studio/jobs" className="block">
            Jobs
          </a>
          <a href="/studio/settings" className="block">
            Settings
          </a>
        </nav>
      </aside>

      <div className="flex flex-col flex-1">
        <header className="p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="text-lg font-orbitron">AI-YouTube Studio</div>
            <div className="text-sm text-white/80">OpsVantage Digital</div>
          </div>
        </header>

        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
