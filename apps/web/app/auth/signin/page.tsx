'use client'

import { signIn } from 'next-auth/react'
import React from 'react'

export default function SignInPage() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Sign In</h1>
      <button onClick={() => signIn('google')}>Sign in with Google</button>
    </div>
  )
}
