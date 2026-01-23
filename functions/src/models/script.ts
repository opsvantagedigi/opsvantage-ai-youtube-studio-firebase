import * as z from 'zod';

export const ScriptSchema = z.object({
  projectId: z.string(),
  videoId: z.string(),
  scriptText: z.string(),
  sceneBreakdown: z.array(
    z.object({
      timestamp: z.string(),
      description: z.string(),
      voiceText: z.string(),
    })
  ),
  seoMetadata: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    chapters: z.array(
      z.object({
        timestamp: z.string(),
        title: z.string(),
      })
    ),
    hashtags: z.array(z.string()),
  }),
  thumbnailConcepts: z.array(
    z.object({
      headline: z.string(),
      visualDescription: z.string(),
      emotion: z.string(),
      colors: z.string(),
    })
  ),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Script = z.infer<typeof ScriptSchema>;
