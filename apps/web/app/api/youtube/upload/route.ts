// import { google } from 'googleapis' // (unused)
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const bodyJson = await req.json()
    const { accessToken, fileUrl } = bodyJson

    if (!accessToken) return NextResponse.json({ error: 'missing accessToken' }, { status: 400 })
    if (!fileUrl) return NextResponse.json({ error: 'missing fileUrl' }, { status: 400 })

    const payload = await req.json()

    // Proxy upload to backend API
    const backend =
      process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const r = await fetch(`${backend}/api/automation/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...(payload || {}) }),
    })

    const json = await r.json()
    return NextResponse.json(json, { status: r.status })

    // No further code needed; response already returned above.
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}
