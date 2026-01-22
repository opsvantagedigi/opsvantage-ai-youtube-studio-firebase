import { defineFlow } from '@genkit-ai/flow';
import * as z from 'zod';
import * as admin from 'firebase-admin';
import { VideoEditingService } from '../services/video-editing.service';

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

export const assembleFinalVideoFlow = defineFlow(
  {
    name: 'assembleFinalVideo',
    inputSchema: z.object({
      videoId: z.string()
    }),
    outputSchema: z.object({
      finalVideoPath: z.string(),
    }),
    authPolicy: (auth: any, input: any) => {},
  },
  async (input) => {
    // Fetch video record from Firestore
    const videoDoc = await db.collection('videos').doc(input.videoId).get();
    if (!videoDoc.exists) {
      throw new Error(`Video with ID ${input.videoId} not found`);
    }

    const videoData = videoDoc.data();
    if (!videoData) {
      throw new Error(`Video data not found for ID ${input.videoId}`);
    }

    // Get the video clips and audio path
    // In a real implementation, these would be stored in the video record
    const clips: string[] = videoData.clipPaths || [];
    const audioPath = videoData.voiceoverPath; // Assuming this is where the voiceover is stored

    if (!audioPath) {
      throw new Error(`Audio path not found for video ${input.videoId}`);
    }

    // Initialize video editing service
    const videoEditService = new VideoEditingService();

    try {
      // Assemble the final video
      const outputPath = `gs://final-videos-bucket/${input.videoId}_final.mp4`;
      const finalVideoPath = await videoEditService.assembleVideo(clips, audioPath, outputPath);

      // Update video record with final video path
      await videoDoc.ref.update({
        videoPath: finalVideoPath, // Update the main video path to the final version
        status: 'ready',
        updatedAt: new Date().toISOString(),
      });

      console.log(`Assembled final video for video ID: ${input.videoId}`);

      return {
        finalVideoPath,
      };
    } catch (error) {
      console.error('Error assembling final video:', error);

      // Update video status to failed
      await videoDoc.ref.update({
        status: 'failed',
        updatedAt: new Date().toISOString(),
      });

      throw error;
    }
  }
);