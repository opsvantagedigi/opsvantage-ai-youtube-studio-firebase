
import React from 'react';
import { Inter, Orbitron } from 'next/font/google';
import { ArrowRight, CheckCircle, Code, Cpu, Layers, BarChart, Smartphone, Zap, Globe, Shield } from 'lucide-react';
import { BusinessNav } from '@/components/BusinessNav';
import Link from 'next/link';

// --- FONTS ---

const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

// --- DATA ---
const services = [
  {
    id: 'web',
    label: 'Web Development',
    title: 'High-Performance Web Architecture',
    desc: 'We build SEO-ready, lightning-fast web applications using Next.js and React. Our code is clean, scalable, and built for conversion.',
    features: ['Next.js & React Frameworks', 'Headless CMS Integration', 'PWA (Progressive Web Apps)', 'Speed Optimization'],
    icon: <Globe className="text-emerald-400" size={24} />
  },
  {
    id: 'ai',
    label: 'AI Automation',
    title: 'Intelligent Workflows',
    desc: 'Stop doing busy work. We deploy custom AI agents and workflow automations that handle data entry, customer support, and analysis 24/7.',
    features: ['Custom GPT Assistants', 'Zapier/Make.com Automation', 'Customer Support Chatbots', 'Data Processing Pipelines'],
    icon: <Cpu className="text-blue-400" size={24} />
  },
  {
    id: 'brand',
    label: 'Branding',
    title: 'Identity Systems',
    desc: 'Your brand is more than a logo. It is a system. We create cohesive visual identities that position you as the authority in your market.',
    features: ['Visual Identity Design', 'Brand Strategy & Voice', 'UI/UX Design Systems', 'Marketing Collateral'],
    icon: <Layers className="text-yellow-400" size={24} />
  }
];

const portfolio = [
  { client: 'NexusFin', result: '+45% User Retention', imageColor: 'bg-blue-900' },
  { client: 'Vortex Logistics', result: 'Saved 20hrs/Week', imageColor: 'bg-emerald-900' },
  { client: 'Solaris Energy', result: '2x Lead Volume', imageColor: 'bg-yellow-900' },
];

export default function Home() {

  // This is a simplified version of the tab state for a server component

  const activeTab = services[0];

  return (
    <div className={`min-h-screen bg-[#050a14] text-slate-200 selection:bg-emerald-500 selection:text-white overflow-x-hidden ${inter.variable} ${orbitron.variable} font-sans`}>
      
      <BusinessNav />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] md:w-[1000px] md:h-[600px] bg-gradient-to-r from-blue-900/30 via-emerald-900/20 to-yellow-900/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 animate-pulse hover:bg-white/10 transition-colors cursor-pointer">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-inter uppercase tracking-widest text-slate-300">Accepting New Projects for Q1</span>
          </div>

          <h1 className="font-orbitron text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1] text-white mb-8">
            BUILD. AUTOMATE.<br />
            <span className="gradient-text">SCALE.</span>
          </h1>

          <p className="font-inter text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            OpsVantage Digital transforms businesses through cutting‑edge web development, brand innovation, and intelligent automation.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link href="/ai-youtube-studio">
              <button className="w-full md:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-orbitron font-bold text-sm tracking-wider uppercase rounded transition-transform hover:scale-105 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                Get Started
              </button>
            </Link>
            <button className="w-full md:w-auto px-8 py-4 bg-transparent border border-slate-700 hover:border-emerald-500 text-white font-orbitron font-bold text-sm tracking-wider uppercase rounded transition-colors">
              Explore Solutions
            </button>
          </div>

          <div className="mt-8">
            <a href="#" className="text-sm text-slate-500 hover:text-emerald-400 underline decoration-slate-700 underline-offset-4 transition-colors">
              Take the 2-min Automation Quiz
            </a>
          </div>

          <div className="mt-20 pt-10 border-t border-white/5">
            <p className="text-xs text-slate-600 uppercase tracking-widest mb-6 font-inter">Trusted by Innovators</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
               <div className="text-xl font-orbitron font-bold text-white flex items-center gap-2"><div className="w-4 h-4 bg-blue-500 rounded-full"></div>NEXUS</div>
               <div className="text-xl font-orbitron font-bold text-white flex items-center gap-2"><div className="w-4 h-4 bg-emerald-500 rounded-full"></div>APEX</div>
               <div className="text-xl font-orbitron font-bold text-white flex items-center gap-2"><div className="w-4 h-4 bg-yellow-500 rounded-full"></div>QUANTA</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* ... The rest of your static page content ... */}

    </div>
  );
}
