/**
 * Caption & Subtitle Engine
 * Generates SRT or burned-in captions (stub).
 */
import { logUsageEvent } from '../common/logUsageEvent.js'

export async function generateCaptions(script: string, userId?: string): Promise<string> {
  // Stub: Return mock SRT
  const srt = '1\n00:00:00,000 --> 00:00:05,000\n' + script

  if (userId) {
    await logUsageEvent(userId, 'caption_generation', 1)
  }

  return srt
}
