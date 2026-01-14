"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Github, Mail, Globe } from "lucide-react";
export default function LoginPage() {
    const handleSignIn = (provider) => {
        void signIn(provider, { callbackUrl: "/dashboard" });
    };
    return (_jsxs("div", { className: "min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden text-slate-100", children: [_jsx(motion.div, { className: "absolute inset-0 -z-10 opacity-60", style: {
                    backgroundImage: `
            radial-gradient(circle at 0% 0%, rgba(0, 166, 118, 0.18) 0, transparent 55%),
            radial-gradient(circle at 100% 100%, rgba(242, 193, 78, 0.22) 0, transparent 55%),
            radial-gradient(circle at 80% 10%, rgba(0, 59, 115, 0.28) 0, transparent 55%),
            linear-gradient(135deg, rgba(0, 59, 115, 0.9), rgba(0, 166, 118, 0.8), rgba(242, 193, 78, 0.7))
          `,
                    backgroundSize: "220% 220%",
                }, animate: { backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }, transition: { duration: 22, repeat: Infinity, ease: "linear" } }), _jsx("div", { className: "absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(148,163,184,0.25)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.25)_1px,transparent_1px)] bg-size-[80px_80px] opacity-20" }), _jsxs(motion.div, { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, className: "w-full max-w-md p-8 rounded-xl bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-2xl", children: [_jsx("h1", { className: "font-(--font-orbitron) text-2xl text-center mb-2 bg-linear-to-r from-[#F2C14E] via-[#00A676] to-[#00B4D8] bg-clip-text text-transparent", children: "OpsVantage Digital" }), _jsx("p", { className: "text-xs text-center uppercase tracking-[0.2em] text-slate-400 mb-6", children: "AI Explainer Engine \u00B7 Access" }), _jsx("p", { className: "text-center text-slate-300 mb-8 text-sm", children: "Sign in to your workspace to create explainers, Shorts, and client\u2011ready breakdowns." }), _jsxs("div", { className: "space-y-3", children: [_jsxs("button", { onClick: () => handleSignIn("google"), className: "w-full flex items-center justify-center gap-2 rounded-lg bg-white text-slate-900 py-2.5 text-sm font-semibold shadow hover:bg-slate-100 transition", children: [_jsx(Globe, { className: "h-4 w-4" }), "Continue with Google"] }), _jsxs("button", { onClick: () => handleSignIn("github"), className: "w-full flex items-center justify-center gap-2 rounded-lg bg-slate-800 text-slate-100 py-2.5 text-sm font-semibold shadow hover:bg-slate-700 transition", children: [_jsx(Github, { className: "h-4 w-4" }), "Continue with GitHub"] }), _jsxs("button", { onClick: () => handleSignIn("email"), className: "w-full flex items-center justify-center gap-2 rounded-lg border border-slate-600 bg-slate-900/60 text-slate-100 py-2.5 text-sm font-semibold hover:bg-slate-800 transition", children: [_jsx(Mail, { className: "h-4 w-4" }), "Continue with Email"] })] }), _jsx("p", { className: "mt-6 text-[11px] text-center text-slate-500", children: "By continuing, you agree to the OpsVantage terms and data practices." })] })] }));
}
