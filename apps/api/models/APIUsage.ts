export interface APIUsage {
  id: string
  userId: string
  endpoint: string
  tokensOrSeconds: number
  cost: number
  timestamp: string
}

export const APIUsageStore: APIUsage[] = []
