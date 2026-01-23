import * as z from 'zod';

export const MonetisationProfileSchema = z.object({
  projectId: z.string(),
  affiliatePrograms: z.array(
    z.object({
      name: z.string(),
      baseUrl: z.string(),
      trackingId: z.string(),
    })
  ),
  digitalProducts: z.array(
    z.object({
      id: z.string(),
      type: z.enum(['ebook', 'course', 'template']),
      title: z.string(),
      priceUSD: z.number(),
      salesPageUrl: z.string(),
    })
  ),
  emailProvider: z.enum(['convertkit', 'mailerlite', 'custom', 'none']),
  emailListId: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type MonetisationProfile = z.infer<typeof MonetisationProfileSchema>;
