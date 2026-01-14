"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, PlayCircle, ShieldCheck, Zap, Workflow } from "lucide-react";
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
];
export default function LandingPage() {
    return (_jsxs("div", { className: "min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden", children: [_jsx(motion.div, { className: "absolute inset-0 -z-10 opacity-70", style: {
                    backgroundImage: `
            radial-gradient(circle at 0% 0%, rgba(0, 166, 118, 0.18) 0, transparent 55%),
            radial-gradient(circle at 100% 100%, rgba(242, 193, 78, 0.22) 0, transparent 55%),
            radial-gradient(circle at 80% 10%, rgba(0, 59, 115, 0.28) 0, transparent 55%),
            linear-gradient(135deg, rgba(0, 10, 30, 0.95), rgba(0, 59, 115, 0.85), rgba(0, 166, 118, 0.75))
          `,
                    backgroundSize: "220% 220%",
                }, animate: { backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }, transition: { duration: 26, repeat: Infinity, ease: "linear" } }), _jsx("div", { className: "absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(148,163,184,0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.2)_1px,transparent_1px)] bg-size-[80px_80px] opacity-20" }), _jsx("header", { className: "border-b border-white/10 bg-slate-950/80 backdrop-blur-xl", children: _jsxs("div", { className: "mx-auto max-w-6xl px-4 py-4 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Sparkles, { className: "h-6 w-6 text-[#F2C14E]" }), _jsx("span", { className: "font-(--font-orbitron) text-sm tracking-[0.25em] uppercase text-slate-300", children: "OpsVantage Digital" })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx(Link, { href: "/login", className: "text-sm text-slate-200 hover:text-white px-3 py-1 rounded-md", children: "Sign in" }), _jsx(Link, { href: "/login", className: "text-sm px-4 py-2 rounded-full bg-linear-to-r from-[#003B73] via-[#00A676] to-[#F2C14E] text-slate-950 font-semibold shadow-lg hover:opacity-90", children: "Launch Explainer Engine" })] })] }) }), _jsxs("main", { className: "mx-auto max-w-6xl px-4 md:px-8 py-12 md:py-16 space-y-16", children: [_jsxs("section", { className: "grid gap-10 md:grid-cols-[1.3fr,1fr] items-center", children: [_jsxs("div", { children: [_jsx(motion.h1, { className: "text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight bg-linear-to-r from-[#F2C14E] via-[#00A676] to-[#00B4D8] bg-clip-text text-transparent", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7 }, children: "Explain complex systems like a founder, not a manual." }), _jsx("p", { className: "mt-4 text-sm md:text-base text-slate-200/90 max-w-xl", children: "The OpsVantage AI Explainer Engine turns your CI/CD pipelines, governance rituals, and product behavior into clean explainers, scripts, and Shorts\u2011ready content." }), _jsxs("div", { className: "mt-6 flex flex-wrap gap-3", children: [_jsxs(Link, { href: "/login", className: "inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-linear-to-r from-[#003B73] via-[#00A676] to-[#F2C14E] text-slate-950 font-semibold text-sm shadow-lg hover:opacity-90", children: [_jsx(Sparkles, { className: "h-4 w-4" }), "Start explaining in seconds"] }), _jsxs(Link, { href: "#how-it-works", className: "inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-slate-600 text-sm text-slate-100 hover:bg-slate-900/70", children: [_jsx(PlayCircle, { className: "h-4 w-4" }), "See how it works"] })] }), _jsx("p", { className: "mt-3 text-xs text-slate-400", children: "Built for founders, educators, and operators who think in systems." })] }), _jsxs(motion.div, { className: "rounded-xl border border-white/15 bg-slate-950/70 backdrop-blur-xl p-5 shadow-2xl", initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.7, delay: 0.1 }, children: [_jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-3", children: "Live explainer preview" }), _jsxs("div", { className: "space-y-3 text-sm", children: [_jsxs("div", { className: "border border-slate-700/70 rounded-lg p-3 bg-slate-900/60", children: [_jsx("p", { className: "text-[11px] text-slate-400 mb-1", children: "Title" }), _jsx("p", { className: "font-medium text-slate-50", children: "CI/CD for new engineers in 90 seconds" })] }), _jsxs("div", { className: "border border-slate-700/70 rounded-lg p-3 bg-slate-900/60", children: [_jsx("p", { className: "text-[11px] text-slate-400 mb-1", children: "Script" }), _jsx("p", { className: "text-xs text-slate-200 leading-relaxed", children: "\u201CImagine every change to your codebase is a plane taking off. CI/CD is the air traffic control that checks, tests, and safely lands each deployment\u2026\u201D" })] }), _jsx("div", { className: "flex flex-wrap gap-2", children: ['#CI/CD', '#DevOps', '#Explainer', '#OpsVantage'].map((tag) => (_jsx("span", { className: "px-3 py-1 rounded-full text-[11px] bg-emerald-500/10 border border-emerald-400/40 text-emerald-200", children: tag }, tag))) })] })] })] }), _jsxs("section", { id: "how-it-works", className: "space-y-6", children: [_jsx("h2", { className: "font-(--font-orbitron) text-xl text-slate-50", children: "Built for systems, not just sentences." }), _jsx("div", { className: "grid gap-5 md:grid-cols-3", children: features.map((f) => (_jsxs("div", { className: "rounded-xl border border-white/10 bg-slate-950/70 p-4 text-sm shadow", children: [_jsx(f.icon, { className: "h-5 w-5 text-[#00A676] mb-3" }), _jsx("h3", { className: "font-semibold text-slate-50 mb-1", children: f.title }), _jsx("p", { className: "text-slate-300 text-xs", children: f.desc })] }, f.title))) })] })] })] }));
}
