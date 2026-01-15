import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { createQueue } from '@repo/queue'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions as any)
  if (!session || !(session as any).accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { title, description, filePath } = await req.json()

  const queue = createQueue('youtube-publish')
  const job = await queue.add('publish', {
    accessToken: (session as any).accessToken,
    refreshToken: (session as any).refreshToken,
    title,
    description,
    filePath,
  })

  return NextResponse.json({ queued: true, jobId: job.id })
}
