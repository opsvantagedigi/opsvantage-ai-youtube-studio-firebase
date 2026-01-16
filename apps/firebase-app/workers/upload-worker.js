import { logUsageEvent } from '../utils/logUsageEvent'
export async function processUploadJob(job) {
  // ...upload logic
  await logUsageEvent(job.data.userId, 'upload', 1, { jobId: job.id })
}
//# sourceMappingURL=upload-worker.js.map
