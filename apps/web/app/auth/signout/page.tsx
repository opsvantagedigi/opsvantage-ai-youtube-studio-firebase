'use client'

import { signOut } from 'next-auth/react'
import React from 'react'

export default function SignOutPage() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Sign Out</h1>
      <button onClick={() => signOut({ callbackUrl: '/' })}>Sign out</button>
    </div>
  )
}
