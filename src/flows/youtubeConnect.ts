import { defineFlow } from '@genkit-ai/flow';
import * as z from 'zod';
import * as admin from 'firebase-admin';
import { YouTubeService } from '../services/youtube.service';

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

export const connectYouTubeAccountFlow = defineFlow(
  {
    name: 'connectYouTubeAccount',
    inputSchema: z.object({ 
      userId: z.string()
    }),
    outputSchema: z.object({
      authUrl: z.string(),
    }),
    authPolicy: (auth: any, input: any) => {},
  },
  async (input) => {
    const youtubeService = new YouTubeService();
    const authUrl = youtubeService.generateAuthUrl(input.userId);
    
    // Update user record to indicate they've initiated YouTube connection
    await db.collection('users').doc(input.userId).update({
      youtubeConnectionInitiated: true,
      youtubeConnectionInitiatedAt: new Date().toISOString(),
    });
    
    return {
      authUrl,
    };
  }
);