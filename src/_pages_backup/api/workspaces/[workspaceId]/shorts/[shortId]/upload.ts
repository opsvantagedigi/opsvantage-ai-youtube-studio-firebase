import type { NextApiRequest, NextApiResponse } from 'next';
import { uploadShort } from '@/lib/youtube';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { workspaceId, shortId } = req.query;
  if (!workspaceId || !shortId) return res.status(400).json({ error: 'Missing params' });
  // Check YouTube config exists for workspace
  const config = await prisma.youTubeChannelConfig.findFirst({ where: { workspaceId: String(workspaceId) } });
  if (!config || !config.youtubeAccessToken) {
    return res.status(400).json({ error: 'YouTube not configured for this workspace' });
  }
  try {
    const url = await uploadShort(String(workspaceId), String(shortId));
    res.json({ success: true, url });
  } catch (err: any) {
    console.error('Upload failed:', err?.message || err);
    res.status(500).json({ error: err.message || 'upload failed' });
  }
}
