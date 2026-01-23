import * as z from 'zod';

export const ProjectSchema = z.object({
  userId: z.string(),
  name: z.string(),
  niche: z.string(),
  language: z.string(),
  tone: z.string(),
  targetAudience: z.string(),
  postingFrequency: z.string(),
  connectedYouTubeChannelId: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Project = z.infer<typeof ProjectSchema>;
