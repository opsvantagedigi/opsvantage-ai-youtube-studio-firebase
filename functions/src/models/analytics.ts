import * as z from 'zod';

export const AnalyticsSchema = z.object({
  projectId: z.string(),
  totalViews: z.number(),
  totalLikes: z.number(),
  totalComments: z.number(),
  subscribers: z.number(),
  watchTimeHours: z.number(),
  averageViewDuration: z.number(),
  impressions: z.number(),
  ctr: z.number(),
});
