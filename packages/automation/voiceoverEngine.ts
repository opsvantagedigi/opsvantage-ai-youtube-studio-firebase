/**
 * Voiceover Engine
 * Abstraction for TTS providers (stub).
 */
export interface VoiceoverConfig {
  provider: 'elevenlabs' | 'playht' | 'azure' | 'mock'
  voice: string
  pace?: string
  emotion?: string
  pronunciation?: Record<string, string>
}
import { logUsageEvent } from '../common/logUsageEvent.js'

export async function synthesizeVoice(
  text: string,
  config: VoiceoverConfig,
  userId?: string,
): Promise<Buffer> {
  // Stub: Return empty buffer as placeholder
  const buf = Buffer.from([])

  // Estimate audio length in seconds from text word count (approx)
  const words = text ? text.trim().split(/\s+/).length : 0
  const audioLengthSeconds = Math.max(1, Math.round(words / 2))

  if (userId) {
    await logUsageEvent(userId, 'voiceover_seconds', audioLengthSeconds)
  }

  return buf
}
