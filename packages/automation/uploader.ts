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

export function uploadToYouTube(): boolean {
  // Stub: Pretend upload succeeded
  return true
}
