import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { generateScriptForHook } from '@/lib/aiEngine';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { workspaceId, shortId } = req.query;
  if (!workspaceId || !shortId) return res.status(400).json({ error: 'Missing params' });

  const short = await prisma.shortVideo.findUnique({ where: { id: String(shortId) }, include: { niche: true } });
  if (!short) return res.status(404).json({ error: 'Short not found' });

  try {
    const nicheName = short.niche?.name ?? 'General';
    const result = await generateScriptForHook(nicheName, short.hook);
    await prisma.shortVideo.update({
      where: { id: short.id },
      data: { title: result.title, script: result.script, hashtags: result.hashtags.join(' '), status: 'scripted' },
    });
    return res.json({ success: true, shortId: short.id, result });
  } catch (err: any) {
    console.error('AI generation failed:', err?.message || err);
    return res.status(500).json({ error: 'AI generation failed' });
  }
}
