import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getUserSubscriptionStatus } from "@/lib/subscription"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <div className="text-center space-y-3">
          <p className="text-sm text-slate-300">You must be signed in to view your dashboard.</p>
          <Link
            href="/login"
            className="inline-flex px-4 py-2 rounded-full bg-linear-to-r from-[#003B73] via-[#00A676] to-[#F2C14E] text-slate-950 text-sm font-semibold"
          >
            Go to login
          </Link>
        </div>
      </main>
    )
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      memberships: {
        include: { workspace: true },
      },
    },
  })

  const workspaces = user?.memberships.map((m) => m.workspace) ?? []

  const subscriptionStatus = await getUserSubscriptionStatus(user?.id ?? null)

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div>
            <p className="font-(--font-orbitron) text-xs uppercase tracking-[0.25em] text-slate-400">
              OpsVantage Digital
            </p>
            <p className="text-sm text-slate-200">Dashboard</p>
          </div>
          <div className="text-xs text-slate-300">
            {session.user.email}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 md:px-8 py-10 space-y-6">
        <div>
          <h1 className="font-(--font-orbitron) text-xl text-slate-50">
            Workspaces
          </h1>
          <p className="text-sm text-slate-300">
            Choose a workspace to open the AI Explainer Engine.
          </p>
        </div>

        <div className="mb-6">
          <div className="rounded-xl border border-white/10 bg-slate-950/70 p-4">
            <p className="text-sm text-slate-200">Account status: <span className="font-semibold">{subscriptionStatus}</span></p>
            {subscriptionStatus !== "active" && (
              <div className="mt-3">
                <Link href="/app/billing/upgrade" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#003B73] via-[#00A676] to-[#F2C14E] text-slate-950 text-sm font-semibold">
                  Upgrade to Pro
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {workspaces.map((ws) => (
            <Link
              key={ws.id}
              href={`/app?workspaceId=${ws.id}`}
              className="rounded-xl border border-white/10 bg-slate-950/70 p-4 hover:border-emerald-400/60 transition"
            >
              <p className="text-sm font-semibold text-slate-50">{ws.name}</p>
              <p className="text-xs text-slate-400 mt-1">Slug: {ws.slug}</p>
            </Link>
          ))}

          {workspaces.length === 0 && (
            <div className="text-sm text-slate-300">
              No workspaces yet. Seed created one in the DB; ensure your user is linked via membership.
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
