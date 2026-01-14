import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { workspaceId } = req.query;
  if (!workspaceId) return res.status(400).json({ error: 'Missing workspaceId' });

  if (req.method === 'GET') {
    const niches = await prisma.niche.findMany({ where: { workspaceId: String(workspaceId) } });
    return res.json(niches);
  }

  if (req.method === 'POST') {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });
    const niche = await prisma.niche.create({ data: { workspaceId: String(workspaceId), name, description: description || '' } });
    return res.status(201).json(niche);
  }

  return res.status(405).end();
}
