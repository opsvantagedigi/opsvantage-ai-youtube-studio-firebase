import { logUsageEvent } from '../utils/logUsageEvent'

export async function processUploadJob(job: any) {
  // ...upload logic
  await logUsageEvent(job.data.userId, 'upload', 1, { jobId: job.id })
}
