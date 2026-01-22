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
// Mock NOWPayments API call
async function createNowPaymentsInvoice(userId, plan) {
    console.log(`Creating NOWPayments invoice for user ${userId} for plan ${plan}`);
    // In a real application, you would make an API call to NOWPayments here.
    // This is a mock implementation.
    const paymentId = `NOW_${Math.random().toString(36).substring(2, 12)}`;
    const paymentUrl = `https://nowpayments.io/payment/?iid=${paymentId}`;
    return { paymentUrl, paymentId };
}
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
    const { paymentUrl, paymentId } = await createNowPaymentsInvoice(input.userId, input.plan);
    return { paymentUrl, paymentId };
});
//# sourceMappingURL=billing.js.map