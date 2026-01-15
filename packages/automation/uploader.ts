/**
 * Uploader
 * Abstraction for YouTube upload (stub).
 */
export interface UploadConfig {
  apiKey: string;
  metadata: Record<string, any>;
  thumbnail: string;
  schedule?: string;
}

export function uploadToYouTube(video: Buffer, config: UploadConfig): boolean {
  // Stub: Pretend upload succeeded
  return true;
}
