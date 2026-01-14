import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { workspaceId, shortId } = req.query;
  const { scheduledAt } = req.body as { scheduledAt?: string };
  if (!workspaceId || !shortId) return res.status(400).json({ error: 'Missing params' });

  const data: any = { status: 'ready_to_upload' };
  if (scheduledAt) data.scheduledAt = new Date(scheduledAt);

  const updated = await prisma.shortVideo.update({ where: { id: String(shortId) }, data });
  res.json({ success: true, updated });
}
