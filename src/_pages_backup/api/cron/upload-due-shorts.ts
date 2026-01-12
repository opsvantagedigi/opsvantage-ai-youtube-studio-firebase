import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { uploadShort } from '@/lib/youtube';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const now = new Date();
  const due = await prisma.shortVideo.findMany({
    where: {
      status: 'ready_to_upload',
      scheduledAt: { lte: now },
    },
  });

  const results: Array<{ id: string; success: boolean; url?: string; error?: string }> = [];
  for (const s of due) {
    try {
      const url = await uploadShort(s.workspaceId, s.id);
      results.push({ id: s.id, success: true, url });
    } catch (err: any) {
      results.push({ id: s.id, success: false, error: err.message });
    }
  }
  res.json({ processed: results.length, results });
}
