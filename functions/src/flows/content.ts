import { defineFlow } from '@genkit-ai/flow';
import * as z from 'zod';
import { gemini15Pro } from '@genkit-ai/googleai';
import { generate } from '@genkit-ai/ai';
import * as admin from 'firebase-admin';
import { ScriptSchema } from '../models/script';
import { GENERATE_SCRIPT_SYSTEM_PROMPT, GENERATE_SCRIPT_PROMPT_TEMPLATE } from '../prompts';

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

export const generateScriptFlow = defineFlow(
  {
    name: 'generateScript',
    inputSchema: z.object({
      idea: z.string(),
      projectId: z.string(),
      planItemId: z.string().optional(),
    }),
    outputSchema: ScriptSchema,
    authPolicy: (auth: any, input: any) => {},
  },
  async (input) => {
    // Fetch project data to customize the script based on niche, tone, etc.
    const projectDoc = await db.collection('projects').doc(input.projectId).get();
    if (!projectDoc.exists) {
      throw new Error(`Project ${input.projectId} not found`);
    }

    const projectData = projectDoc.data();

    // If plan item ID is provided, fetch the specific content plan item
    let planItem = null;
    if (input.planItemId) {
      // Look for the content plan that contains this item
      const contentPlansSnapshot = await db
        .collection('contentPlans')
        .where('projectId', '==', input.projectId)
        .get();

      for (const doc of contentPlansSnapshot.docs) {
        const contentPlan = doc.data();
        const item = contentPlan.items.find((item: any) => item.id === input.planItemId);
        if (item) {
          planItem = item;
          break;
        }
      }
    }

    // Create a more detailed prompt for script generation
    // Limit project data fields to prevent large inputs
    const detailedPrompt = `
      Create a compelling YouTube script for the following:

      PROJECT DETAILS:
      - Niche: ${(projectData?.niche || 'N/A').substring(0, 100)}
      - Target Audience: ${(projectData?.targetAudience || 'N/A').substring(0, 100)}
      - Tone: ${(projectData?.tone || 'N/A').substring(0, 50)}
      - Language: ${(projectData?.language || 'N/A').substring(0, 20)}

      VIDEO CONCEPT:
      - Idea: ${input.idea.substring(0, 500)}
      ${planItem ? `- Planned Title: ${(planItem.title || '').substring(0, 100)}` : ''}

      REQUIREMENTS:
      1. Create an attention-grabbing hook within the first 15 seconds
      2. Structure the content with clear sections
      3. Include a strong call-to-action
      4. Optimize for ${projectData!.targetAudience?.substring(0, 100)} audience
      5. Match the ${projectData!.tone?.substring(0, 50)} tone

      OUTPUT FORMAT:
      Provide the response as a JSON object with the following structure:
      {
        "title": "Video title (under 100 characters)",
        "hook": "Opening hook (first 15 seconds)",
        "introduction": "Brief introduction",
        "mainSections": [
          {
            "sectionTitle": "Title for this section",
            "content": "Detailed content for this section",
            "durationEstimate": "Estimated duration in seconds"
          }
        ],
        "conclusion": "Strong conclusion with CTA",
        "seoTags": ["tag1", "tag2", "tag3"],
        "thumbnailText": "Suggested thumbnail text",
        "thumbnailVisual": "Visual description for thumbnail",
        "emotionalHook": "What emotional trigger does this video use?",
        "sceneDescriptions": [
          {
            "timestamp": "00:00",
            "description": "Scene description",
            "voiceText": "Exact text to be spoken"
          }
        ]
      }

      Make sure the script is engaging, informative, and optimized for YouTube algorithm.
    `;

    const llmResponse = await generate({
      model: gemini15Pro,
      prompt: detailedPrompt,
      config: { temperature: 0.8 },
    });

    // Extract JSON from response
    const responseText = llmResponse.text();
    const jsonStart = responseText.indexOf('{');
    const jsonEnd = responseText.lastIndexOf('}') + 1;
    let scriptData;

    if (jsonStart !== -1 && jsonEnd !== 0) {
      try {
        scriptData = JSON.parse(responseText.substring(jsonStart, jsonEnd));
      } catch (e) {
        console.error('Error parsing JSON from LLM response:', e);
        // Fallback to basic structure if JSON parsing fails
        scriptData = {
          title: input.idea,
          hook: "Let's dive into this topic.",
          introduction: input.idea,
          mainSections: [{ sectionTitle: "Main Content", content: input.idea, durationEstimate: 60 }],
          conclusion: "Thanks for watching!",
          seoTags: [input.idea],
          thumbnailText: input.idea,
          thumbnailVisual: "Generic visual",
          emotionalHook: "Information",
          sceneDescriptions: [{ timestamp: "00:00", description: "Intro", voiceText: "Let's start." }]
        };
      }
    } else {
      // Fallback if no JSON found in response
      scriptData = {
        title: input.idea,
        hook: "Let's dive into this topic.",
        introduction: input.idea,
        mainSections: [{ sectionTitle: "Main Content", content: input.idea, durationEstimate: 60 }],
        conclusion: "Thanks for watching!",
        seoTags: [input.idea],
        thumbnailText: input.idea,
        thumbnailVisual: "Generic visual",
        emotionalHook: "Information",
        sceneDescriptions: [{ timestamp: "00:00", description: "Intro", voiceText: "Let's start." }]
      };
    }

    // Construct the script object
    const script = {
      projectId: input.projectId,
      videoId: 'video_' + Math.random().toString(36).substring(7),
      scriptText: [
        scriptData.hook,
        scriptData.introduction,
        ...scriptData.mainSections.map((section: any) => section.content),
        scriptData.conclusion
      ].join('\n\n'),
      sceneBreakdown: scriptData.sceneDescriptions || [
        { timestamp: "00:00", description: "Intro", voiceText: scriptData.hook }
      ],
      seoMetadata: {
        title: scriptData.title,
        description: [
          scriptData.introduction,
          ...scriptData.mainSections.map((section: any) => section.content),
          scriptData.conclusion
        ].join('\n\n'),
        tags: scriptData.seoTags || [input.idea],
        chapters: scriptData.mainSections?.map((section: any, index: number) => ({
          timestamp: `${Math.floor(index * 30 / 60)}:${String(index * 30 % 60).padStart(2, '0')}`,
          title: section.sectionTitle
        })) || [],
        hashtags: scriptData.seoTags?.map((tag: string) => tag.replace(/\s+/g, '')) || [input.idea.replace(/\s+/g, '')],
      },
      thumbnailConcepts: [
        {
          headline: scriptData.thumbnailText,
          visualDescription: scriptData.thumbnailVisual,
          emotion: scriptData.emotionalHook,
          colors: "Bright, eye-catching colors",
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save the script to Firestore
    const scriptRef = await db.collection('scripts').add(script);

    // Also update the corresponding video document if plan item exists
    if (input.planItemId) {
      // Find the video associated with this plan item
      const videosSnapshot = await db
        .collection('videos')
        .where('planItemId', '==', input.planItemId)
        .where('projectId', '==', input.projectId)
        .get();

      if (!videosSnapshot.empty) {
        const videoDoc = videosSnapshot.docs[0];
        await db.collection('videos').doc(videoDoc.id).update({
          scriptId: scriptRef.id,
          status: 'script_generated'
        });
      }
    }

    return script;
  }
);
