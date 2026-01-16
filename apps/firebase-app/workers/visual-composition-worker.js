import { logUsageEvent } from '../utils/logUsageEvent'
export async function processVisualJob(job, renderSeconds) {
  // ...visual composition logic
  await logUsageEvent(job.data.userId, 'render_seconds', renderSeconds, { jobId: job.id })
}
//# sourceMappingURL=visual-composition-worker.js.map
