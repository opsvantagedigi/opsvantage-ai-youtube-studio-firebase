import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const jobId = searchParams.get('jobId')

  if (!jobId) return NextResponse.json({ error: 'Missing jobId' }, { status: 400 })

  // Proxy status check to backend API
  const backend =
    process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const r = await fetch(`${backend}/api/automation/status?jobId=${encodeURIComponent(jobId)}`)
  const json = await r.json()
  return NextResponse.json(json, { status: r.status })
}
