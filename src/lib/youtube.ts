import { google } from 'googleapis';
import { prisma } from './prisma';

const oauth2ClientFactory = () => new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  process.env.YOUTUBE_REDIRECT_URI
);

export function getAuthUrl(workspaceId: string) {
  const oauth2Client = oauth2ClientFactory();
  const scopes = [
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube.readonly',
  ];
  return oauth2Client.generateAuthUrl({ access_type: 'offline', scope: scopes, state: workspaceId });
}

export async function handleOAuthCallback(code: string, workspaceId: string) {
  const oauth2Client = oauth2ClientFactory();
  const { tokens } = await oauth2Client.getToken(code);
  const existing = await prisma.youTubeChannelConfig.findFirst({ where: { workspaceId } });
  if (existing) {
    await prisma.youTubeChannelConfig.update({ where: { id: existing.id }, data: { youtubeAccessToken: tokens.access_token ?? '', youtubeRefreshToken: tokens.refresh_token ?? '', tokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : new Date() } });
    return existing;
  }
  return prisma.youTubeChannelConfig.create({ data: { workspaceId, channelName: 'YouTube', channelId: null, youtubeAccessToken: tokens.access_token ?? '', youtubeRefreshToken: tokens.refresh_token ?? '', tokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : new Date() } });
}

export async function uploadShort(workspaceId: string, shortVideoId: string) {
  const config = await prisma.youTubeChannelConfig.findFirst({ where: { workspaceId } });
  if (!config) throw new Error('YouTube config not found');

  // For now, mock upload and update DB
  const youtubeVideoId = `mocked-${shortVideoId}`;
  const youtubeUrl = `https://youtube.com/shorts/${youtubeVideoId}`;
  await prisma.shortVideo.update({ where: { id: shortVideoId }, data: { youtubeVideoId, youtubeUrl, status: 'uploaded', uploadedAt: new Date() } });
  return youtubeUrl;
}

export default { getAuthUrl, handleOAuthCallback, uploadShort };
