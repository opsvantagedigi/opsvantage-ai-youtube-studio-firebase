'use client'

import { signIn } from 'next-auth/react'

export default function AuthPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-10%] h-[50%] w-[50%] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute right-[-10%] top-[20%] h-[40%] w-[40%] rounded-full bg-yellow-500/5 blur-[120px]" />
      </div>

      <div className="glass-panel w-full max-w-md space-y-6 rounded-2xl p-10 text-center">
        <h1 className="heading-orbitron brand-text-gradient text-3xl font-black">
          Welcome to AI‑YouTube Studio
        </h1>
        <p className="text-sm text-gray-400">
          Sign in to unlock the full AI‑powered creation suite.
        </p>

        <button
          onClick={() => signIn('google')}
          className="spring-pop w-full rounded-full bg-white py-3 font-bold text-black transition hover:bg-yellow-400"
        >
          Continue with Google
        </button>

        <p className="pt-4 text-xs text-gray-500">
          By continuing, you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>
  )
}
