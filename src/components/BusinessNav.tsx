'use client';

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image'; // Import the Next.js Image component
import Link from 'next/link';

export const BusinessNav = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 top-0 left-0 bg-[#050a14]/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image src="/opsvantage-logo.png" alt="OpsVantage Digital Logo" width={32} height={32} />
          <Link href="/">
            <div className="text-2xl font-orbitron font-bold tracking-wider text-white">
              OPS<span className="text-emerald-500">VANTAGE</span> DIGITAL
            </div>
          </Link>
        </div>
        
        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8 text-sm font-inter font-medium text-slate-400">
          {['Services', 'Case Studies', 'Products', 'About', 'Pricing'].map((item) => (
            <Link key={item} href={`/${item.toLowerCase().replace(' ', '-')}`} className="hover:text-emerald-400 transition-colors">
              {item}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Link href="/ai-youtube-studio">
            <span className="px-6 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500 hover:text-black transition-all duration-300 font-inter text-sm font-semibold tracking-wide">
              Get Started
            </span>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full h-screen bg-[#050a14] p-8 flex flex-col space-y-8 z-40 border-t border-white/10">
          {['Services', 'Case Studies', 'Products', 'About', 'Pricing'].map((item) => (
            <Link key={item} href={`/${item.toLowerCase().replace(' ', '-')}`} className="text-2xl font-orbitron text-white hover:text-emerald-400 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
              {item}
            </Link>
          ))}
          <Link href="/ai-youtube-studio">
            <span className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white font-orbitron font-bold rounded-lg">
              Get Started
            </span>
          </Link>
        </div>
      )}
    </nav>
  );
};
