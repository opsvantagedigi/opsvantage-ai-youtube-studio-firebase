import * as z from 'zod';

export const SubscriptionSchema = z.object({
  userId: z.string(),
  plan: z.enum(['free', 'starter', 'pro', 'agency']),
  status: z.enum(['active', 'canceled', 'past_due', 'trial']),
  paymentProvider: z.string(),
  paymentId: z.string(),
  currency: z.string(),
  amountUSD: z.number(),
  videoCredits: z.number(),
  renewsAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Subscription = z.infer<typeof SubscriptionSchema>;
