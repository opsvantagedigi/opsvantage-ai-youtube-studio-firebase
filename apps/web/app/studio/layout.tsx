'use client'

export const dynamic = 'force-dynamic'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import CommandPalette from './components'
import { Menu, X, LayoutDashboard, FolderKanban, Sparkles, BarChart3 } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'

export default function StudioLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showCommand, setShowCommand] = useState(false)
  const { data: session } = useSession()

  // Cursor-follow glow
  useEffect(() => {
    const glow = document.getElementById('cursor-glow')
    if (!glow) return

    const handleMove = (e: MouseEvent) => {
      const x = e.clientX - 110
      const y = e.clientY - 110
      ;(glow as HTMLElement).style.transform = `translate3d(${x}px, ${y}px, 0)`
      ;(glow as HTMLElement).style.opacity = '1'
    }
    const handleLeave = () => {
      ;(glow as HTMLElement).style.opacity = '0'
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseleave', handleLeave)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  // Command palette shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setShowCommand((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const navItems = [
    { href: '/studio', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/studio/new', label: 'Projects', icon: FolderKanban },
    { href: '/studio/jobs', label: 'AI Assets', icon: Sparkles },
    { href: '/studio/settings', label: 'Analytics', icon: BarChart3 },
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505] text-white">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden flex-col border-r border-white/10 bg-black/40 transition-all duration-200 md:flex ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 animate-pulse rounded-full bg-gradient-to-tr from-blue-600 via-green-400 to-yellow-400" />
            {!collapsed && (
              <span className="heading-orbitron text-sm font-bold tracking-tighter">AI-STUDIO</span>
            )}
          </div>
          <button
            className="spring-pop text-xs text-white/60 hover:text-white"
            onClick={() => setCollapsed((c) => !c)}
          >
            {collapsed ? '›' : '‹'}
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-2 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="magnetic flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white"
            >
              <item.icon className="h-4 w-4" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-2 px-4 pb-4 text-xs text-white/60">
          {!collapsed && (
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Quick</p>
          )}
          <button
            onClick={() => setShowCommand(true)}
            className="magnetic flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-xs hover:bg-white/10"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="h-3 w-3 text-yellow-300" />
              {!collapsed && <span>Command Palette</span>}
            </span>
            {!collapsed && <span className="text-[10px] text-white/50">⌘K</span>}
          </button>
          <Link href="/" className="transition hover:text-white">
            ← Back to site
          </Link>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="fixed left-0 right-0 top-0 z-30 flex items-center justify-between border-b border-white/10 bg-black/70 px-4 py-3 backdrop-blur-xl md:hidden">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 animate-pulse rounded-full bg-gradient-to-tr from-blue-600 via-green-400 to-yellow-400" />
          <span className="heading-orbitron text-xs tracking-tight">AI-STUDIO</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCommand(true)}
            className="rounded-full bg-white/10 px-2 py-1 text-xs hover:bg-white/20"
          >
            ⌘K
          </button>
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="rounded-md bg-white/5 p-1 hover:bg-white/10"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-20 bg-black/70 backdrop-blur-xl md:hidden">
          <div className="flex h-full w-64 flex-col border-r border-white/10 bg-black/90 p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="heading-orbitron text-sm">AI-STUDIO</span>
              <button onClick={() => setMobileOpen(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
            <div className="mt-4 text-xs text-white/60">
              <Link href="/" onClick={() => setMobileOpen(false)}>
                ← Back to site
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex flex-1 flex-col md:ml-0">
        <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="text-sm text-white/80">{session?.user?.email ?? 'Not signed in'}</div>
          <div>
            <button
              onClick={() => signOut({ callbackUrl: '/auth/signin' })}
              className="rounded bg-white/5 px-3 py-1 text-sm hover:bg-white/10"
            >
              Sign out
            </button>
          </div>
        </header>
        <CommandPalette open={showCommand} onOpenChange={setShowCommand} />
        {children}
      </main>
    </div>
  )
}
