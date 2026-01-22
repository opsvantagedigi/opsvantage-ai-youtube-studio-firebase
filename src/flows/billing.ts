import { defineFlow } from '@genkit-ai/flow';
import * as z from 'zod';
import * as admin from 'firebase-admin';
import { NowPaymentsService } from '../services/nowpayments.service';

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Plan pricing configuration
const PLAN_PRICING: Record<string, { amount: number; currency: string }> = {
  starter: { amount: 19, currency: 'USD' },
  pro: { amount: 49, currency: 'USD' },
  agency: { amount: 149, currency: 'USD' },
};

export const createSubscriptionPayment = defineFlow(
  {
    name: 'createSubscriptionPayment',
    inputSchema: z.object({
      userId: z.string(),
      plan: z.enum(['starter', 'pro', 'agency']),
    }),
    outputSchema: z.object({
      paymentUrl: z.string(),
      paymentId: z.string(),
    }),
    authPolicy: (auth: any, input: any) => {},
  },
  async (input) => {
    const { userId, plan } = input;
    const pricing = PLAN_PRICING[plan];

    // Create a new subscription document in Firestore with 'pending' status
    const subscriptionRef = db.collection('subscriptions').doc();
    const subscriptionId = subscriptionRef.id;

    await subscriptionRef.set({
      userId,
      plan,
      status: 'pending',
      paymentProvider: 'nowpayments',
      currency: pricing.currency,
      amountUSD: pricing.amount,
      videoCredits: 0, // Will be set after successful payment
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Create NOWPayments invoice
    const nowPaymentsService = new NowPaymentsService();

    const paymentRequest = {
      price_amount: pricing.amount,
      price_currency: pricing.currency.toLowerCase(),
      pay_currency: 'usd', // Accept payments in USD
      order_id: subscriptionId, // Use the subscription ID as order ID
      order_description: `Subscription to ${plan} plan`,
      success_url: `${process.env.BASE_URL || 'http://localhost:3000'}/dashboard`,
      cancel_url: `${process.env.BASE_URL || 'http://localhost:3000'}/pricing`,
    };

    try {
      const paymentResponse = await nowPaymentsService.createPayment(paymentRequest);

      // Update the subscription with the payment ID
      await subscriptionRef.update({
        paymentId: paymentResponse.id,
        paymentUrl: paymentResponse.payment_url,
        updatedAt: new Date().toISOString(),
      });

      return {
        paymentUrl: paymentResponse.payment_url,
        paymentId: paymentResponse.id,
      };
    } catch (error) {
      console.error('Error creating NOWPayments invoice:', error);

      // Update subscription status to failed
      await subscriptionRef.update({
        status: 'failed',
        updatedAt: new Date().toISOString(),
      });

      throw new Error('Failed to create payment invoice');
    }
  }
);
