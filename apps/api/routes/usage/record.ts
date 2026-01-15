import type { NextApiRequest, NextApiResponse } from 'next'
import { UsageEventStore } from '../../models/UsageEvent'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { type, amount, userId, timestamp } = req.body
  if (!type || !amount || !userId || !timestamp)
    return res.status(400).json({ error: 'Missing fields' })
  UsageEventStore.push({
    id: `${userId}-${timestamp}`,
    userId,
    type,
    amount,
    timestamp,
  })
  res.status(200).json({ success: true })
}
