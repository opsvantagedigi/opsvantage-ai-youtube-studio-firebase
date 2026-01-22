import { defineFlow } from '@genkit-ai/flow';
import * as z from 'zod';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

const nowPaymentsWebhookSchema = z.object({
  payment_id: z.string(),
  payment_status: z.enum(['finished', 'failed', 'expired']),
  price_amount: z.number(),
  price_currency: z.string(),
  pay_amount: z.number(),
  pay_currency: z.string(),
  order_id: z.string(), // Used to identify the user or subscription
  order_description: z.string().optional(),
  payout_hash: z.string().optional(),
  payin_hash: z.string().optional(),
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

    const subscriptionRef = db.collection('subscriptions').doc(payload.order_id);

    switch (payload.payment_status) {
      case 'finished':
        await subscriptionRef.update({ status: 'active' });
        console.log(`Subscription ${payload.order_id} activated.`);
        break;
      case 'failed':
        await subscriptionRef.update({ status: 'past_due' });
        console.log(`Subscription ${payload.order_id} marked as past_due.`);
        break;
      case 'expired':
        console.log(`Payment expired for subscription ${payload.order_id}.`);
        break;
    }
  }
);
