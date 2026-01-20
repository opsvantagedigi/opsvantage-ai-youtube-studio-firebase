import { NextResponse } from 'next/server'
import { createQueue } from '../../../../lib/queue'

export async function POST(req: Request) {
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization')
  if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const accessToken = authHeader.split(' ')[1]
  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { title, description, filePath, refreshToken } = await req.json()

  const queue = createQueue('youtube-publish')
  const job = await queue.add('publish', {
    accessToken,
    refreshToken: refreshToken ?? null,
    title,
    description,
    filePath,
  })

  return NextResponse.json({ queued: true, jobId: job.id })
}
