export type JobStatus = 'created' | 'processing' | 'rendered' | 'uploaded' | 'failed'

export interface VideoJobCreate {
  prompt: string
  tone?: string
  length?: string
  audience?: string
  callToAction?: string
}

export interface ScriptSegment {
  id: string
  start: number // seconds
  end: number // seconds
  text: string
}

export interface VideoJob {
  id: string
  status: JobStatus
  prompt: VideoJobCreate
  script?: ScriptSegment[]
  audioSegments?: string[] // file paths
  visuals?: string[] // asset ids or paths
  renderPath?: string
  youtubeId?: string
  createdAt: string
}
