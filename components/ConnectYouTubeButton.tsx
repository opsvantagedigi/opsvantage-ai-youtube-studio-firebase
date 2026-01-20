'use client'

import { useState } from 'react'

export default function ConnectYouTubeButton() {
  const [isConnected, setIsConnected] = useState(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('youtube_access_token')
    }
    return false
  })

  const handleClick = () => {
    if (isConnected) return
    const token = window.prompt('Paste YouTube access token (or cancel)')
    if (token) {
      try {
        localStorage.setItem('youtube_access_token', token)
        window.dispatchEvent(new Event('youtube:connected'))
        setIsConnected(true)
      } catch (e) {
        console.error('Failed to save token', e)
      }
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isConnected}
      className={`heading-orbitron rounded-full px-4 py-2 text-xs ${
        isConnected
          ? 'glass-card cursor-default border-green-500/40 text-green-400'
          : 'glass-card hover:border-white/40'
      }`}
    >
      {isConnected ? 'YouTube Connected' : 'Connect YouTube'}
    </button>
  )
}
