import { logUsageEvent } from '../utils/logUsageEvent'
export async function processRenderJob(job, videoLengthSeconds) {
  // ...video rendering logic
  await logUsageEvent(job.data.userId, 'render_seconds', videoLengthSeconds, { jobId: job.id })
  await logUsageEvent(job.data.userId, 'video_generated', 1, { jobId: job.id })
}
//# sourceMappingURL=video-render-worker.js.map
