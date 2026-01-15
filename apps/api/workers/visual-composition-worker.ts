import { logUsageEvent } from '../utils/logUsageEvent'

export async function processVisualJob(job: any, renderSeconds: number) {
  // ...visual composition logic
  await logUsageEvent(job.data.userId, 'render_seconds', renderSeconds, { jobId: job.id })
}
