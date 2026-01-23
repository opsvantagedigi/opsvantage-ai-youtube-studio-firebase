"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubscriptionPayment = void 0;
const flow_1 = require("@genkit-ai/flow");
const z = __importStar(require("zod"));
const admin = __importStar(require("firebase-admin"));
const nowpayments_service_1 = require("../services/nowpayments.service");
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();
// Plan pricing configuration
const PLAN_PRICING = {
    starter: { amount: 19, currency: 'USD' },
    pro: { amount: 49, currency: 'USD' },
    agency: { amount: 149, currency: 'USD' },
};
exports.createSubscriptionPayment = (0, flow_1.defineFlow)({
    name: 'createSubscriptionPayment',
    inputSchema: z.object({
        userId: z.string(),
        plan: z.enum(['starter', 'pro', 'agency']),
    }),
    outputSchema: z.object({
        paymentUrl: z.string(),
        paymentId: z.string(),
    }),
    authPolicy: (auth, input) => { },
}, async (input) => {
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
    const nowPaymentsService = new nowpayments_service_1.NowPaymentsService();
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
    }
    catch (error) {
        console.error('Error creating NOWPayments invoice:', error);
        // Update subscription status to failed
        await subscriptionRef.update({
            status: 'failed',
            updatedAt: new Date().toISOString(),
        });
        throw new Error('Failed to create payment invoice');
    }
});
