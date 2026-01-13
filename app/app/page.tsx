"use client"
import Link from 'next/link'

export default function AppInnerPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">App Home</h1>
        <p className="mt-2 text-slate-400">This route is the internal app area. Go to the public site: <Link href="/">Home</Link></p>
      </div>
    </div>
  )
}
