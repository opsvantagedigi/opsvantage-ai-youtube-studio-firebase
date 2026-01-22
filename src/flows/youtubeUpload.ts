import { defineFlow } from '@genkit-ai/flow';
import * as z from 'zod';
import * as admin from 'firebase-admin';
import { YouTubeService } from '../services/youtube.service';
import { hasVideoCredit, deductVideoCredit } from '../utils/subscription.utils';
import { gemini15Pro } from '@genkit-ai/googleai';
import { generate } from '@genkit-ai/ai';

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const bucket = admin.storage().bucket(); // Get Firebase Storage bucket

export const uploadToYouTubeFlow = defineFlow(
  {
    name: 'uploadToYouTube',
    inputSchema: z.object({
      videoId: z.string()
    }),
    outputSchema: z.object({
      youtubeVideoId: z.string(),
    }),
    authPolicy: (auth: any, input: any) => {},
  },
  async (input) => {
    // Fetch video and project data from Firestore
    const videoDoc = await db.collection('videos').doc(input.videoId).get();
    if (!videoDoc.exists) {
      throw new Error(`Video with ID ${input.videoId} not found`);
    }

    const videoData = videoDoc.data();
    if (!videoData) {
      throw new Error(`Video data not found for ID ${input.videoId}`);
    }

    const projectId = videoData.projectId;
    if (!projectId) {
      throw new Error(`Project ID not found for video ${input.videoId}`);
    }

    const projectDoc = await db.collection('projects').doc(projectId).get();
    if (!projectDoc.exists) {
      throw new Error(`Project with ID ${projectId} not found`);
    }

    const projectData = projectDoc.data();
    if (!projectData) {
      throw new Error(`Project data not found for ID ${projectId}`);
    }

    const userId = projectData.userId;
    if (!userId) {
      throw new Error(`User ID not found for project ${projectId}`);
    }

    // Check if user has sufficient video credits
    if (!(await hasVideoCredit(userId))) {
      throw new Error('Insufficient video credits for upload');
    }

    // Fetch script for metadata
    const scriptDoc = await db.collection('scripts').where('videoId', '==', input.videoId).limit(1).get();
    let scriptData = null;
    if (!scriptDoc.empty) {
      scriptData = scriptDoc.docs[0].data();
    }

    // Download video file from Firebase Storage
    const videoPath = videoData.videoPath; // gs://bucket-name/final_videos/videoId_final.mp4
    if (!videoPath) {
      throw new Error('Video file path not found');
    }

    // Extract bucket name and file path from the gs:// URL
    const gsRegex = /^gs:\/\/([^\/]+)\/(.+)$/;
    const match = videoPath.match(gsRegex);

    if (!match) {
      throw new Error(`Invalid video path format: ${videoPath}`);
    }

    const [, bucketName, filePath] = match;
    const file = admin.storage().bucket(bucketName).file(filePath);

    // Download the video file
    const [buffer] = await file.download();

    if (!buffer || buffer.length === 0) {
      throw new Error('Failed to download video file from Firebase Storage');
    }

    // Initialize YouTube service
    const youtubeService = new YouTubeService();

    // Prepare video metadata - enhance with Gemini optimization
    let metadata = {
      title: scriptData?.seoMetadata?.title || `Video ${input.videoId}`,
      description: scriptData?.seoMetadata?.description || `Automatically generated video for project ${projectId}`,
      tags: scriptData?.seoMetadata?.tags || [],
      privacyStatus: 'public' as const,
      categoryId: '22', // People & Blogs category, could be customized per niche
    };

    // Use Gemini to optimize the metadata for better reach and engagement
    try {
      const optimizationPrompt = `
        Optimize the following YouTube video metadata for maximum reach, engagement, and searchability:

        CURRENT TITLE: ${metadata.title}
        CURRENT DESCRIPTION: ${metadata.description}
        CURRENT TAGS: ${metadata.tags.join(', ')}

        PROJECT NICHE: ${projectData.niche}
        TARGET AUDIENCE: ${projectData.targetAudience}
        VIDEO SCRIPT: ${scriptData?.scriptText?.substring(0, 500)}...

        Please provide:
        1. An improved title (under 100 characters, clickbait-friendly but honest)
        2. An improved description (includes timestamps, call-to-action, relevant links)
        3. 10-15 optimized tags for searchability
        4. Suggested category ID based on the niche

        Respond in JSON format with keys: title, description, tags, categoryId
      `;

      const optimizationResponse = await generate({
        model: gemini15Pro,
        prompt: optimizationPrompt,
        config: { temperature: 0.6 },
      });

      // Extract JSON from response
      const responseText = optimizationResponse.text();
      const jsonStart = responseText.indexOf('{');
      const jsonEnd = responseText.lastIndexOf('}') + 1;

      if (jsonStart !== -1 && jsonEnd !== 0) {
        try {
          const optimizedMetadata = JSON.parse(responseText.substring(jsonStart, jsonEnd));

          metadata = {
            ...metadata,
            title: optimizedMetadata.title || metadata.title,
            description: optimizedMetadata.description || metadata.description,
            tags: optimizedMetadata.tags || metadata.tags,
            categoryId: optimizedMetadata.categoryId || metadata.categoryId,
          };
        } catch (e) {
          console.error('Error parsing optimized metadata from Gemini:', e);
          // Continue with original metadata if parsing fails
        }
      }
    } catch (e) {
      console.error('Error optimizing metadata with Gemini:', e);
      // Continue with original metadata if Gemini fails
    }

    try {
      // Upload video to YouTube
      const youtubeVideoId = await youtubeService.uploadVideo(
        userId,
        buffer,
        metadata
      );

      // Deduct video credit from user's subscription
      await deductVideoCredit(userId);

      // Update video record with YouTube video ID
      await db.collection('videos').doc(input.videoId).update({
        youtubeVideoId,
        publishedAt: new Date().toISOString(),
        status: 'uploaded',
        updatedAt: new Date().toISOString(),
      });

      console.log(`Successfully uploaded video to YouTube. Video ID: ${youtubeVideoId}`);

      return {
        youtubeVideoId,
      };
    } catch (error) {
      console.error('Error uploading video to YouTube:', error);

      // Update video status to failed
      await db.collection('videos').doc(input.videoId).update({
        status: 'failed',
        updatedAt: new Date().toISOString(),
      });

      throw error;
    }
  }
);