import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { workspaceId, nicheId } = req.query;
  if (!workspaceId || !nicheId) return res.status(400).json({ error: 'Missing params' });

  if (req.method === 'DELETE') {
    await prisma.niche.delete({ where: { id: String(nicheId) } });
    return res.json({ success: true });
  }

  if (req.method === 'PUT') {
    const { name, description, isActive } = req.body;
    const updated = await prisma.niche.update({ where: { id: String(nicheId) }, data: { name, description, isActive } });
    return res.json(updated);
  }

  return res.status(405).end();
}
