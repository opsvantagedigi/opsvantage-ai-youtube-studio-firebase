
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

const PricingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050a14] text-slate-200 selection:bg-emerald-500 selection:text-white">
      <div className="max-w-7xl mx-auto py-24 px-6">

        {/* --- HEADING --- */}
        <div className="text-center mb-20">
          <h1 className="font-orbitron text-5xl md:text-7xl font-black tracking-tight text-white mb-4">AI-Powered YouTube Automation</h1>
          <p className="font-inter text-lg text-slate-400 max-w-3xl mx-auto">Stop hiring editors, writers, and artists. Our AI does it all, delivering a 10x ROI through autonomous content creation.</p>
        </div>

        {/* --- PRICING CARDS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

          {/* --- TIER 1: STARTER --- */}
          <div className="bg-white/5 border border-slate-800 rounded-2xl p-8 flex flex-col h-full">
            <h3 className="font-orbitron text-2xl font-bold text-white mb-2">Starter</h3>
            <p className="font-inter text-slate-400 mb-6 h-12">For creators testing the waters of AI.</p>
            <div className="mb-6">
              <span className="font-orbitron text-5xl font-black text-white">$29</span>
              <span className="font-inter text-slate-400">/month</span>
            </div>
            <ul className="space-y-4 font-inter text-slate-300 mb-8 flex-grow">
              <li className="flex items-center"><CheckCircle className="text-emerald-500 mr-3" size={16} /> 10 Videos/mo</li>
              <li className="flex items-center"><XCircle className="text-red-500 mr-3" size={16} /> No Analytics</li>
              <li className="flex items-center"><XCircle className="text-red-500 mr-3" size={16} /> No Automation</li>
            </ul>
            <Link href="/ai-youtube-studio">
              <span className="block w-full text-center px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-orbitron font-bold text-sm tracking-wider uppercase rounded transition-colors">
                Get Started
              </span>
            </Link>
          </div>

          {/* --- TIER 2: CREATOR --- */}
          <div className="bg-white/5 border border-slate-800 rounded-2xl p-8 flex flex-col h-full">
            <h3 className="font-orbitron text-2xl font-bold text-white mb-2">Creator</h3>
            <p className="font-inter text-slate-400 mb-6 h-12">For serious creators focused on growth.</p>
            <div className="mb-6">
              <span className="font-orbitron text-5xl font-black text-white">$99</span>
              <span className="font-inter text-slate-400">/month</span>
            </div>
            <ul className="space-y-4 font-inter text-slate-300 mb-8 flex-grow">
                <li className="flex items-center"><CheckCircle className="text-emerald-500 mr-3" size={16} /> 50 Videos/mo</li>
                <li className="flex items-center"><CheckCircle className="text-emerald-500 mr-3" size={16} /> Analytics</li>
                <li className="flex items-center"><XCircle className="text-red-500 mr-3" size={16} /> No Automation</li>
            </ul>
            <Link href="/ai-youtube-studio">
              <span className="block w-full text-center px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-orbitron font-bold text-sm tracking-wider uppercase rounded transition-colors">
                Get Started
              </span>
            </Link>
          </div>

          {/* --- TIER 3: PRO (RECOMMENDED) --- */}
          <div className="bg-emerald-500/10 border-2 border-emerald-500 rounded-2xl p-8 flex flex-col relative shadow-[0_0_30px_rgba(16,185,129,0.5)] h-full">
            <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-500 text-black font-orbitron font-bold text-xs uppercase tracking-widest rounded-full">Recommended</div>
            <h3 className="font-orbitron text-2xl font-bold text-white mb-2">Pro</h3>
            <p className="font-inter text-slate-400 mb-6 h-12">For businesses that want to scale.</p>
            <div className="mb-6">
              <span className="font-orbitron text-5xl font-black text-white">$299</span>
              <span className="font-inter text-slate-400">/month</span>
            </div>
            <ul className="space-y-4 font-inter text-slate-300 mb-8 flex-grow">
                <li className="flex items-center"><CheckCircle className="text-emerald-500 mr-3" size={16} /> 200 Videos/mo</li>
                <li className="flex items-center"><CheckCircle className="text-emerald-500 mr-3" size={16} /> Analytics</li>
                <li className="flex items-center"><CheckCircle className="text-emerald-500 mr-3" size={16} /> Automation</li>
            </ul>
            <Link href="/ai-youtube-studio">
              <span className="block w-full text-center px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-orbitron font-bold text-sm tracking-wider uppercase rounded transition-transform hover:scale-105">
                Get Started
              </span>
            </Link>
          </div>

          {/* --- TIER 4: ENTERPRISE --- */}
          <div className="bg-white/5 border border-slate-800 rounded-2xl p-8 flex flex-col h-full">
            <h3 className="font-orbitron text-2xl font-bold text-white mb-2">Enterprise</h3>
            <p className="font-inter text-slate-400 mb-6 h-12">For large-scale, custom deployments.</p>
            <div className="mb-6">
                <span className="font-orbitron text-5xl font-black text-white">$999+</span>
            </div>
            <ul className="space-y-4 font-inter text-slate-300 mb-8 flex-grow">
                <li className="flex items-center"><CheckCircle className="text-emerald-500 mr-3" size={16} /> Unlimited Videos</li>
                <li className="flex items-center"><CheckCircle className="text-emerald-500 mr-3" size={16} /> Custom Workflows</li>
                <li className="flex items-center"><CheckCircle className="text-emerald-500 mr-3" size={16} /> Dedicated Support</li>
            </ul>
            <Link href="/contact">
                <span className="block w-full text-center px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-orbitron font-bold text-sm tracking-wider uppercase rounded transition-colors">
                    Contact Us
                </span>
            </Link>
          </div>

        </div>

        {/* --- ANNUAL DISCOUNT --- */}
        <div className="text-center mt-20">
          <p className="font-inter text-lg text-slate-400">Get 2 months free with an annual plan. <a href="#" className="text-emerald-400 underline hover:text-emerald-300">Learn More</a></p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
