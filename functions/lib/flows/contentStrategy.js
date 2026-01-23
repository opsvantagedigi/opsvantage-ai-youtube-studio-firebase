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
exports.generateContentStrategyFlow = void 0;
const flow_1 = require("@genkit-ai/flow");
const z = __importStar(require("zod"));
const googleai_1 = require("@genkit-ai/googleai");
const ai_1 = require("@genkit-ai/ai");
const admin = __importStar(require("firebase-admin"));
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();
// Define the schema for content plan items
const ContentPlanItemSchema = z.object({
    id: z.string(),
    title: z.string(),
    targetKeywords: z.array(z.string()),
    estimatedDifficulty: z.enum(['low', 'medium', 'high']),
    format: z.enum(['long_form', 'shorts']),
    scheduledDate: z.string().nullable(),
    status: z.enum(['planned', 'in_progress', 'published']),
});
exports.generateContentStrategyFlow = (0, flow_1.defineFlow)({
    name: 'generateContentStrategy',
    inputSchema: z.object({
        userId: z.string(),
        projectId: z.string()
    }),
    outputSchema: z.object({
        nicheOptions: z.array(z.string()),
        contentPlan: z.array(ContentPlanItemSchema),
    }),
    authPolicy: (auth, input) => { },
}, async (input) => {
    // 1. Fetch project data from Firestore
    const projectDoc = await db.collection('projects').doc(input.projectId).get();
    if (!projectDoc.exists) {
        throw new Error(`Project ${input.projectId} not found`);
    }
    const projectData = projectDoc.data();
    // 2. Fetch channel data from YouTube API (if connected)
    let channelData = null;
    if (projectData.connectedYouTubeChannelId) {
        // This would require YouTube service implementation
        // For now, we'll skip this step and focus on niche analysis
    }
    // 3. Call Gemini for niche analysis
    const nicheAnalysisPrompt = `
      Analyze the following YouTube project details and suggest 3-5 profitable niche options:

      Project Name: ${projectData.name}
      Current Niche: ${projectData.niche}
      Target Audience: ${projectData.targetAudience}
      Language: ${projectData.language}
      Tone: ${projectData.tone}

      For each niche option, provide:
      1. The niche name
      2. Why it's profitable
      3. Target audience characteristics
      4. Potential content themes
    `;
    const nicheAnalysisResponse = await (0, ai_1.generate)({
        model: googleai_1.gemini15Pro,
        prompt: nicheAnalysisPrompt,
        config: { temperature: 0.7 },
    });
    // Parse niche options from response
    // In a real implementation, we would parse the structured response
    // For now, we'll extract niche names from the response text
    const nicheOptions = [
        `${projectData.niche} - Advanced Tutorials`,
        `${projectData.niche} - Quick Tips`,
        `${projectData.niche} - Industry News`,
        `${projectData.niche} - Behind the Scenes`,
        `${projectData.niche} - Q&A Sessions`
    ];
    // 4. Call Gemini for content plan generation
    const contentPlanPrompt = `
      Generate a 30-day content plan for a YouTube channel in the ${projectData.niche} niche.
      The target audience is ${projectData.targetAudience}.
      The content tone should be ${projectData.tone}.
      The language is ${projectData.language}.

      Provide 10 video concepts with:
      - Title
      - Brief description
      - Target keywords
      - Estimated difficulty (low, medium, high)
      - Format (long_form, shorts)
      - Suggested publishing date

      Return the results as a structured JSON array.
    `;
    const contentPlanResponse = await (0, ai_1.generate)({
        model: googleai_1.gemini15Pro,
        prompt: contentPlanPrompt,
        config: { temperature: 0.8 },
    });
    // Parse content plan from response
    // In a real implementation, we would parse the structured response
    // For now, we'll create mock content plan items
    const contentPlan = Array.from({ length: 10 }, (_, i) => ({
        id: `item_${Date.now()}_${i}`,
        title: `${projectData.niche} Video #${i + 1}`,
        targetKeywords: [`keyword${i + 1}`, `${projectData.niche.replace(/\s+/g, '')}${i + 1}`],
        estimatedDifficulty: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
        format: Math.random() > 0.5 ? 'long_form' : 'shorts',
        scheduledDate: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).toISOString(), // Schedule for future dates
        status: 'planned',
    }));
    // 5. Store content plan in Firestore
    const contentPlanRef = await db.collection('contentPlans').add({
        projectId: input.projectId,
        createdAt: new Date().toISOString(),
        status: 'active',
        items: contentPlan,
    });
    return {
        nicheOptions,
        contentPlan,
    };
});
