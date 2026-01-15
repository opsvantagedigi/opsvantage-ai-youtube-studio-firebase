import { NextResponse } from 'next/server'
import { createQueue } from '@repo/queue'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const jobId = searchParams.get('jobId')

  if (!jobId) return NextResponse.json({ error: 'Missing jobId' }, { status: 400 })

  const queue = createQueue('youtube-publish')
  const job = await queue.getJob(jobId as any)
  if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 })

  const state = await job.getState()
  const progress = job.progress ?? null
  const result = job.returnvalue ?? null
  return NextResponse.json({ state, progress, result })
}