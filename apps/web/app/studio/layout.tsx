import React from 'react';
import { Header } from './components/header';

export const metadata = {
  title: 'Studio - AI YouTube Studio',
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen text-white font-inter" style={{ background: 'var(--background)' }}>
      <Header />

      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-4xl w-full">{children}</div>
      </main>
    </div>
  );
}
