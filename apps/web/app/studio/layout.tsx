import React from 'react';

export const metadata = {
  title: 'Studio - AI YouTube Studio',
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-black text-white font-inter">
      <aside className="w-64 p-4 border-r border-gray-800">
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
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
