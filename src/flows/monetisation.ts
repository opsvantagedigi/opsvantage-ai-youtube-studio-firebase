import { defineFlow } from '@genkit-ai/flow';
import * as z from 'zod';
import * as admin from 'firebase-admin';
import { gemini15Pro } from '@genkit-ai/googleai';
import { generate } from '@genkit-ai/ai';

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

export const generateMonetisationPlanFlow = defineFlow(
  {
    name: 'generateMonetisationPlan',
    inputSchema: z.object({
      videoId: z.string()
    }),
    outputSchema: z.object({
      monetisationPlan: z.object({
        affiliateLinks: z.array(z.string()),
        digitalProducts: z.array(z.string()),
        emailCapturePoints: z.array(z.string()),
        callToActions: z.array(z.string()),
        monetisationStrategy: z.string(),
        trackingUrls: z.record(z.string(), z.string()),
      }),
    }),
    authPolicy: (auth: any, input: any) => {},
  },
  async (input) => {
    // Fetch video, script and monetization profile from Firestore
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

    // Fetch script for content analysis
    const scriptDoc = await db.collection('scripts').where('videoId', '==', input.videoId).limit(1).get();
    let scriptData = null;
    if (!scriptDoc.empty) {
      scriptData = scriptDoc.docs[0].data();
    }

    // Fetch monetization profile for the project
    const monetisationProfileDoc = await db.collection('monetisationProfiles').doc(projectId).get();
    let monetisationProfile = null;
    if (monetisationProfileDoc.exists) {
      monetisationProfile = monetisationProfileDoc.data();
    }

    // Generate monetization plan using AI
    let monetisationPrompt = `Create a monetization plan for a YouTube video. `;

    if (scriptData) {
      monetisationPrompt += `The video content is about: "${scriptData.seoMetadata?.title}". `;
      monetisationPrompt += `The script includes: "${scriptData.scriptText.substring(0, 200)}...". `;
    }

    if (monetisationProfile) {
      monetisationPrompt += `The creator has these affiliate programs: ${JSON.stringify(monetisationProfile.affiliatePrograms)}. `;
      monetisationPrompt += `They offer these digital products: ${JSON.stringify(monetisationProfile.digitalProducts)}. `;
    }

    monetisationPrompt += `Provide specific recommendations for: affiliate links, digital products to promote, email capture points in the video, call-to-actions, and monetization strategy.`;

    try {
      const llmResponse = await generate({
        model: gemini15Pro,
        prompt: monetisationPrompt,
        config: { temperature: 0.7 },
      });

      // Parse the AI response (in a real implementation, we'd have structured output)
      const aiResponse = llmResponse.text();

      // For now, we'll create a basic monetization plan based on the profile if available
      const affiliateLinks = monetisationProfile?.affiliatePrograms?.map((prog: any) =>
        `${prog.baseUrl}?ref=video_${input.videoId}`
      ) || [];

      const digitalProducts = monetisationProfile?.digitalProducts?.map((prod: any) => prod.id) || [];

      // Create tracking URLs with UTM parameters
      const trackingUrls: Record<string, string> = {};
      affiliateLinks.forEach((link: string, idx: number) => {
        trackingUrls[`affiliate_link_${idx+1}`] = `${link}&utm_source=youtube&utm_medium=video&utm_campaign=video_${input.videoId}`;
      });

      // Update video record with monetization status
      await videoDoc.ref.update({
        monetisationStatus: 'monetized',
        updatedAt: new Date().toISOString(),
      });

      console.log(`Generated monetization plan for video ID: ${input.videoId}`);

      return {
        monetisationPlan: {
          affiliateLinks,
          digitalProducts,
          emailCapturePoints: ['00:30', '02:15', 'end_screen'], // Default positions
          callToActions: [
            'Subscribe for more tips',
            'Check out our course',
            'Use our recommended tools (link below)'
          ],
          monetisationStrategy: aiResponse.substring(0, 500) + '...', // First 500 chars of AI response
          trackingUrls,
        },
      };
    } catch (error) {
      console.error('Error generating monetization plan:', error);

      // Update video status to failed
      await videoDoc.ref.update({
        monetisationStatus: 'failed',
        updatedAt: new Date().toISOString(),
      });

      throw error;
    }
  }
);