"use client"

import Link from "next/link"

export default function VerifyRequestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
      <div className="max-w-md p-8 rounded-xl bg-slate-900/80 border border-white/10">
        <h1 className="text-lg font-semibold">Check your inbox</h1>
        <p className="text-sm text-slate-300 mt-2">We emailed you a magic sign-in link. It may take a minute to arrive.</p>
        <div className="mt-6">
          <Link href="/login" className="text-sm text-slate-200 underline">Back to sign in</Link>
        </div>
      </div>
    </div>
  )
}
