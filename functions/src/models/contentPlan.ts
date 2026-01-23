import * as z from 'zod';

export const ContentPlanSchema = z.object({
  projectId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  status: z.enum(['active', 'archived']),
  items: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      targetKeywords: z.array(z.string()),
      estimatedDifficulty: z.enum(['low', 'medium', 'high']),
      format: z.enum(['long_form', 'shorts']),
      scheduledDate: z.string().nullable(),
      status: z.enum(['planned', 'in_progress', 'published']),
    })
  ),
});

export type ContentPlan = z.infer<typeof ContentPlanSchema>;
