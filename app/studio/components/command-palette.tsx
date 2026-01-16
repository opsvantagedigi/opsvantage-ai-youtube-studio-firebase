'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, Video, Settings, LayoutDashboard } from 'lucide-react';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const actions = [
  { label: 'Go to Dashboard', href: '/studio', icon: LayoutDashboard },
  { label: 'New Prompt-to-Video Project', href: '/studio/new', icon: Video },
  { label: 'View Jobs / Renders', href: '/studio/jobs', icon: Sparkles },
  { label: 'Open Settings', href: '/studio/settings', icon: Settings },
];

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!open) Promise.resolve().then(() => setQuery(''));
  }, [open]);

  if (!open) return null;

  const filtered = actions.filter((a) => a.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div
      className="fixed inset-0 z-40 flex items-start justify-center pt-24 command-overlay"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="w-full max-w-xl mx-auto px-4 fade-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="glass-panel border-white/20 p-3">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-black/60 border border-white/10">
            <Search className="w-4 h-4 text-white/40" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command or search…"
              className="bg-transparent outline-none text-sm flex-1"
            />
            <span className="text-[10px] text-white/40">ESC to close</span>
          </div>

          <div className="mt-3 max-h-64 overflow-auto">
            {filtered.length === 0 && (
              <div className="px-3 py-4 text-xs text-white/40">No commands match “{query}”.</div>
            )}
            {filtered.map((action) => (
              <button
                key={action.href}
                onClick={() => {
                  router.push(action.href);
                  onOpenChange(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-white/5 flex items-center gap-2 text-sm magnetic"
              >
                <action.icon className="w-4 h-4 text-white/60" />
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommandPalette;
