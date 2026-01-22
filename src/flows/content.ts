import { defineFlow } from '@genkit-ai/flow';
import * as z from 'zod';
import { gemini15Pro } from '@genkit-ai/googleai';
import { generate } from '@genkit-ai/ai';
import { ScriptSchema } from '../models/script';
import { GENERATE_SCRIPT_SYSTEM_PROMPT, GENERATE_SCRIPT_PROMPT_TEMPLATE } from '../prompts';

export const generateScriptFlow = defineFlow(
  {
    name: 'generateScript',
    inputSchema: z.object({ idea: z.string(), projectId: z.string() }),
    outputSchema: ScriptSchema,
    authPolicy: (auth: any, input: any) => {},
  },
  async (input) => {
    const prompt = `${GENERATE_SCRIPT_SYSTEM_PROMPT}\n${GENERATE_SCRIPT_PROMPT_TEMPLATE.replace('{idea}', input.idea)}`;

    const llmResponse = await generate({ 
        model: gemini15Pro,
        prompt: prompt,
        config: { temperature: 0.7 },
    });
    const scriptData = JSON.parse(llmResponse.text());

    const script = {
      projectId: input.projectId,
      videoId: 'video_' + Math.random().toString(36).substring(7),
      scriptText: scriptData.main_points.join('\n'),
      sceneBreakdown: [],
      seoMetadata: {
        title: scriptData.title,
        description: scriptData.introduction,
        tags: [input.idea],
        chapters: [],
        hashtags: [input.idea],
      },
      thumbnailConcepts: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return script;
  }
);
