// youtube.service.ts
import { google, youtube_v3 } from 'googleapis';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export class YouTubeService {
  private youtube: youtube_v3.Youtube;
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor() {
    this.clientId = process.env.YOUTUBE_CLIENT_ID || '';
    this.clientSecret = process.env.YOUTUBE_CLIENT_SECRET || '';
    this.redirectUri = process.env.YOUTUBE_REDIRECT_URI || '';

    if (!this.clientId || !this.clientSecret) {
      throw new Error('YouTube OAuth credentials are required');
    }

    this.youtube = google.youtube({
      version: 'v3',
      auth: process.env.GOOGLE_API_KEY, // Using API key for public data access
    });
  }

  /**
   * Generate OAuth consent URL for YouTube account linking
   */
  generateAuthUrl(userId: string): string {
    const oauth2Client = new google.auth.OAuth2(
      this.clientId,
      this.clientSecret,
      this.redirectUri
    );

    const scopes = [
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube',
      'https://www.googleapis.com/auth/youtubepartner'
    ];

    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      state: userId, // Pass userId as state to identify user after callback
      include_granted_scopes: true,
    });

    return url;
  }

  /**
   * Process OAuth callback and save tokens to Firestore
   */
  async processOAuthCallback(code: string, userId: string): Promise<void> {
    const oauth2Client = new google.auth.OAuth2(
      this.clientId,
      this.clientSecret,
      this.redirectUri
    );

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Save tokens to Firestore for the user
    await db.collection('users').doc(userId).update({
      youtubeTokens: tokens,
      youtubeConnected: true,
      youtubeConnectedAt: new Date().toISOString(),
    });
  }

  /**
   * Get authenticated YouTube client for a specific user
   */
  private async getAuthenticatedClient(userId: string): Promise<youtube_v3.Youtube> {
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();

    if (!userData?.youtubeTokens) {
      throw new Error('User does not have YouTube connected');
    }

    const oauth2Client = new google.auth.OAuth2(
      this.clientId,
      this.clientSecret,
      this.redirectUri
    );
    
    oauth2Client.setCredentials(userData.youtubeTokens);

    // Refresh token if needed
    if (userData.youtubeTokens.refresh_token && !userData.youtubeTokens.expiry_date) {
      const refreshedTokens = await oauth2Client.refreshAccessToken();
      if (refreshedTokens.credentials) {
        await db.collection('users').doc(userId).update({
          'youtubeTokens': refreshedTokens.credentials,
        });
      }
    }

    return google.youtube({
      version: 'v3',
      auth: oauth2Client,
    });
  }

  /**
   * Upload video to YouTube
   */
  async uploadVideo(
    userId: string,
    videoBuffer: Buffer,
    metadata: {
      title: string;
      description: string;
      tags?: string[];
      categoryId?: string;
      privacyStatus?: 'public' | 'private' | 'unlisted';
    }
  ): Promise<string> {
    const youtube = await this.getAuthenticatedClient(userId);

    const response = await youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title: metadata.title,
          description: metadata.description,
          tags: metadata.tags,
          categoryId: metadata.categoryId || '22', // People & Blogs category
        },
        status: {
          privacyStatus: metadata.privacyStatus || 'public',
        },
      },
      media: {
        body: videoBuffer,
      },
    });

    const videoId = response.data.id;
    if (!videoId) {
      throw new Error('Failed to upload video: no video ID returned');
    }

    return videoId;
  }

  /**
   * Get YouTube channel info
   */
  async getChannelInfo(userId: string): Promise<any> {
    const youtube = await this.getAuthenticatedClient(userId);

    const response = await youtube.channels.list({
      part: ['snippet', 'statistics', 'contentDetails'],
      mine: true,
    });

    return response.data.items?.[0] || null;
  }

  /**
   * Get video analytics
   */
  async getVideoAnalytics(videoId: string): Promise<any> {
    // This would require additional setup with Google Analytics API
    // For now, we'll return basic stats from YouTube API
    const response = await this.youtube.videos.list({
      part: ['statistics', 'snippet'],
      id: [videoId],
    });

    return response.data.items?.[0] || null;
  }

  /**
   * Get channel analytics
   */
  async getChannelAnalytics(userId: string): Promise<any> {
    const youtube = await this.getAuthenticatedClient(userId);

    // Get channel info
    const channelResponse = await youtube.channels.list({
      part: ['statistics', 'contentDetails'],
      mine: true,
    });

    const channel = channelResponse.data.items?.[0];
    if (!channel) {
      throw new Error('Unable to retrieve channel information');
    }

    // Get recent videos
    const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads;
    if (!uploadsPlaylistId) {
      throw new Error('Unable to retrieve uploads playlist');
    }

    const playlistResponse = await youtube.playlistItems.list({
      part: ['snippet'],
      playlistId: uploadsPlaylistId,
      maxResults: 10, // Get last 10 videos
    });

    const videoIds = playlistResponse.data.items?.map(item => item.snippet?.resourceId?.videoId).filter(Boolean) as string[];

    // Get statistics for these videos
    const statsResponse = await this.youtube.videos.list({
      part: ['statistics'],
      id: videoIds,
    });

    return {
      channelStats: channel.statistics,
      recentVideos: statsResponse.data.items,
    };
  }
}