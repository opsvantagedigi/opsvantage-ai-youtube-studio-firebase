export interface ScriptGenerationJob {
  videoId: string
  topic: string
  targetAudience: string
  language: string
}

export interface VoiceoverJob {
  videoId: string
  script: string
  voiceProfile: string
  language: string
}

export interface VisualCompositionJob {
  videoId: string
  script: string
  stylePreset: string
}

export interface VideoRenderJob {
  videoId: string
  timelineId: string
  resolution: '720p' | '1080p' | '4k'
}

export interface UploadJob {
  videoId: string
  filePath: string
  title: string
  description: string
  tags: string[]
  visibility: 'public' | 'unlisted' | 'private'
}

export interface YoutubePublishJob {
  videoId: string
  uploadId: string
  title: string
  description: string
  tags: string[]
  visibility: 'public' | 'unlisted' | 'private'
}

import { logUsageEvent } from '../common/logUsageEvent.js'

export async function logJobTrigger(job: any, jobType: string) {
  const userId = job?.userId || job?.ownerId || job?.uploaderId
  if (userId) {
    await logUsageEvent(userId, 'job_triggered', 1, { jobType })
  }
}
