"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.YouTubeService = void 0;
// youtube.service.ts
const googleapis_1 = require("googleapis");
const admin = __importStar(require("firebase-admin"));
const db = admin.firestore();
class YouTubeService {
    constructor() {
        this.clientId = process.env.YOUTUBE_CLIENT_ID || '';
        this.clientSecret = process.env.YOUTUBE_CLIENT_SECRET || '';
        this.redirectUri = process.env.YOUTUBE_REDIRECT_URI || '';
        if (!this.clientId || !this.clientSecret) {
            throw new Error('YouTube OAuth credentials are required');
        }
        this.youtube = googleapis_1.google.youtube({
            version: 'v3',
            auth: process.env.GOOGLE_API_KEY, // Using API key for public data access
        });
    }
    /**
     * Generate OAuth consent URL for YouTube account linking
     */
    generateAuthUrl(userId) {
        const oauth2Client = new googleapis_1.google.auth.OAuth2(this.clientId, this.clientSecret, this.redirectUri);
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
    async processOAuthCallback(code, userId) {
        const oauth2Client = new googleapis_1.google.auth.OAuth2(this.clientId, this.clientSecret, this.redirectUri);
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
    async getAuthenticatedClient(userId) {
        const userDoc = await db.collection('users').doc(userId).get();
        const userData = userDoc.data();
        if (!userData?.youtubeTokens) {
            throw new Error('User does not have YouTube connected');
        }
        const oauth2Client = new googleapis_1.google.auth.OAuth2(this.clientId, this.clientSecret, this.redirectUri);
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
        return googleapis_1.google.youtube({
            version: 'v3',
            auth: oauth2Client,
        });
    }
    /**
     * Upload video to YouTube
     */
    async uploadVideo(userId, videoBuffer, metadata) {
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
    async getChannelInfo(userId) {
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
    async getVideoAnalytics(videoId) {
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
    async getChannelAnalytics(userId) {
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
        const videoIds = playlistResponse.data.items?.map(item => item.snippet?.resourceId?.videoId).filter(Boolean);
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
exports.YouTubeService = YouTubeService;
