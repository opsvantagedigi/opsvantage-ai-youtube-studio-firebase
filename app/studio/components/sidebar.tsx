'use client';

import Link from 'next/link';
import SidebarItem from './sidebar-item';
import { Home, PlusCircle, List, Settings } from 'lucide-react';
import Image from 'next/image';

export function Sidebar() {
  return (
    <aside
      className="w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 p-6 hidden md:flex flex-col shrink-0"
      style={{ height: 'calc(100vh - 64px)' }}
    >
      <div className="flex items-center gap-3 mb-10">
        <Image
          src="/brand-icon.png"
          alt="Brand Icon"
          width={36}
          height={36}
          className="rounded-md"
        />
        <span className="font-orbitron text-xl brand-gradient">Studio</span>
      </div>

      <nav className="flex flex-col gap-2">
        <SidebarItem href="/studio" Icon={Home}>Dashboard</SidebarItem>
        <SidebarItem href="/studio/new" Icon={PlusCircle}>New Video</SidebarItem>
        <SidebarItem href="/studio/jobs" Icon={List}>Jobs</SidebarItem>
        <SidebarItem href="/studio/settings" Icon={Settings}>Settings</SidebarItem>
      </nav>

      <div className="mt-auto pt-4">
        <Link href="/" className="text-sm text-white/70 hover:text-white transition-all">
          Back to site
        </Link>
      </div>
    </aside>
  );
}
