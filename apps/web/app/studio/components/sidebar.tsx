'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarItem } from './sidebar-item';
import { Home, PlusCircle, List, Settings } from 'lucide-react';
import Image from 'next/image';

export function Sidebar() {
  const pathname = usePathname();

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
        <SidebarItem href="/studio" label="Dashboard" icon={Home} active={pathname === '/studio'} />
        <SidebarItem
          href="/studio/new"
          label="New Video"
          icon={PlusCircle}
          active={pathname.startsWith('/studio/new')}
        />
        <SidebarItem
          href="/studio/jobs"
          label="Jobs"
          icon={List}
          active={pathname.startsWith('/studio/jobs')}
        />
        <SidebarItem
          href="/studio/settings"
          label="Settings"
          icon={Settings}
          active={pathname.startsWith('/studio/settings')}
        />
      </nav>
    </aside>
  );
}
