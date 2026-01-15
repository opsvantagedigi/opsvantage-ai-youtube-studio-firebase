import type { NextApiRequest, NextApiResponse } from 'next'
import { AuditLogStore } from '../../models/AuditLog'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { userId, action, metadata } = req.body
  if (!userId || !action) return res.status(400).json({ error: 'Missing fields' })
  AuditLogStore.push({
    id: `${userId}-${Date.now()}`,
    userId,
    action,
    metadata,
    timestamp: new Date().toISOString(),
  })
  res.status(200).json({ success: true })
}
