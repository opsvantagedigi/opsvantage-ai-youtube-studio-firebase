import React from 'react';
import { usePathname } from 'next/navigation';
import type { ComponentType } from 'react';
import Link from 'next/link';
import { cn } from 'apps/firebase-app/lib/utils';

interface SidebarItemProps {
  href: string;
  Icon: ComponentType<{ className?: string }>;
  children: React.ReactNode;
}

export default function SidebarItem({ href, Icon, children }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className={cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
      isActive && "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
    )}>
      <Icon className="h-4 w-4" />
      {children}
    </Link>
  );
}
