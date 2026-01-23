import { defineFlow } from '@genkit-ai/flow';
import * as z from 'zod';
import * as admin from 'firebase-admin';
import { MonetisationProfileSchema } from '../models/monetisationProfile';

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

export const createMonetisationProfileFlow = defineFlow(
  {
    name: 'createMonetisationProfile',
    inputSchema: MonetisationProfileSchema.omit({ createdAt: true, updatedAt: true }), // Exclude timestamps since they'll be set by the server
    outputSchema: MonetisationProfileSchema,
    authPolicy: (auth: any, input: any) => {},
  },
  async (input) => {
    const {
      projectId,
      affiliatePrograms,
      digitalProducts,
      emailProvider,
      emailListId,
    } = input;

    // Verify project exists and belongs to user
    const projectDoc = await db.collection('projects').doc(projectId).get();
    if (!projectDoc.exists) {
      throw new Error(`Project with ID ${projectId} not found`);
    }

    // In a real implementation, you would verify that the authenticated user owns this project
    // For now, we'll skip this check
    // const projectData = projectDoc.data();

    // Create or update the monetization profile
    const profileRef = db.collection('monetisationProfiles').doc(projectId);
    const now = new Date().toISOString();
    
    const profileData = {
      projectId,
      affiliatePrograms: affiliatePrograms || [],
      digitalProducts: digitalProducts || [],
      emailProvider: emailProvider || 'none',
      emailListId: emailListId || null,
      createdAt: now,
      updatedAt: now,
    };

    await profileRef.set(profileData);

    console.log(`Created/updated monetization profile for project: ${projectId}`);

    return profileData;
  }
);

export const getMonetisationProfileFlow = defineFlow(
  {
    name: 'getMonetisationProfile',
    inputSchema: z.object({
      projectId: z.string(),
    }),
    outputSchema: MonetisationProfileSchema.optional(), // Optional since profile might not exist
    authPolicy: (auth: any, input: any) => {},
  },
  async (input) => {
    const { projectId } = input;

    const profileDoc = await db.collection('monetisationProfiles').doc(projectId).get();
    
    if (!profileDoc.exists) {
      console.log(`No monetization profile found for project: ${projectId}`);
      return undefined;
    }

    const profileData = profileDoc.data();
    console.log(`Retrieved monetization profile for project: ${projectId}`);

    // Return the data in the expected format
    if (profileData) {
      return {
        projectId: profileData.projectId,
        affiliatePrograms: profileData.affiliatePrograms || [],
        digitalProducts: profileData.digitalProducts || [],
        emailProvider: profileData.emailProvider || 'none',
        emailListId: profileData.emailListId || null,
        createdAt: profileData.createdAt,
        updatedAt: profileData.updatedAt,
      };
    } else {
      return undefined;
    }
  }
);