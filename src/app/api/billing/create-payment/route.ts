import { NextRequest, NextResponse } from 'next/server';

// This endpoint creates a NowPayments payment link for a subscription
export async function POST(req: NextRequest) {
  const { planId, workspaceId } = await req.json();
  if (!planId || !workspaceId) return NextResponse.json({ error: 'Missing data' }, { status: 400 });

  // Fetch plan details (replace with your actual plan lookup logic)
  const plans = {
    basic: { price: 10, name: 'Basic' },
    pro: { price: 30, name: 'Pro' },
  };
  const plan = plans[planId];
  if (!plan) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });

  // Create payment via NowPayments API
  const apiKey = process.env.NOWPAYMENTS_API_KEY;
  const paymentPayload = {
    price_amount: plan.price,
    price_currency: 'USD',
    order_id: `${workspaceId}-${planId}-${Date.now()}`,
    order_description: `Upgrade to ${plan.name} plan`,
    ipn_callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/billing/webhook`,
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/app/billing/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/app/billing/cancel`,
  };
  const resp = await fetch('https://api.nowpayments.io/v1/invoice', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey || '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paymentPayload),
  });
  const data = await resp.json();
  if (!data || !data.invoice_url) return NextResponse.json({ error: 'Payment failed', details: data }, { status: 500 });
  return NextResponse.json({ url: data.invoice_url });
}
