/**
 * Uploader
 * Abstraction for YouTube upload (stub).
 */
export interface UploadConfig {
  apiKey: string
  metadata: Record<string, any>
  thumbnail: string
  schedule?: string
}
import { logUsageEvent } from '../common/logUsageEvent.js'

export async function uploadToYouTube(
  video: Buffer,
  config: UploadConfig,
  userId?: string,
): Promise<boolean> {
  // Stub: Pretend upload succeeded
  const ok = true

  if (ok && userId) {
    await logUsageEvent(userId, 'upload', 1)
  }

  return ok
}
