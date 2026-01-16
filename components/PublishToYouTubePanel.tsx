'use client'

import { useState } from 'react'

export default function PublishToYouTubePanel({ token }: { token?: string }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [isPublishing, setIsPublishing] = useState(false)

  const handlePublish = async () => {
    const accessToken =
      token ?? (typeof window !== 'undefined' ? localStorage.getItem('youtube_access_token') : null)
    if (!accessToken) {
      setStatus('YouTube is not connected.')
      return
    }

    setIsPublishing(true)
    setStatus('Publishing to YouTube...')

    try {
      const res = await fetch('/api/youtube/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ title, description, filePath: '/tmp/output.mp4' }),
      })

      if (!res.ok) throw new Error('Failed to publish')

      const data = await res.json()
      const jobId = data.jobId
      if (!jobId) throw new Error('No job id returned')

      setStatus('Queued. Tracking job...')

      const interval = setInterval(async () => {
        try {
          const s = await fetch(`/api/youtube/status?jobId=${encodeURIComponent(jobId)}`)
          if (!s.ok) throw new Error('Status fetch failed')
          const d = await s.json()
          if (d.progress !== undefined) {
            setStatus(`Job ${d.state} - ${d.progress}%`)
          } else {
            setStatus(`Job ${d.state}`)
          }

          if (d.state === 'completed') {
            setStatus('Published! ' + (d.result?.id || JSON.stringify(d.result)))
            clearInterval(interval)
            setIsPublishing(false)
          }

          if (d.state === 'failed') {
            setStatus('Publish failed')
            clearInterval(interval)
            setIsPublishing(false)
          }
        } catch {
          setStatus('Error polling job status')
          clearInterval(interval)
          setIsPublishing(false)
        }
      }, 2000)
    } catch {
      setStatus('Failed to publish video.')
      setIsPublishing(false)
    }
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <h2 className="heading-orbitron mb-4 text-lg">Publish to YouTube</h2>
      <div className="space-y-3 text-xs">
        <input
          type="text"
          placeholder="Video title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-xs"
        />
        <textarea
          placeholder="Video description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="h-24 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-xs"
        />
        <button
          onClick={handlePublish}
          disabled={isPublishing}
          className="heading-orbitron rounded-full bg-white px-4 py-2 text-xs font-bold text-black transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
        >
          {isPublishing ? 'Publishing…' : 'Publish to YouTube'}
        </button>
        {status && <p className="mt-2 text-[11px] text-gray-400">{status}</p>}
      </div>
    </div>
  )
}
