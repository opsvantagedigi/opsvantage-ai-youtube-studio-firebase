import { NextResponse } from 'next/server'
import { createQueue } from '@/lib/queue'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const jobId = searchParams.get('jobId')

  if (!jobId) {
    return NextResponse.json({ error: 'jobId is required' }, { status: 400 })
  }

  const queue = createQueue('youtube-publish')
  const job = await queue.getJob(jobId)

  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 })
  }

  const state = await job.getState()
  const progress = job.progress()
  const finished = await job.isFinished()
  const failed = await job.isFailed()

  return NextResponse.json({ jobId, state, progress, finished, failed })
}
