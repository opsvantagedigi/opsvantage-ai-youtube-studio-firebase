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

export function synthesizeVoice(): Buffer {
  // Stub: Return empty buffer as placeholder
  return Buffer.from([])
}
