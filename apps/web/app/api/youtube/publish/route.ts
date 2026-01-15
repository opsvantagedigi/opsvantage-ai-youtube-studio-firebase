import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
// ...existing code...

export async function POST(req: Request) {
  const session = await getServerSession(authOptions as any)
  if (!session || !(session as any).accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const payload = await req.json()

  // Proxy orchestration to the API backend to avoid bundling automation server code into the web build.
  const backend =
    process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const r = await fetch(`${backend}/api/automation/orchestrate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...(payload || {}), user: (session as any)?.user }),
  })

  const json = await r.json()
  return NextResponse.json(json, { status: r.status })
}
