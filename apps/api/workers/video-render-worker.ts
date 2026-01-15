import { logUsageEvent } from '../utils/logUsageEvent'

export async function processRenderJob(job: any, videoLengthSeconds: number) {
  // ...video rendering logic
  await logUsageEvent(job.data.userId, 'render_seconds', videoLengthSeconds, { jobId: job.id })
  await logUsageEvent(job.data.userId, 'video_generated', 1, { jobId: job.id })
}
