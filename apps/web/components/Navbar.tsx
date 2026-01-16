'use client'

import Link from 'next/link'
import React from 'react'
import AuthButtons from '@/components/auth/AuthButtons'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 w-full border-b border-white/5 bg-black/40 px-6 py-6 backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 via-emerald-400 to-yellow-300" />
          <span className="heading-orbitron text-sm uppercase tracking-[0.2em]">
            AI-YouTube Studio
          </span>
        </div>
        <nav className="flex items-center gap-6 text-xs text-gray-400">
          <Link href="#features" className="transition-colors hover:text-white">
            Features
          </Link>
          <Link href="#enterprise" className="transition-colors hover:text-white">
            Enterprise
          </Link>
          <Link
            href="/studio"
            className="glass-card heading-orbitron rounded-full px-4 py-2 text-xs"
          >
            Enter Studio
          </Link>
          <div className="ml-6 flex items-center">
            <AuthButtons />
          </div>
        </nav>
      </div>
    </header>
  )
}
