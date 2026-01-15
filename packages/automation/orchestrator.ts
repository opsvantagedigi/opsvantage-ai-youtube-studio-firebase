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

export async function runVideoAutomationPipeline(input: PromptInput) {
  console.log('Starting pipeline...')
  const prompt = createPrompt(input)
  const script = generateScript(prompt)
  const audio = synthesizeVoice(script.body, { provider: 'mock', voice: 'default' })
  const visuals = composeVisuals(script.body)
  const video = renderVideo({ script: script.body, visuals, audio })
  const uploadResult = uploadToYouTube(video, {
    apiKey: 'YOUTUBE_API_KEY',
    metadata: {},
    thumbnail: '',
  })
  const analytics = getAnalytics('mockVideoId')
  return { prompt, script, audio, visuals, video, uploadResult, analytics }
}
