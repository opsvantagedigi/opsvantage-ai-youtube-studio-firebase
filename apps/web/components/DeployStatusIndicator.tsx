'use client'
import { useEffect, useState } from 'react'

export function DeployStatusIndicator() {
  const [status, setStatus] = useState('live')

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch('/api/deploy/status')
        const data = await res.json()
        setStatus(data.status || 'live')
      } catch {
        setStatus('live')
      }
    }

    fetchStatus()
    const interval = setInterval(fetchStatus, 15000)
    return () => clearInterval(interval)
  }, [])

  const color =
    status === 'live' ? 'bg-green-400' : status === 'deploying' ? 'bg-yellow-400' : 'bg-red-500'

  return (
    <div className="flex items-center gap-2">
      <span className={`h-3 w-3 rounded-full ${color} animate-pulse`} />
      <span className="text-xs uppercase tracking-widest text-gray-400">{status}</span>
    </div>
  )
}
