"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NOWPAYMENTS_CONFIG = void 0;
// nowpayments.config.ts
exports.NOWPAYMENTS_CONFIG = {
    apiKey: process.env.NOWPAYMENTS_API_KEY || '',
    apiUrl: process.env.NOWPAYMENTS_API_URL || 'https://api.nowpayments.io/v1',
    merchantUrl: process.env.NOWPAYMENTS_MERCHANT_URL || 'https://pay.nowpayments.io',
    ipnCallbackUrl: process.env.NOWPAYMENTS_IPN_CALLBACK_URL || `${process.env.BASE_URL || 'http://localhost:3000'}/api/webhook/nowpayments`,
};
