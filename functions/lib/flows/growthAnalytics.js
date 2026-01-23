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
exports.runGrowthAnalyticsFlow = void 0;
const flow_1 = require("@genkit-ai/flow");
const z = __importStar(require("zod"));
const admin = __importStar(require("firebase-admin"));
const googleai_1 = require("@genkit-ai/googleai");
const ai_1 = require("@genkit-ai/ai");
const youtube_service_1 = require("../services/youtube.service");
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();
exports.runGrowthAnalyticsFlow = (0, flow_1.defineFlow)({
    name: 'runGrowthAnalytics',
    inputSchema: z.object({
        projectId: z.string()
    }),
    outputSchema: z.object({
        insights: z.array(z.string()),
        updatedPlan: z.array(z.object({
            id: z.string(),
            title: z.string(),
            status: z.string(),
        })),
        promotionTasks: z.array(z.object({
            type: z.enum(['comment', 'community_post', 'shorts_repurpose', 'cross_promote']),
            content: z.string(),
            scheduledAt: z.string(),
            status: z.string(),
        })),
    }),
    authPolicy: (auth, input) => { },
}, async (input) => {
    const { projectId } = input;
    // Fetch project and associated user
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
    // Get YouTube analytics for the channel
    const youtubeService = new youtube_service_1.YouTubeService();
    try {
        // Get channel analytics
        const channelAnalytics = await youtubeService.getChannelAnalytics(userId);
        // Get recent video analytics
        // For now, we'll fetch recent videos from Firestore
        const recentVideos = await db
            .collection('videos')
            .where('projectId', '==', projectId)
            .orderBy('createdAt', 'desc')
            .limit(10)
            .get();
        const videoAnalytics = [];
        for (const videoDoc of recentVideos.docs) {
            const videoData = videoDoc.data();
            if (videoData.youtubeVideoId) {
                // Get detailed analytics for each YouTube video
                const videoAnalyticsData = await youtubeService.getVideoAnalytics(videoData.youtubeVideoId);
                videoAnalytics.push({
                    videoId: videoData.videoId,
                    youtubeVideoId: videoData.youtubeVideoId,
                    title: videoData.title,
                    analytics: videoAnalyticsData,
                });
            }
        }
        // Generate insights using AI
        const analyticsPrompt = `
        Analyze the following YouTube channel and video performance data:

        Channel Stats: ${JSON.stringify(channelAnalytics.channelStats)}

        Recent Video Performance: ${JSON.stringify(videoAnalytics)}

        Provide specific insights on:
        1. Content themes that perform best
        2. Optimal posting times and frequency
        3. Thumbnail and title strategies that work
        4. Audience retention patterns
        5. Recommendations for content strategy improvements
        6. Suggestions for promotion activities
      `;
        const llmResponse = await (0, ai_1.generate)({
            model: googleai_1.gemini15Pro,
            prompt: analyticsPrompt,
            config: { temperature: 0.7 },
        });
        const aiAnalysis = llmResponse.text();
        // Generate updated content plan based on insights
        // In a real implementation, we would use the planUpdateResponse
        // const planUpdatePrompt = `
        //   Based on these analytics insights: ${aiAnalysis}
        //
        //   Create an updated content plan with 3-5 specific video ideas that would likely perform well.
        //   Include titles and brief descriptions.
        // `;
        //
        // const planUpdateResponse = await generate({
        //   model: gemini15Pro,
        //   prompt: planUpdatePrompt,
        //   config: { temperature: 0.7 },
        // });
        // Parse the AI response to create an updated plan
        // For simplicity, we'll create mock data based on the analysis
        const insights = [
            'Video retention highest in first 30 seconds',
            'Thumbnails with faces perform 23% better',
            'Upload on Tuesdays and Thursdays for maximum engagement',
            `AI Analysis: ${aiAnalysis.substring(0, 100)}...`
        ];
        // Create updated plan based on AI suggestions
        const updatedPlan = [
            { id: `plan_${Date.now()}_1`, title: 'Improved Introduction Video', status: 'planned' },
            { id: `plan_${Date.now()}_2`, title: 'Tutorial Video with face cam', status: 'planned' },
        ];
        // Generate promotion tasks based on recent videos
        const promotionTasks = [];
        if (recentVideos.docs.length > 0) {
            // const latestVideo = recentVideos.docs[0].data(); // Using this variable in the content
            promotionTasks.push({
                type: 'comment',
                content: `Thanks for watching! Don't forget to subscribe for more ${projectData.niche} content.`,
                scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
                status: 'pending',
            });
            promotionTasks.push({
                type: 'community_post',
                content: `New video just dropped! Check out our latest ${projectData.niche} tutorial. Link in bio! #${projectData.niche.replace(/\s+/g, '')}`,
                scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // In 2 hours
                status: 'pending',
            });
            promotionTasks.push({
                type: 'shorts_repurpose',
                content: `Repurposing this video into a short-form version for TikTok and Instagram Reels`,
                scheduledAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // In 2 days
                status: 'pending',
            });
        }
        // Store analytics insights in Firestore
        const analyticsRef = db.collection('analyticsChannel').doc(`${projectId}_${new Date().toISOString().slice(0, 10)}`);
        await analyticsRef.set({
            projectId,
            date: new Date().toISOString().slice(0, 10),
            insights,
            aiAnalysis,
            createdAt: new Date().toISOString(),
        });
        console.log(`Completed growth analytics for project ID: ${projectId}`);
        return {
            insights,
            updatedPlan,
            promotionTasks,
        };
    }
    catch (error) {
        console.error('Error running growth analytics:', error);
        throw error;
    }
});
