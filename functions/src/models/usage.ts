import * as z from 'zod';

export const UsageSchema = z.object({
  userId: z.string(),
  month: z.string(),
  videosGenerated: z.number(),
  charactersUsed: z.number(),
  storageUsedMB: z.number(),
  lastUpdatedAt: z.string(),
});

export type Usage = z.infer<typeof UsageSchema>;
