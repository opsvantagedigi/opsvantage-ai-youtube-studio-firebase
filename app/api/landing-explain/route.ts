import { NextResponse } from 'next/server'

type ReqBody = {
  text?: string
  audience?: string
}

export async function POST(request: Request) {
  try {
    const body: ReqBody = await request.json()
    if (!body.text) {
      return NextResponse.json({ error: 'text is required' }, { status: 400 })
    }

    // Deterministic placeholder response keyed by audience
    const audience = (body.audience || 'New hire').toLowerCase()
    const title = `Explanation for ${body.audience || 'New hire'}`
    const summary = [
      `Core idea: ${body.text.slice(0, 160)}`,
      audience === 'executive' ? 'Business impact highlighted.' : 'Step-by-step tasks outlined.',
    ]
    const whyItMatters = audience === 'client' ? 'Helps you understand deliverables and timeline.' : 'Helps onboard and scale the process.'
    const nextSteps = ['Share with team', 'Create a 60s script', 'Publish a Shorts draft']

    return NextResponse.json({ title, summary, whyItMatters, nextSteps })
  } catch (err) {
    return NextResponse.json({ error: 'invalid request' }, { status: 500 })
  }
}

export const GET = async () => NextResponse.json({ ok: true })
