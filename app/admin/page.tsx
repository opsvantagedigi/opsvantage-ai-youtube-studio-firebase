import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Link from "next/link"

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  const userId = (session as any)?.user?.id

  if (!userId) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <div className="text-center space-y-3">
          <p className="text-sm text-slate-300">You must be signed in.</p>
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

  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, email: true },
  })

  if ((currentUser as any)?.role !== "superuser") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <div className="text-center space-y-3">
          <p className="text-sm text-slate-300">Access denied.</p>
        </div>
      </main>
    )
  }

  const [users, subscriptions, logs] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
    (prisma as any).subscription
      ? (prisma as any).subscription.findMany({ orderBy: { createdAt: "desc" }, take: 20 })
      : Promise.resolve([]),
    // auditLog model may not exist in the Prisma client for all schemas.
    // Use a safe any-cast and fallback to an empty array when not available.
    (prisma as any).auditLog
      ? (prisma as any).auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 20 })
      : Promise.resolve([]),
  ])

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div>
            <p className="font-(--font-orbitron) text-xs uppercase tracking-[0.25em] text-slate-400">
              OpsVantage Digital
            </p>
            <p className="text-sm text-slate-200">Admin · Superuser</p>
          </div>
          <p className="text-xs text-slate-400">{(currentUser as any)?.email}</p>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 md:px-8 py-10 space-y-10">
        <div>
          <h2 className="font-(--font-orbitron) text-sm text-slate-50 mb-2 uppercase tracking-[0.2em]">
            Users
          </h2>
          <div className="rounded-xl border border-white/10 bg-slate-950/70 p-4 text-xs">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800">
                  <th className="py-2 text-left">Email</th>
                  <th className="py-2 text-left">Role</th>
                  <th className="py-2 text-left">Created</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u: { id: string; email?: string; role?: string; createdAt?: Date }) => (
                  <tr key={u.id} className="border-b border-slate-900/70">
                    <td className="py-2">{u.email}</td>
                    <td className="py-2 text-slate-300">{u.role ?? "member"}</td>
                    <td className="py-2 text-slate-400">{u.createdAt?.toISOString?.().slice(0, 19).replace("T", " ") ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="font-(--font-orbitron) text-sm text-slate-50 mb-2 uppercase tracking-[0.2em]">
            Subscriptions
          </h2>
          <div className="rounded-xl border border-white/10 bg-slate-950/70 p-4 text-xs">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800">
                  <th className="py-2 text-left">User</th>
                  <th className="py-2 text-left">Plan</th>
                  <th className="py-2 text-left">Status</th>
                  <th className="py-2 text-left">Created</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((s: { id: string; userId?: string; planId?: string; status?: string; createdAt?: Date }) => (
                  <tr key={s.id} className="border-b border-slate-900/70">
                    <td className="py-2">{s.userId}</td>
                    <td className="py-2">{s.planId}</td>
                    <td className="py-2 text-slate-300">{s.status}</td>
                    <td className="py-2 text-slate-400">{s.createdAt?.toISOString?.().slice(0, 19).replace("T", " ") ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="font-(--font-orbitron) text-sm text-slate-50 mb-2 uppercase tracking-[0.2em]">
            Audit Log
          </h2>
          <div className="rounded-xl border border-white/10 bg-slate-950/70 p-4 text-xs max-h-72 overflow-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800">
                  <th className="py-2 text-left">Time</th>
                  <th className="py-2 text-left">User</th>
                  <th className="py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log: { id: string; createdAt?: Date; userId?: string; action?: string }) => (
                  <tr key={log.id} className="border-b border-slate-900/70">
                    <td className="py-2">{log.createdAt?.toISOString?.().slice(0, 19).replace("T", " ") ?? ""}</td>
                    <td className="py-2">{log.userId}</td>
                    <td className="py-2 text-slate-300">{log.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  )
}
