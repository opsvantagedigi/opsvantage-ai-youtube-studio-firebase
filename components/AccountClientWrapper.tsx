'use client'

import { useEffect, useState } from 'react'
import ConnectYouTubeButton from '~/components/ConnectYouTubeButton'

export default function AccountClientWrapper() {
  return <AccountInner />
}

function AccountInner() {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('youtube_access_token') : null
    setIsConnected(!!token)
  }, [])

  return (
    <div className="mx-auto max-w-3xl p-8">
      <h1 className="heading-orbitron mb-4 text-2xl">Account & Integrations</h1>
      <p className="mb-8 text-sm text-gray-400">
        Manage your AI-YouTube Studio account, YouTube connection, and publishing preferences.
      </p>

      <div className="glass-card mb-6 rounded-2xl p-6">
        <h2 className="heading-orbitron mb-2 text-lg">YouTube Integration</h2>
        <p className="mb-4 text-xs text-gray-400">
          Connect your YouTube channel to enable automated publishing from the Studio.
        </p>
        <ConnectYouTubeButton />
        <div className="mt-4 text-xs text-gray-500">
          <p>Status: {isConnected ? 'Signed in' : 'Not signed in'}</p>
          {isConnected && <p>Signed in as: (YouTube token stored locally)</p>}
        </div>
      </div>
    </div>
  )
}
