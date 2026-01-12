import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// This endpoint handles the YouTube OAuth callback
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const workspaceId = searchParams.get('state');
  if (!code || !workspaceId) return NextResponse.redirect('/app');
  // Exchange code for tokens
  const tokenResp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/youtube/oauth/callback`,
      grant_type: 'authorization_code',
    }),
  });
  const tokenData = await tokenResp.json();
  if (!tokenData.access_token) return NextResponse.redirect('/app');
  // Fetch channel info
  const channelResp = await fetch('https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const channelData = await channelResp.json();
  const channel = channelData.items?.[0];
  if (!channel) return NextResponse.redirect('/app');
  // Store channel config
  await prisma.youTubeChannelConfig.create({
    data: {
      workspaceId,
      channelName: channel.snippet.title,
      channelId: channel.id,
      youtubeAccessToken: tokenData.access_token,
      youtubeRefreshToken: tokenData.refresh_token,
      tokenExpiry: new Date(Date.now() + tokenData.expires_in * 1000),
    },
  });
  return NextResponse.redirect(`/app/workspace/${workspaceId}/channels`);
}
