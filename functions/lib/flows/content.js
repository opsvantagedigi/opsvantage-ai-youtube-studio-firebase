"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateScriptFlow = void 0;
const flow_1 = require("@genkit-ai/flow");
const z = __importStar(require("zod"));
const googleai_1 = require("@genkit-ai/googleai");
const ai_1 = require("@genkit-ai/ai");
const admin = __importStar(require("firebase-admin"));
const script_1 = require("../models/script");
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();
exports.generateScriptFlow = (0, flow_1.defineFlow)({
    name: 'generateScript',
    inputSchema: z.object({
        idea: z.string(),
        projectId: z.string(),
        planItemId: z.string().optional(),
    }),
    outputSchema: script_1.ScriptSchema,
    authPolicy: (auth, input) => { },
}, async (input) => {
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
            const item = contentPlan.items.find((item) => item.id === input.planItemId);
            if (item) {
                planItem = item;
                break;
            }
        }
    }
    // Create a more detailed prompt for script generation
    const detailedPrompt = `
      Create a compelling YouTube script for the following:

      PROJECT DETAILS:
      - Niche: ${projectData.niche}
      - Target Audience: ${projectData.targetAudience}
      - Tone: ${projectData.tone}
      - Language: ${projectData.language}

      VIDEO CONCEPT:
      - Idea: ${input.idea}
      ${planItem ? `- Planned Title: ${planItem.title}` : ''}

      REQUIREMENTS:
      1. Create an attention-grabbing hook within the first 15 seconds
      2. Structure the content with clear sections
      3. Include a strong call-to-action
      4. Optimize for ${projectData.targetAudience} audience
      5. Match the ${projectData.tone} tone

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
    const llmResponse = await (0, ai_1.generate)({
        model: googleai_1.gemini15Pro,
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
        }
        catch (e) {
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
    }
    else {
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
            ...scriptData.mainSections.map((section) => section.content),
            scriptData.conclusion
        ].join('\n\n'),
        sceneBreakdown: scriptData.sceneDescriptions || [
            { timestamp: "00:00", description: "Intro", voiceText: scriptData.hook }
        ],
        seoMetadata: {
            title: scriptData.title,
            description: [
                scriptData.introduction,
                ...scriptData.mainSections.map((section) => section.content),
                scriptData.conclusion
            ].join('\n\n'),
            tags: scriptData.seoTags || [input.idea],
            chapters: scriptData.mainSections?.map((section, index) => ({
                timestamp: `${Math.floor(index * 30 / 60)}:${String(index * 30 % 60).padStart(2, '0')}`,
                title: section.sectionTitle
            })) || [],
            hashtags: scriptData.seoTags?.map((tag) => tag.replace(/\s+/g, '')) || [input.idea.replace(/\s+/g, '')],
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
});
