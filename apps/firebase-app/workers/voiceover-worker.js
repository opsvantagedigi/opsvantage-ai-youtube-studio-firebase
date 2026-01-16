import { logUsageEvent } from '../utils/logUsageEvent'
export async function processVoiceoverJob(job, audioLengthSeconds) {
  // ...voiceover generation logic
  await logUsageEvent(job.data.userId, 'voiceover_seconds', audioLengthSeconds, { jobId: job.id })
}
//# sourceMappingURL=voiceover-worker.js.map
