import { defineFlow } from '@genkit-ai/flow';
import * as z from 'zod';
import { gemini15Pro } from '@genkit-ai/googleai';
import { generate } from '@genkit-ai/ai';
import { ContentPlanSchema } from '../models/contentPlan';
import * as admin from 'firebase-admin';
import { GENERATE_CONTENT_PLAN_SYSTEM_PROMPT, GENERATE_CONTENT_PLAN_PROMPT_TEMPLATE } from '../prompts';

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

    const prompt = `${GENERATE_CONTENT_PLAN_SYSTEM_PROMPT}\n${GENERATE_CONTENT_PLAN_PROMPT_TEMPLATE.replace('{idea}', niche)}`;

    const llmResponse = await generate({ 
        model: gemini15Pro,
        prompt: prompt,
        config: { temperature: 0.7 },
    });
    const contentPlanData = JSON.parse(llmResponse.text());

    const planId = db.collection('contentPlans').doc().id;
    const plan = {
      id: planId,
      projectId: input.projectId,
      status: 'active' as const,
      items: contentPlanData.content_plan,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.collection('contentPlans').doc(planId).set(plan);
    await db.collection('projects').doc(input.projectId).update({ contentPlanId: planId });

    return plan;
  }
);
