import { defineFlow } from '@genkit-ai/flow';
import * as z from 'zod';
import * as admin from 'firebase-admin';
import { YouTubeService } from '../services/youtube.service';

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

export const handleYouTubeAuthCallbackFlow = defineFlow(
  {
    name: 'handleYouTubeAuthCallback',
    inputSchema: z.object({ 
      code: z.string(),
      state: z.string(), // userId
    }),
    outputSchema: z.void(),
    authPolicy: (auth: any, input: any) => {},
  },
  async (input) => {
    const { code, state: userId } = input;
    
    const youtubeService = new YouTubeService();
    await youtubeService.processOAuthCallback(code, userId);
    
    // Update project with connected YouTube channel ID
    // First, get the user's default project
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();
    
    if (userData?.defaultProjectId) {
      const channelInfo = await youtubeService.getChannelInfo(userId);
      if (channelInfo?.id) {
        await db.collection('projects').doc(userData.defaultProjectId).update({
          connectedYouTubeChannelId: channelInfo.id,
        });
      }
    }
  }
);