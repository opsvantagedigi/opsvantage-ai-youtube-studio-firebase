import { defineFlow } from '@genkit-ai/flow';
import * as z from 'zod';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Define the NOWPayments webhook payload schema
const nowPaymentsWebhookSchema = z.object({
  payment_id: z.string(),
  payment_status: z.enum(['finished', 'failed', 'expired']),
  price_amount: z.number(),
  price_currency: z.string(),
  pay_amount: z.number(),
  pay_currency: z.string(),
  order_id: z.string(), // This corresponds to our subscription ID
  order_description: z.string().optional(),
  payout_hash: z.string().optional(),
  payin_hash: z.string().optional(),
  purchase_id: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const handlePaymentWebhook = defineFlow(
  {
    name: 'handlePaymentWebhook',
    inputSchema: nowPaymentsWebhookSchema,
    outputSchema: z.void(),
    authPolicy: (auth: any, input: any) => {},
  },
  async (payload) => {
    console.log('Received NOWPayments Webhook:', payload);

    // Validate webhook signature (in production)
    // const isValid = await new NowPaymentsService().validateWebhookSignature(payload, /* signature */);
    // if (!isValid) {
    //   throw new Error('Invalid webhook signature');
    // }

    const subscriptionRef = db.collection('subscriptions').doc(payload.order_id);
    const subscriptionDoc = await subscriptionRef.get();

    if (!subscriptionDoc.exists) {
      console.error(`Subscription ${payload.order_id} not found`);
      return;
    }

    const subscription = subscriptionDoc.data();
    if (!subscription) {
      console.error(`Subscription data not found for ${payload.order_id}`);
      return;
    }

    let videoCredits = 0;

    // Determine video credits based on plan
    switch (subscription.plan) {
      case 'starter':
        videoCredits = 10;
        break;
      case 'pro':
        videoCredits = 30;
        break;
      case 'agency':
        videoCredits = 100;
        break;
      default:
        videoCredits = 1; // Free tier
    }

    switch (payload.payment_status) {
      case 'finished':
        // Payment successful - activate subscription
        await subscriptionRef.update({
          status: 'active',
          videoCredits: videoCredits,
          renewsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          updatedAt: new Date().toISOString(),
        });

        console.log(`Subscription ${payload.order_id} activated with ${videoCredits} video credits.`);

        // Optionally, create/update usage record
        const usageRef = db.collection('usage').doc(`${subscription.userId}_${new Date().toISOString().slice(0, 7)}`);
        await usageRef.set({
          userId: subscription.userId,
          month: new Date().toISOString().slice(0, 7),
          videosGenerated: 0,
          charactersUsed: 0,
          storageUsedMB: 0,
          lastUpdatedAt: new Date().toISOString(),
        }, { merge: true });

        break;

      case 'failed':
        // Payment failed - mark as past due
        await subscriptionRef.update({
          status: 'past_due',
          updatedAt: new Date().toISOString(),
        });
        console.log(`Subscription ${payload.order_id} marked as past_due.`);
        break;

      case 'expired':
        // Payment expired - deactivate subscription
        await subscriptionRef.update({
          status: 'expired',
          updatedAt: new Date().toISOString(),
        });
        console.log(`Subscription ${payload.order_id} marked as expired.`);
        break;
    }
  }
);
