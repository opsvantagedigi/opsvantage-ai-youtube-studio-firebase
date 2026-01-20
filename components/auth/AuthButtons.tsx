'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import React from 'react'

type ButtonProps = {
  className?: string
}

export function SignInButton({ className }: ButtonProps) {
  return (
    <button
      type="button"
      onClick={() => signIn('google', { callbackUrl: '/studio' })}
      className={className ?? 'rounded bg-blue-600 px-4 py-2 text-white'}
    >
      Sign In
    </button>
  )
}

export function SignOutButton({ className }: ButtonProps) {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: '/' })}
      className={className ?? 'rounded bg-gray-700 px-4 py-2 text-white'}
    >
      Sign Out
    </button>
  )
}

export default function AuthButtons({ className }: ButtonProps) {
  const { data: session, status } = useSession()

  if (status === 'loading') return <div className={className}>Loading...</div>

  return <div className={className}>{session ? <SignOutButton /> : <SignInButton />}</div>
}
