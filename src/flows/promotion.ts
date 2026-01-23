import { defineFlow } from '@genkit-ai/flow';
import * as z from 'zod';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

export const executePromotionTaskFlow = defineFlow(
  {
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
    authPolicy: (auth: any, input: any) => {},
  },
  async (input) => {
    const { taskId, projectId, taskType, content } = input;
    
    // Fetch project and associated user
    const projectDoc = await db.collection('projects').doc(projectId).get();
    if (!projectDoc.exists) {
      throw new Error(`Project with ID ${projectId} not found`);
    }
    
    // const projectData = projectDoc.data(); // Not currently used but kept for future implementation
    // const userId = projectData.userId; // Not currently used but kept for future implementation

    
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
    } catch (error) {
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
  }
);

export const schedulePromotionCampaignFlow = defineFlow(
  {
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
    authPolicy: (auth: any, input: any) => {},
  },
  async (input) => {
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
  }
);