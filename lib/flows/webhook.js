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
exports.handlePaymentWebhook = void 0;
const flow_1 = require("@genkit-ai/flow");
const z = __importStar(require("zod"));
const admin = __importStar(require("firebase-admin"));
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
exports.handlePaymentWebhook = (0, flow_1.defineFlow)({
    name: 'handlePaymentWebhook',
    inputSchema: nowPaymentsWebhookSchema,
    outputSchema: z.void(),
}, async (payload) => {
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
});
//# sourceMappingURL=webhook.js.map