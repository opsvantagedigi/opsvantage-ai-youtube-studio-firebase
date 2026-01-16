import { SubscriptionStore } from '../../models/Subscription'
export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { userId, tier } = req.body
  if (!userId || !tier) return res.status(400).json({ error: 'Missing fields' })
  const sub = SubscriptionStore.find((s) => s.userId === userId)
  if (sub) {
    sub.tier = tier
    sub.status = 'active'
  } else {
    SubscriptionStore.push({
      id: `${userId}-${Date.now()}`,
      userId,
      tier,
      status: 'active',
      startedAt: new Date().toISOString(),
    })
  }
  res.status(200).json({ success: true })
}
//# sourceMappingURL=upgrade.js.map
