'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { FloatingToolbar } from './components/floating-toolbar'
import { PreviewPanel } from './components/preview-panel'

export default function StudioPage() {
  const [playing, setPlaying] = useState(false)

  return (
    <div className="grid h-screen grid-rows-[auto_1fr] overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-white/10 bg-black/40 px-6 py-4 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <h1 className="heading-orbitron brand-text-gradient text-2xl font-black md:text-3xl">
            AI-YouTube Studio
          </h1>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-widest text-green-400">
            Enterprise Live
          </span>
        </div>
        <div className="flex items-center gap-6">
          <button className="spring-pop rounded-full bg-white px-6 py-2 text-sm font-bold text-black transition-colors hover:bg-yellow-400">
            EXPORT VIDEO
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-4 overflow-hidden px-4 py-4 md:gap-6 md:px-6">
        {/* LEFT: Director’s Stage */}
        <div className="col-span-12 flex flex-col gap-4 overflow-hidden lg:col-span-8">
          {/* Video Preview */}
          <div className="glass-panel group relative aspect-video shrink-0 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-700 via-green-500 to-yellow-300 opacity-20 blur-2xl transition-all group-hover:opacity-40" />
              <div className="ai-pulse flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 via-green-400 to-yellow-400 shadow-2xl">
                <div className="h-4 w-4 rotate-45 bg-white" />
              </div>
            </div>
            <div className="absolute bottom-0 flex w-full items-center justify-between bg-black/60 p-4 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div
                  className={`h-3 w-3 rounded-full ${playing ? 'animate-ping bg-red-500' : 'bg-white/40'}`}
                />
                <span className="font-mono text-xs">00:42 / 03:15</span>
              </div>
              <div className="flex gap-4 text-xs opacity-70">
                <span className="cursor-pointer italic underline">Edit Layers</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="glass-panel min-h-0 flex-1 overflow-auto p-4">
            <h3 className="heading-orbitron mb-4 text-[10px] text-gray-500">
              Multitrack Sequencer
            </h3>
            <div className="space-y-3">
              {['Video', 'AI Voiceover', 'Subtitles'].map((track) => (
                <div key={track} className="flex items-center gap-4">
                  <span className="w-20 text-[10px] uppercase tracking-tighter text-gray-400">
                    {track}
                  </span>
                  <div className="relative h-8 flex-1 overflow-hidden rounded border border-white/5 bg-white/5">
                    <div className="absolute bottom-1 left-10 right-40 top-1 rounded border-l-2 border-blue-400 bg-gradient-to-r from-blue-500/20 to-green-500/20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Neural Sidebar + Preview */}
        <div className="col-span-12 flex flex-col gap-4 overflow-hidden lg:col-span-4">
          <section className="glass-panel min-h-0 flex-1 space-y-6 overflow-auto p-6">
            <h2 className="heading-orbitron text-xs uppercase tracking-widest text-yellow-400">
              Neural Workflow
            </h2>
            <div className="space-y-4">
              <button className="magnetic group w-full rounded-xl border border-white/10 bg-white/5 p-4 text-left transition hover:bg-white/10">
                <p className="mb-1 text-xs text-gray-400">AI Smart Task</p>
                <p className="text-sm font-semibold group-hover:text-yellow-400">
                  Generate Script from Topic
                </p>
              </button>
              <button className="magnetic group w-full rounded-xl border border-white/10 bg-white/5 p-4 text-left transition hover:bg-white/10">
                <p className="mb-1 text-xs text-gray-400">Visual Enhancement</p>
                <p className="text-sm font-semibold group-hover:text-green-400">
                  Auto-Apply Color Grade
                </p>
              </button>
            </div>
            <div className="border-t border-white/10 pt-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-gray-400">
                  Brand Compliance
                </span>
                <span className="text-xs text-green-400">98% Match</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[98%] bg-gradient-to-r from-blue-500 via-green-400 to-yellow-400" />
              </div>
            </div>
          </section>

          <PreviewPanel />
        </div>
      </div>

      <FloatingToolbar playing={playing} onTogglePlay={() => setPlaying((p) => !p)} />
    </div>
  )
}
