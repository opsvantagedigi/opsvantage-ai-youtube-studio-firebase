import { SubscriptionStore } from '../../models/Subscription'
export default function handler(req, res) {
  const { userId } = req.query
  const sub = SubscriptionStore.find((s) => s.userId === userId)
  res.status(200).json(sub || null)
}
//# sourceMappingURL=get.js.map
