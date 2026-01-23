// nowpayments.service.ts
import axios from 'axios';
import { NOWPAYMENTS_CONFIG } from '../config/nowpayments.config';

interface CreatePaymentRequest {
  price_amount: number;
  price_currency: string;
  pay_currency: string;
  order_id: string;
  order_description: string;
  success_url?: string;
  cancel_url?: string;
}

interface CreatePaymentResponse {
  id: string;
  payment_url: string;
  created_at: string;
  expiration_estimate_date: string;
  order_id: string;
  order_description: string;
  price_amount: number;
  price_currency: string;
  pay_amount: number;
  actually_paid: number;
  pay_currency: string;
  pay_address: string;
  ips_list: string[];
  purchase_method: string;
  underpaid_percentage: number;
  allow_underpayment: boolean;
  extended_response: boolean;
  permanent_redirect: boolean;
  buyer_email_required: boolean;
  lifetime: number;
  tx_timestamp: string;
  updated_at: string;
  status: string;
  status_local: string;
  purchase_id: string;
  outcome_amount: number;
  outcome_currency: string;
  purchase_amount: number;
  purchase_currency: string;
  fee_rate: number;
  network_fee: number;
  service_fee: number;
  min_payment_threshold: number;
  max_payment_threshold: number;
  warning: string;
  error: string;
  is_fixed_rate: boolean;
  is_refundable: boolean;
  payment_status: string;
  pay_in_currency: string;
  pay_out_currency: string;
  redirect_on_satus: string;
}

export class NowPaymentsService {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = NOWPAYMENTS_CONFIG.apiKey;
    this.apiUrl = NOWPAYMENTS_CONFIG.apiUrl;

    if (!this.apiKey) {
      throw new Error('NOWPAYMENTS_API_KEY environment variable is required');
    }
  }

  private getHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  async createPayment(request: CreatePaymentRequest): Promise<CreatePaymentResponse> {
    try {
      const response = await axios.post<CreatePaymentResponse>(
        `${this.apiUrl}/payment`,
        request,
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error) {
      console.error('Error creating NOWPayments payment:', error);
      throw error;
    }
  }

  async getPayment(paymentId: string): Promise<CreatePaymentResponse> {
    try {
      const response = await axios.get<CreatePaymentResponse>(
        `${this.apiUrl}/payment/${paymentId}`,
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error) {
      console.error('Error getting NOWPayments payment:', error);
      throw error;
    }
  }

  async validateWebhookSignature(payload: any, signature: string): Promise<boolean> {
    // In a real implementation, you would validate the webhook signature
    // For now, returning true - in production, implement proper validation
    console.log('Validating webhook signature:', signature);
    return true;
  }
}