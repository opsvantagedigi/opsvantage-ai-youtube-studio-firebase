interface PreviewPanelProps {
  title?: string;
}

export function PreviewPanel({ title = "Real-time Preview" }: PreviewPanelProps) {
  return (
    <section className="glass-panel p-4 flex flex-col gap-3 h-full">
      <div className="flex items-center justify-between">
        <h2 className="heading-orbitron text-xs text-gray-400 tracking-widest uppercase">
          {title}
        </h2>
        <span className="text-[10px] text-white/40">Live</span>
      </div>
      <div className="flex-1 min-h-0 rounded-lg bg-gradient-to-br from-black via-slate-900 to-black border border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_10%_20%,rgba(0,71,255,0.4),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(0,255,209,0.3),transparent_55%)]" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 via-green-400 to-yellow-400 shadow-2xl flex items-center justify-center ai-pulse">
            <div className="w-4 h-4 bg-white rotate-45" />
          </div>
        </div>
      </div>
      <p className="text-[11px] text-white/50">
        Preview updates as you adjust script, scenes, and AI enhancements.
      </p>
    </section>
  );
}
