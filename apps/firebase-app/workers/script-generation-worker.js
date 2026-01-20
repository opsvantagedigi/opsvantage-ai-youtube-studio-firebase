import { logUsageEvent } from '../utils/logUsageEvent'
export async function processScriptJob(job) {
  // ...existing script generation logic would run here
  // On success, record usage
  // simulate work
  // await generateScript(job.data)
  await logUsageEvent(job.data.userId, 'script_generation', 1, { jobId: job.id })
}
//# sourceMappingURL=script-generation-worker.js.map
