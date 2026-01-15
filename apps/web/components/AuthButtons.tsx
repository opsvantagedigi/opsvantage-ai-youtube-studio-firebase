'use client'

import { signIn, signOut } from 'next-auth/react'

export function AuthButtons({ session }: { session: any }) {
  if (!session) {
    return (
      <div className="flex gap-4">
        <button
          onClick={() => signIn('google')}
          className="spring-pop rounded-full bg-white px-6 py-2 text-sm font-bold text-black transition hover:bg-yellow-400"
        >
          Sign In
        </button>
        <button
          onClick={() => signIn('google')}
          className="spring-pop rounded-full bg-gradient-to-r from-blue-600 via-green-400 to-yellow-400 px-6 py-2 text-sm font-bold text-black transition hover:opacity-90"
        >
          Sign Up
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => signOut()}
      className="rounded-full border border-white/20 bg-white/10 px-6 py-2 text-sm text-white transition hover:bg-white/20"
    >
      Sign Out
    </button>
  )
}
