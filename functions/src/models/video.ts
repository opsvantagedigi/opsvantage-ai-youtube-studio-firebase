import * as z from 'zod';

export const VideoSchema = z.object({
  projectId: z.string(),
  planItemId: z.string().nullable(),
  title: z.string(),
  status: z.enum(['draft', 'rendering', 'ready', 'uploaded', 'failed']),
  scriptId: z.string().nullable(),
  voiceoverPath: z.string().nullable(),
  videoPath: z.string().nullable(),
  thumbnailPath: z.string().nullable(),
  youtubeVideoId: z.string().nullable(),
  publishedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Video = z.infer<typeof VideoSchema>;
