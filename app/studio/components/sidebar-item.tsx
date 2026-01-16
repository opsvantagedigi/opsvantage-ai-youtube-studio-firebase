'use client';

import type { ComponentType } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  active?: boolean;
}

export function SidebarItem({ href, label, icon: Icon, active }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
        active ? 'bg-white/10 border border-white/20 shadow-md' : 'hover:bg-white/5',
      )}
    >
      <Icon className="w-5 h-5 text-brand-yellow" />
      <span className="font-inter">{label}</span>
    </Link>
  );
}
