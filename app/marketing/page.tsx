import Link from "next/link";
import { Logo } from "@/components/Logo";
import LandingExplainerDemo from "@/components/LandingExplainerDemoClient";

// Use the client demo component directly.

export default function MarketingLanding() {
  return (
    <main className="min-h-screen bg-[#020617] text-[#E5E7EB]">
      <header className="border-b border-[#0f172a] sticky top-0 z-20 bg-[#020617]/80 backdrop-blur">
        <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="text-sm font-medium text-[#9CA3AF]">OpsVantage AI-Explainer Engine</span>
          </div>
          <nav className="flex items-center gap-6 text-sm">
            <a href="#how-it-works" className="hover:text-white">How it works</a>
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#pricing" className="hover:text-white">Pricing</a>
            <Link href="/login" className="px-4 py-2 rounded-full border border-[#1f2937] hover:border-[#9ca3af]">Sign in</Link>
          </nav>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[#0EA5E9]">Explain your systems, not just your screens</p>
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
            <span style={{ background: 'linear-gradient(90deg,#0EA5E9,#22C55E,#EAB308)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
              Turn complex ops into clear explanations
            </span>{' '}in seconds.
          </h1>
          <p className="text-[#9CA3AF] text-sm md:text-base max-w-xl">OpsVantage AI‑Explainer Engine takes your real workflows, SOPs, and system behavior and turns them into audience‑aware explanations for teammates, clients, and future stewards.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/login?callbackUrl=/dashboard" className="px-5 py-2.5 rounded-full text-sm font-medium" style={{ background: 'linear-gradient(90deg,#0EA5E9,#22C55E,#EAB308)', color: '#041021' }}>Start Explaining with AI</Link>
            <a href="#demo" className="px-5 py-2.5 rounded-full text-sm font-medium border border-[#1f2937]">Explore the live demo</a>
          </div>
          <p className="text-xs text-[#9CA3AF]">No rewrites, no disruption — just clarity on top of what you already run.</p>
        </div>

        <div className="relative" id="demo">
          <div className="absolute inset-0 bg-linear-to-br from-[#0EA5E9]/20 via-[#22C55E]/10 to-[#EAB308]/20 blur-3xl -z-10" />
          <div className="border border-[#24303a] bg-[#071029]/70 rounded-2xl shadow-xl p-4">
            <div className="flex items-center gap-3 mb-4">
              <Logo size={32} />
              <div>
                <p className="text-xs uppercase text-[#9CA3AF]">Live explainer</p>
                <p className="text-sm font-medium">OpsVantage AI‑Explainer Engine</p>
              </div>
            </div>
            <LandingExplainerDemo />
          </div>
        </div>
      </section>

      <section id="how-it-works" className="max-w-6xl mx-auto px-4 py-16 border-t border-[#071227]">
        <h2 className="text-2xl font-semibold mb-2">How to use OpsVantage</h2>
        <p className="text-[#9CA3AF] text-sm mb-8 max-w-xl">In a few simple steps, you can turn any process, SOP, or behavior into a clear, shareable explanation — without disrupting how you already work.</p>
        <div className="grid md:grid-cols-3 gap-6">
          <HowCard step="01" title="Connect your context" body="Paste your existing SOPs, tickets, or system behavior. No rigid templates — just describe your reality." />
          <HowCard step="02" title="Choose your audience" body="Tell OpsVantage who needs to understand — a new engineer, a client, or a future steward — and it adapts tone and depth." />
          <HowCard step="03" title="Share and refine" body="Share the explanation with your team, refine it together, and keep a trail of how the system was understood over time." />
        </div>
      </section>
    </main>
  );
}

function HowCard({ step, title, body }: { step: string; title: string; body: string }) {
  return (
    <div className="relative border border-[#14202a] rounded-xl p-5 bg-[#020617]/60 hover:border-[#334155] transition">
      <div className="text-xs font-mono text-[#0EA5E9] mb-2">{step}</div>
      <h3 className="text-sm font-semibold mb-2">{title}</h3>
      <p className="text-xs text-[#9CA3AF] leading-relaxed">{body}</p>
    </div>
  );
}
