import { getServerSession } from "next-auth"
import { authOptions } from "../../src/lib/auth"
import { prisma } from "../../src/lib/prisma"
import { redirect } from "next/navigation"

export default async function FounderPage() {
  const session = await getServerSession(authOptions)
  if (!session) return redirect(`/login?callbackUrl=/founder`)

  const role = (session.user as any)?.role
  if (!role || (role !== 'admin' && role !== 'founder')) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-semibold">403 — Founder Dashboard</h1>
        <p className="mt-4">Founder Dashboard is restricted to stewards.</p>
      </div>
    )
  }

  // Health check
  let health = { status: 'Unknown', updatedAt: new Date().toISOString() }
  try {
    const res = await fetch(`${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/health`)
    if (res.ok) {
      const json = await res.json()
      health = { status: json.status || 'Healthy', updatedAt: new Date().toISOString() }
    } else {
      health = { status: 'Degraded', updatedAt: new Date().toISOString() }
    }
  } catch (e) {
    health = { status: 'Unknown', updatedAt: new Date().toISOString() }
  }

  // Subscriptions summary
  const subs = await (prisma as any).subscription.groupBy({
    by: ['status'],
    _count: { _all: true },
  })
  const counts = (subs || []).reduce((acc: any, cur: any) => { acc[cur.status] = (cur?._count?._all) || 0; return acc }, {})

  let recent = []
  try {
    recent = await (prisma as any).ipnEvent.findMany({ orderBy: { createdAt: 'desc' }, take: 5 })
  } catch (e) {
    recent = []
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Founder Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1 p-4 bg-slate-800 rounded-md">
          <h2 className="text-lg font-semibold">System Status</h2>
          <p className="mt-2">{health.status}</p>
          <p className="text-sm text-slate-400 mt-1">Updated {health.updatedAt}</p>
          <p className="text-sm text-slate-400 mt-2">Commit: {process.env.VERCEL_GIT_COMMIT_SHA || 'n/a'}</p>
          <p className="text-sm text-slate-400">URL: {process.env.VERCEL_URL || process.env.VERCEL_DEPLOY_URL || 'n/a'}</p>
        </div>
        <div className="col-span-1 p-4 bg-slate-800 rounded-md">
          <h2 className="text-lg font-semibold">Subscriptions</h2>
          <ul className="mt-2 space-y-1">
            <li>Active: {counts.active || 0}</li>
            <li>Pending: {counts.pending || 0}</li>
            <li>Failed: {counts.failed || 0}</li>
          </ul>
        </div>
        <div className="col-span-1 p-4 bg-slate-800 rounded-md">
          <h2 className="text-lg font-semibold">Recent Billing Events</h2>
          <ul className="mt-2 space-y-1">
            {(recent || []).map((e: any) => (
              <li key={e.id} className="text-sm">{e.providerOrderId} — {e.status} — {new Date(e.createdAt).toLocaleString()}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="p-4 bg-slate-900 rounded-md">
        <h3 className="font-semibold">Docs & Runbooks</h3>
        <ul className="mt-2">
          <li><a href="/docs/index.md" className="text-sky-400">Documentation Index</a></li>
          <li><a href="/docs/opsvantage-deployment-playbook.md" className="text-sky-400">Deployment Playbook</a></li>
          <li><a href="/docs/founder-acceptance-test.md" className="text-sky-400">Founder Acceptance Test</a></li>
        </ul>
      </div>
    </div>
  )
}
