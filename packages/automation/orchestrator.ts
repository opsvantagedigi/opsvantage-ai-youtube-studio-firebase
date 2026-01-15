/**
 * Automation Orchestrator
 * Coordinates the full flow: prompt → script → voice → visuals → render → upload → analytics.
 */
import { PromptInput, createPrompt } from './promptEngine'
import { generateScript } from './scriptGenerator'
import { synthesizeVoice } from './voiceoverEngine'
import { composeVisuals } from './visualComposer'
import { renderVideo } from './videoRenderer'
import { uploadToYouTube } from './uploader'
import { getAnalytics } from './analyticsTracker'
import { createQueue } from '@repo/queue'
import {
  ScriptGenerationJob,
  // ...existing code...
} from './jobs'
import { recordJobEvent } from './analytics'
import { logUsageEvent } from '../common/logUsageEvent.js'

const scriptQueue = createQueue('script-generation')
// ...existing code...

export interface CreateVideoRequest {
  videoId: string
  topic: string
  targetAudience: string
  language: string
  stylePreset: string
  title: string
  description: string
  tags: string[]
  visibility: 'public' | 'unlisted' | 'private'
}

/**
 * Enqueues a video creation job, starting with script generation.
 */
export async function orchestrateVideoCreation(req: CreateVideoRequest) {
  const scriptJob: ScriptGenerationJob = {
    videoId: req.videoId,
    topic: req.topic,
    targetAudience: req.targetAudience,
    language: req.language,
  }
  await scriptQueue.add('script-generation', scriptJob)
  recordJobEvent({
    id: req.videoId,
    queue: 'script-generation',
    type: 'enqueued',
    timestamp: new Date().toISOString(),
    payload: scriptJob,
  })
  // Downstream stages can be chained by workers or events in future
  return { status: 'queued', videoId: req.videoId }
}

export async function runVideoAutomationPipeline(input: PromptInput, userId?: string) {
  console.log('Starting pipeline...')
  const prompt = createPrompt(input)
  const script = await generateScript(prompt, userId)
  if (userId) await logUsageEvent(userId, 'pipeline_stage', 1, { stage: 'script' })

  const audio = await synthesizeVoice(script.body, { provider: 'mock', voice: 'default' })
  if (userId) await logUsageEvent(userId, 'pipeline_stage', 1, { stage: 'voiceover' })

  const visuals = await composeVisuals(script.body, userId)
  if (userId) await logUsageEvent(userId, 'pipeline_stage', 1, { stage: 'visual_composition' })

  const video = await renderVideo({ script: script.body, visuals, audio }, userId)
  if (userId) await logUsageEvent(userId, 'pipeline_stage', 1, { stage: 'render' })

  const uploadResult = await uploadToYouTube(
    video,
    {
      apiKey: 'YOUTUBE_API_KEY',
      metadata: {},
      thumbnail: '',
    },
    userId,
  )
  if (userId) await logUsageEvent(userId, 'pipeline_stage', 1, { stage: 'upload' })

  const analytics = await getAnalytics('mockVideoId', userId)
  if (userId) await logUsageEvent(userId, 'pipeline_stage', 1, { stage: 'analytics' })

  return { prompt, script, audio, visuals, video, uploadResult, analytics }
}
