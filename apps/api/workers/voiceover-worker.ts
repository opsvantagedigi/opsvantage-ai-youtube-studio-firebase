import { logUsageEvent } from '../utils/logUsageEvent'

export async function processVoiceoverJob(job: any, audioLengthSeconds: number) {
  // ...voiceover generation logic
  await logUsageEvent(job.data.userId, 'voiceover_seconds', audioLengthSeconds, { jobId: job.id })
}
