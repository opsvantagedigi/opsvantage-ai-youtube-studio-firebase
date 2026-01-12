import type { NextApiRequest, NextApiResponse } from 'next';
import { handleOAuthCallback } from '@/lib/youtube';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();
  const { code, state } = req.query; // state is workspaceId
  if (!code || !state) return res.status(400).send('Missing code or state');
  try {
    await handleOAuthCallback(String(code), String(state));
    res.send('YouTube connected successfully. You can close this window.');
  } catch (err) {
    console.error(err);
    res.status(500).send('OAuth handling failed');
  }
}
