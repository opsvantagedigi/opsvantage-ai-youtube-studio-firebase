'use client'

import { useEffect, useState } from 'react'

export default function AnalyticsClientWrapper() {
  return <AnalyticsInner />
}

function AnalyticsInner() {
  const [metrics, setMetrics] = (globalThis as any).__ai_youtube_metrics || [[], () => {}]
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('youtube_access_token') : null
    setIsConnected(!!token)
  }, [])

  // Local stub: populate placeholder metrics when connected
  useEffect(() => {
    if (isConnected && (!metrics || metrics.length === 0)) {
      setMetrics([
        { label: 'Total Views (Last 30 Days)', value: '—' },
        { label: 'Avg. Watch Time', value: '—' },
        { label: 'Subscribers Gained', value: '—' },
      ])
    }
  }, [isConnected])

  return (
    <div className="mx-auto max-w-5xl p-8">
      <h1 className="heading-orbitron mb-4 text-2xl">YouTube Analytics</h1>
      <p className="mb-8 text-sm text-gray-400">
        Connect your YouTube account to see channel metrics. This local stub uses a pasted token
        stored in localStorage under `youtube_access_token`.
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        {(metrics || []).map((m: any, i: number) => (
          <div key={i} className="glass-card rounded-2xl p-6">
            <p className="mb-2 text-[11px] text-gray-500">{m.label}</p>
            <p className="heading-orbitron text-xl">{m.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
