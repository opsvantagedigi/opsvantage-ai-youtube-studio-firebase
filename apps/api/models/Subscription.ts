export interface Subscription {
  id: string
  userId: string
  tier: 'Free' | 'Pro' | 'Pro+' | 'Business' | 'Enterprise'
  status: 'active' | 'inactive' | 'canceled' | 'expired'
  startedAt: string
  expiresAt?: string
  seatsIncluded?: number
  extraSeatPrice?: number
  overageRate?: number
  autoTopUpEnabled?: boolean
}

export const SubscriptionStore: Subscription[] = []
