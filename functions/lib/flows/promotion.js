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
exports.schedulePromotionCampaignFlow = exports.executePromotionTaskFlow = void 0;
const flow_1 = require("@genkit-ai/flow");
const z = __importStar(require("zod"));
const admin = __importStar(require("firebase-admin"));
const youtube_service_1 = require("../services/youtube.service");
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();
exports.executePromotionTaskFlow = (0, flow_1.defineFlow)({
    name: 'executePromotionTask',
    inputSchema: z.object({
        taskId: z.string(),
        projectId: z.string(),
        taskType: z.enum(['comment', 'community_post', 'shorts_repurpose', 'cross_promote']),
        content: z.string(),
    }),
    outputSchema: z.object({
        success: z.boolean(),
        message: z.string(),
    }),
    authPolicy: (auth, input) => { },
}, async (input) => {
    const { taskId, projectId, taskType, content } = input;
    // Fetch project and associated user
    const projectDoc = await db.collection('projects').doc(projectId).get();
    if (!projectDoc.exists) {
        throw new Error(`Project with ID ${projectId} not found`);
    }
    // const projectData = projectDoc.data(); // Not currently used but kept for future implementation
    // const userId = projectData.userId; // Not currently used but kept for future implementation
    // Initialize YouTube service
    const youtubeService = new youtube_service_1.YouTubeService();
    try {
        let resultMessage = '';
        let success = true;
        switch (taskType) {
            case 'comment':
                // In a real implementation, this would add a comment to recent videos
                // YouTube API has limitations on comment posting, so this would need to be handled carefully
                resultMessage = `Comment task "${taskId}" processed: "${content}"`;
                // Update task status
                await db.collection('promotionTasks').doc(taskId).update({
                    status: 'completed',
                    completedAt: new Date().toISOString(),
                    result: resultMessage,
                });
                break;
            case 'community_post':
                // In a real implementation, this would create a community post
                // This requires special permissions and is only available to certain channels
                resultMessage = `Community post task "${taskId}" processed: "${content}"`;
                // Update task status
                await db.collection('promotionTasks').doc(taskId).update({
                    status: 'completed',
                    completedAt: new Date().toISOString(),
                    result: resultMessage,
                });
                break;
            case 'shorts_repurpose':
                // In a real implementation, this would create a short-form version of the video
                // This could involve calling video editing services to create a shorter version
                resultMessage = `Shorts repurpose task "${taskId}" processed for project "${projectId}"`;
                // Update task status
                await db.collection('promotionTasks').doc(taskId).update({
                    status: 'completed',
                    completedAt: new Date().toISOString(),
                    result: resultMessage,
                });
                break;
            case 'cross_promote':
                // In a real implementation, this would cross-promote on other platforms
                resultMessage = `Cross-promotion task "${taskId}" processed: "${content}"`;
                // Update task status
                await db.collection('promotionTasks').doc(taskId).update({
                    status: 'completed',
                    completedAt: new Date().toISOString(),
                    result: resultMessage,
                });
                break;
            default:
                throw new Error(`Unknown promotion task type: ${taskType}`);
        }
        console.log(`Executed promotion task: ${taskId}, Type: ${taskType}`);
        return {
            success,
            message: resultMessage,
        };
    }
    catch (error) {
        console.error(`Error executing promotion task ${taskId}:`, error);
        // Update task status to failed
        await db.collection('promotionTasks').doc(taskId).update({
            status: 'failed',
            completedAt: new Date().toISOString(),
            error: error instanceof Error ? error.message : 'Unknown error',
        });
        return {
            success: false,
            message: `Error executing promotion task: ${error instanceof Error ? error.message : 'Unknown error'}`,
        };
    }
});
exports.schedulePromotionCampaignFlow = (0, flow_1.defineFlow)({
    name: 'schedulePromotionCampaign',
    inputSchema: z.object({
        projectId: z.string(),
        videoId: z.string(),
        schedule: z.array(z.object({
            type: z.enum(['comment', 'community_post', 'shorts_repurpose', 'cross_promote']),
            content: z.string(),
            delayHours: z.number(), // Hours from now to execute
        })),
    }),
    outputSchema: z.object({
        campaignId: z.string(),
        scheduledTasks: z.array(z.string()),
    }),
    authPolicy: (auth, input) => { },
}, async (input) => {
    const { projectId, videoId, schedule } = input;
    const campaignId = `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const scheduledTasks = [];
    for (const [index, taskSpec] of schedule.entries()) {
        const taskId = `${campaignId}_task_${index}`;
        // Create promotion task document
        await db.collection('promotionTasks').doc(taskId).set({
            taskId,
            campaignId,
            projectId,
            videoId,
            type: taskSpec.type,
            content: taskSpec.content,
            status: 'scheduled',
            scheduledAt: new Date(Date.now() + taskSpec.delayHours * 60 * 60 * 1000).toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
        scheduledTasks.push(taskId);
    }
    // Update campaign document
    await db.collection('promotionCampaigns').doc(campaignId).set({
        campaignId,
        projectId,
        videoId,
        tasks: scheduledTasks,
        status: 'active',
        totalTasks: schedule.length,
        completedTasks: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    });
    console.log(`Scheduled promotion campaign: ${campaignId} with ${schedule.length} tasks`);
    return {
        campaignId,
        scheduledTasks,
    };
});
