"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NowPaymentsService = void 0;
// nowpayments.service.ts
const axios_1 = __importDefault(require("axios"));
const nowpayments_config_1 = require("../config/nowpayments.config");
class NowPaymentsService {
    constructor() {
        this.apiKey = nowpayments_config_1.NOWPAYMENTS_CONFIG.apiKey;
        this.apiUrl = nowpayments_config_1.NOWPAYMENTS_CONFIG.apiUrl;
        if (!this.apiKey) {
            throw new Error('NOWPAYMENTS_API_KEY environment variable is required');
        }
    }
    getHeaders() {
        return {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
        };
    }
    async createPayment(request) {
        try {
            const response = await axios_1.default.post(`${this.apiUrl}/payment`, request, { headers: this.getHeaders() });
            return response.data;
        }
        catch (error) {
            console.error('Error creating NOWPayments payment:', error);
            throw error;
        }
    }
    async getPayment(paymentId) {
        try {
            const response = await axios_1.default.get(`${this.apiUrl}/payment/${paymentId}`, { headers: this.getHeaders() });
            return response.data;
        }
        catch (error) {
            console.error('Error getting NOWPayments payment:', error);
            throw error;
        }
    }
    async validateWebhookSignature(payload, signature) {
        // In a real implementation, you would validate the webhook signature
        // For now, returning true - in production, implement proper validation
        console.log('Validating webhook signature:', signature);
        return true;
    }
}
exports.NowPaymentsService = NowPaymentsService;
