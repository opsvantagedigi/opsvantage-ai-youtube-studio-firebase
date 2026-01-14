import LandingExplainerDemo from '../src/components/LandingExplainerDemoClient'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-900 text-slate-100">
      <header className="max-w-6xl mx-auto py-8 px-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">OpsVantage Shorts Studio</h1>
        <nav className="space-x-4">
          <Link href="/login" className="text-slate-200">Sign in</Link>
          <Link href="/founder" className="text-slate-400">Founder</Link>
        </nav>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-4xl font-bold">Turn complex ops into YouTube‑ready explainer Shorts.</h2>
          <p className="mt-4 text-slate-300">AI‑powered explainer engine that converts SOPs and workflows into short, engaging scripts for YouTube Shorts.</p>
          <div className="mt-6 flex gap-3">
            <Link href="/login?callbackUrl=/dashboard" className="px-4 py-2 rounded bg-sky-500 text-slate-900 font-semibold">Start Explaining with AI</Link>
            <a href="#demo" className="px-4 py-2 rounded border border-slate-700 text-slate-200">Explore the live demo</a>
          </div>
        </div>

        <div id="demo" className="p-6 bg-slate-800 rounded-lg">
          <LandingExplainerDemo />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-semibold">How it works</h3>
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="p-4 bg-slate-800 rounded">Paste your SOP → AI extracts key steps.</div>
          <div className="p-4 bg-slate-800 rounded">Audience tuning → new hire, client, executive.</div>
          <div className="p-4 bg-slate-800 rounded">Export a 60s script → publish to Shorts.</div>
        </div>
      </section>

      <footer className="max-w-6xl mx-auto px-4 py-8 text-sm text-slate-500">
        <div className="flex justify-between">
          <div>© OpsVantage</div>
          <div className="space-x-4">
            <a href="/docs/index.md" className="text-slate-400">Docs</a>
            <Link href="/login" className="text-slate-400">Sign in</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
