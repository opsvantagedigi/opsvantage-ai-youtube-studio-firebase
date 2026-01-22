import { defineFlow } from '@genkit-ai/flow';
import * as z from 'zod';
import { gemini15Pro } from '@genkit-ai/googleai';
import { generate } from '@genkit-ai/ai';
import { ContentPlanSchema } from '../models/contentPlan';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

export const generateContentPlanFlow = defineFlow(
  {
    name: 'generateContentPlan',
    inputSchema: z.object({ projectId: z.string() }),
    outputSchema: ContentPlanSchema,
    authPolicy: (auth: any, input: any) => {},
  },
  async (input) => {
    const projectDoc = await db.collection('projects').doc(input.projectId).get();
    const projectData = projectDoc.data();

    if (!projectData) {
      throw new Error('Project not found');
    }

    const niche = projectData.niche;

    const prompt = `Generate a content plan with 10 video ideas for a YouTube channel in the niche of ${niche}.`;

    await generate({ 
        model: gemini15Pro,
        prompt: prompt,
        config: { temperature: 0.7 },
    });

    // TODO: Implement the logic to parse the planText and generate the other fields of the ContentPlan schema.
    const plan = {
      projectId: input.projectId,
      status: 'active' as const,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return plan;
  }
);
