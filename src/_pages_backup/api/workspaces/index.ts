import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();
  const workspaces = await prisma.workspace.findMany({
    include: { niches: true, contentPlans: { include: { shortVideos: true } } },
  });
  res.json(workspaces);
}
