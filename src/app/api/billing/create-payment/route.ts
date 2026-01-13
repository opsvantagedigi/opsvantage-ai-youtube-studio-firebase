import { NextResponse } from "next/server"
const { getPrisma } = require('@/lib/getPrisma');

const plans = {
  basic: { price: 10, name: "Basic" },
  pro: { price: 30, name: "Pro" },
} as const

type PlanId = keyof typeof plans // "basic" | "pro"

export async function POST(req: Request) {
  const body = (await req.json()) as { planId?: string; workspaceId?: string }

  const prisma = getPrisma();

  const planIdRaw = body.planId
  const workspaceId = body.workspaceId
  if (!planIdRaw || !workspaceId) {
    return NextResponse.json({ error: "Missing planId or workspaceId" }, { status: 400 })
  }

  // Runtime guard + typing: only allow valid plan ids
  if (!["basic", "pro"].includes(planIdRaw)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
  }

  const planId = planIdRaw as PlanId
  const plan = plans[planId]

  // Create payment via NowPayments API
  const apiKey = process.env.NOWPAYMENTS_API_KEY
  const paymentPayload = {
    price_amount: plan.price,
    price_currency: "USD",
    order_id: `${workspaceId}-${planId}-${Date.now()}`,
    order_description: `Upgrade to ${plan.name} plan`,
    ipn_callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/billing/webhook`,
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/app/billing/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/app/billing/cancel`,
  }
  const resp = await fetch("https://api.nowpayments.io/v1/invoice", {
    method: "POST",
    headers: {
      "x-api-key": apiKey || "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(paymentPayload),
  })
  const data = await resp.json()
  if (!data || !data.invoice_url) return NextResponse.json({ error: "Payment failed", details: data }, { status: 500 })
  return NextResponse.json({ url: data.invoice_url })
}
