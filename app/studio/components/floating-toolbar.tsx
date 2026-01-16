"use client";

import { Play, Pause, ZoomIn, ZoomOut, Scissors, Sparkles } from "lucide-react";
import { useState } from "react";

interface FloatingToolbarProps {
  playing: boolean;
  onTogglePlay: () => void;
}

export function FloatingToolbar({ playing, onTogglePlay }: FloatingToolbarProps) {
  const [zoom, setZoom] = useState(1);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30">
      <div className="glass-panel px-4 py-2 flex items-center gap-3 shadow-lg border-white/20 spring-pop">
        <button
          onClick={onTogglePlay}
          className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-yellow-400 spring-pop"
        >
          {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <div className="flex items-center gap-2 text-xs text-white/60">
          <button
            onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
            className="p-1 rounded-md bg-white/5 hover:bg-white/10"
          >
            <ZoomOut className="w-3 h-3" />
          </button>
          <span>{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(2, z + 0.1))}
            className="p-1 rounded-md bg-white/5 hover:bg-white/10"
          >
            <ZoomIn className="w-3 h-3" />
          </button>
        </div>
        <div className="w-px h-6 bg-white/10" />
        <button className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-white/5 hover:bg-white/10">
          <Scissors className="w-3 h-3" />
          <span>Split</span>
        </button>
        <button className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 ai-pulse">
          <Sparkles className="w-3 h-3 text-yellow-300" />
          <span>AI Assist</span>
        </button>
      </div>
    </div>
  );
}
