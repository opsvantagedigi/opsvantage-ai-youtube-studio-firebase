export type UsageType =
  | 'script_generation'
  | 'voiceover_seconds'
  | 'render_seconds'
  | 'video_generated'
  | 'api_call'
  | 'storage_gb'
  | 'team_seat'
  | 'marketplace_purchase'
  | 'addon_purchase'
  | string

export interface UsageEvent {
  id: string
  userId: string
  type: UsageType
  amount: number
  metadata?: Record<string, any>
  timestamp: string
}

export const UsageEventStore: UsageEvent[] = []
