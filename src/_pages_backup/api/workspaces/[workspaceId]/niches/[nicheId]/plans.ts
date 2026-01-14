import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { generateContentPlan } from '@/lib/aiEngine';

// POST /api/workspaces/[workspaceId]/niches/[nicheId]/plans
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { workspaceId, nicheId } = req.query;
  const { timeframe, days } = req.body;
  if (!workspaceId || !nicheId || !timeframe) return res.status(400).json({ error: 'Missing params' });

  // Determine number of days
  let numDays = 7;
  if (timeframe === 'monthly') numDays = 30;
  if (timeframe === 'custom' && days) numDays = days;

  // Load niche name from DB and generate hooks
  const niche = await prisma.niche.findUnique({ where: { id: String(nicheId) } });
  if (!niche) return res.status(404).json({ error: 'Niche not found' });
  const hooks = await generateContentPlan(niche.name, numDays);

  // Create ContentPlan and ShortVideos
  const contentPlan = await prisma.contentPlan.create({
    data: {
      workspaceId: workspaceId as string,
      nicheId: nicheId as string,
      timeframe,
      startDate: new Date(),
      endDate: new Date(Date.now() + numDays * 24 * 60 * 60 * 1000),
      shortVideos: {
        create: hooks.map(hook => ({
          workspaceId: workspaceId as string,
          nicheId: nicheId as string,
          dayIndex: hook.dayIndex,
          hook: hook.hook,
          title: '',
          script: '',
          hashtags: '',
          status: 'idea',
        })),
      },
    },
    include: { shortVideos: true },
  });

  res.status(201).json(contentPlan);
}
