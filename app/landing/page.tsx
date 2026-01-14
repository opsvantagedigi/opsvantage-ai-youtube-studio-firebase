"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Sparkles, PlayCircle, ShieldCheck, Zap, Workflow } from "lucide-react"

const features = [
  {
    icon: Workflow,
    title: "Ops‑aware by design",
    desc: "Thinks in workflows, rituals, and governance. Explainers that match how your systems actually run.",
  },
  {
    icon: Zap,
    title: "AI that ships",
    desc: "Scripts, Shorts, and client‑ready breakdowns you can publish in minutes, not days.",
  },
  {
    icon: ShieldCheck,
    title: "Multi‑tenant & secure",
    desc: "Workspace‑scoped access, RLS, and production‑ready Postgres from day one.",
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Background */}
      <motion.div
        className="absolute inset-0 -z-10 opacity-70"
        style={{
          backgroundImage: `
            radial-gradient(circle at 0% 0%, rgba(0, 166, 118, 0.18) 0, transparent 55%),
            radial-gradient(circle at 100% 100%, rgba(242, 193, 78, 0.22) 0, transparent 55%),
            radial-gradient(circle at 80% 10%, rgba(0, 59, 115, 0.28) 0, transparent 55%),
            linear-gradient(135deg, rgba(0, 10, 30, 0.95), rgba(0, 59, 115, 0.85), rgba(0, 166, 118, 0.75))
          `,
          backgroundSize: "220% 220%",
        }}
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(148,163,184,0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.2)_1px,transparent_1px)] bg-size-[80px_80px] opacity-20" />

      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-[#F2C14E]" />
            <span className="font-(--font-orbitron) text-sm tracking-[0.25em] uppercase text-slate-300">
              OpsVantage Digital
            </span>
          </div>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="text-sm text-slate-200 hover:text-white px-3 py-1 rounded-md"
            >
              Sign in
            </Link>
            <Link
              href="/login"
              className="text-sm px-4 py-2 rounded-full bg-linear-to-r from-[#003B73] via-[#00A676] to-[#F2C14E] text-slate-950 font-semibold shadow-lg hover:opacity-90"
            >
              Launch Explainer Engine
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 md:px-8 py-12 md:py-16 space-y-16">
        {/* Hero */}
        <section className="grid gap-10 md:grid-cols-[1.3fr,1fr] items-center">
          <div>
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight bg-linear-to-r from-[#F2C14E] via-[#00A676] to-[#00B4D8] bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              Explain complex systems like a founder, not a manual.
            </motion.h1>
            <p className="mt-4 text-sm md:text-base text-slate-200/90 max-w-xl">
              The OpsVantage AI Explainer Engine turns your CI/CD pipelines, governance rituals,
              and product behavior into clean explainers, scripts, and Shorts‑ready content.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-linear-to-r from-[#003B73] via-[#00A676] to-[#F2C14E] text-slate-950 font-semibold text-sm shadow-lg hover:opacity-90"
              >
                <Sparkles className="h-4 w-4" />
                Start explaining in seconds
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-slate-600 text-sm text-slate-100 hover:bg-slate-900/70"
              >
                <PlayCircle className="h-4 w-4" />
                See how it works
              </Link>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Built for founders, educators, and operators who think in systems.
            </p>
          </div>

          {/* Hero right: preview card */}
          <motion.div
            className="rounded-xl border border-white/15 bg-slate-950/70 backdrop-blur-xl p-5 shadow-2xl"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-3">
              Live explainer preview
            </p>
            <div className="space-y-3 text-sm">
              <div className="border border-slate-700/70 rounded-lg p-3 bg-slate-900/60">
                <p className="text-[11px] text-slate-400 mb-1">Title</p>
                <p className="font-medium text-slate-50">
                  CI/CD for new engineers in 90 seconds
                </p>
              </div>
              <div className="border border-slate-700/70 rounded-lg p-3 bg-slate-900/60">
                <p className="text-[11px] text-slate-400 mb-1">Script</p>
                <p className="text-xs text-slate-200 leading-relaxed">
                  “Imagine every change to your codebase is a plane taking off. CI/CD is the air
                  traffic control that checks, tests, and safely lands each deployment…”
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {['#CI/CD', '#DevOps', '#Explainer', '#OpsVantage'].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-[11px] bg-emerald-500/10 border border-emerald-400/40 text-emerald-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features */}
        <section id="how-it-works" className="space-y-6">
          <h2 className="font-(--font-orbitron) text-xl text-slate-50">
            Built for systems, not just sentences.
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-white/10 bg-slate-950/70 p-4 text-sm shadow"
              >
                <f.icon className="h-5 w-5 text-[#00A676] mb-3" />
                <h3 className="font-semibold text-slate-50 mb-1">{f.title}</h3>
                <p className="text-slate-300 text-xs">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
