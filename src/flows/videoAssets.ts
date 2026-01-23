import { defineFlow } from '@genkit-ai/flow';
import * as z from 'zod';
import * as admin from 'firebase-admin';
import { VideoGenerationService } from '../services/video-generation.service';

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

export const generateVideoAssetsFlow = defineFlow(
  {
    name: 'generateVideoAssets',
    inputSchema: z.object({
      scriptId: z.string(),
      style: z.string().optional().default('cinematic'),
      provider: z.enum(['pika', 'runway', 'd-id']).optional().default('pika')
    }),
    outputSchema: z.object({
      clipPaths: z.array(z.string()),
    }),
    authPolicy: (auth: any, input: any) => {},
  },
  async (input) => {
    // Fetch script from Firestore
    const scriptDoc = await db.collection('scripts').doc(input.scriptId).get();
    if (!scriptDoc.exists) {
      throw new Error(`Script with ID ${input.scriptId} not found`);
    }

    const scriptData = scriptDoc.data();
    if (!scriptData) {
      throw new Error(`Script data not found for ID ${input.scriptId}`);
    }

    // Get video generation configuration from Firestore
    // This could be stored in a global config or per-project config
    const configDoc = await db.collection('integrationConfigs').doc('global').get();
    let videoApiKey = process.env.VIDEO_GENERATION_API_KEY || '';
    let provider: 'pika' | 'runway' | 'd-id' | 'heygen' = input.provider as any;

    if (configDoc.exists) {
      const config = configDoc.data();
      if (config?.video?.apiKey) {
        videoApiKey = config.video.apiKey;
      }
      if (config?.video?.provider) {
        provider = config.video.provider;
      }
    }

    // Initialize video generation service
    const videoGenService = new VideoGenerationService({
      provider,
      apiKey: videoApiKey,
    });

    try {
      // Generate video from script
      const videoPath = await videoGenService.generateVideoFromScript(input.scriptId, input.style);

      // In a real implementation, we might split the video into clips
      // For now, we'll return the single video as a clip
      const clipPaths = [videoPath];

      // Update video record with generated asset path
      // We need to find the video associated with this script
      const videoDocs = await db.collection('videos').where('scriptId', '==', input.scriptId).limit(1).get();
      if (!videoDocs.empty) {
        const videoDoc = videoDocs.docs[0];
        await videoDoc.ref.update({
          videoPath: videoPath,
          status: 'assets_generated',
          updatedAt: new Date().toISOString(),
        });
      }

      console.log(`Generated video assets for script: ${input.scriptId}`);

      return {
        clipPaths,
      };
    } catch (error) {
      console.error('Error generating video assets:', error);

      // Update video status to failed
      const videoDocs = await db.collection('videos').where('scriptId', '==', input.scriptId).limit(1).get();
      if (!videoDocs.empty) {
        const videoDoc = videoDocs.docs[0];
        await videoDoc.ref.update({
          status: 'failed',
          updatedAt: new Date().toISOString(),
        });
      }

      throw error;
    }
  }
);