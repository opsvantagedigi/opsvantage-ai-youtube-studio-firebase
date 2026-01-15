import type { NextApiRequest, NextApiResponse } from 'next'
import { SubscriptionStore } from '../../models/Subscription'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query
  const sub = SubscriptionStore.find((s) => s.userId === userId)
  res.status(200).json(sub || null)
}
