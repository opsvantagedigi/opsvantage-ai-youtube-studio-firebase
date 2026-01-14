import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuthUrl } from '@/lib/youtube';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();
  const { workspaceId } = req.query;
  if (!workspaceId) return res.status(400).json({ error: 'Missing workspaceId' });
  const url = getAuthUrl(String(workspaceId));
  res.json({ url });
}
