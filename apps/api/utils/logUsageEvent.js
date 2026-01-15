import { UsageEventStore } from '@/models/UsageEvent'
export async function logUsageEvent(userId, type, amount = 1, metadata = {}) {
  const timestamp = new Date().toISOString()
  UsageEventStore.push({
    id: `${userId}-${Date.now()}`,
    userId,
    type,
    amount,
    metadata,
    timestamp,
  })
}
//# sourceMappingURL=logUsageEvent.js.map
