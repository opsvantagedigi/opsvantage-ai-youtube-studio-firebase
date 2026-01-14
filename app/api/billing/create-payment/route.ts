import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PLANS, PlanId } from "@/lib/plans";

const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY;
const NOWPAYMENTS_IPN_URL = process.env.NOWPAYMENTS_IPN_URL;

export async function POST(req: NextRequest) {
  try {
    if (!NOWPAYMENTS_API_KEY || !NOWPAYMENTS_IPN_URL) {
      return NextResponse.json(
        { error: "Billing not configured" },
        { status: 500 }
      );
    }

    const session = await getServerSession(authOptions);
    // TypeScript fix: session.user may not have id typed, but we set it in NextAuth callbacks
    const userId = (session?.user as { id?: string })?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planId } = (await req.json()) as { planId?: PlanId };

    if (!planId || !PLANS[planId]) {
      return NextResponse.json(
        { error: "Invalid or missing planId" },
        { status: 400 }
      );
    }

    const plan = PLANS[planId];

    // Create subscription row in pending
    const sub = await prisma.subscription.create({
      data: {
        userId,
        workspaceId: null,
        planId,
        provider: "nowpayments",
        status: "pending",
        amountCents: plan.amountCents,
        currency: plan.currency,
      },
    });

    const priceAmount = plan.amountCents / 100;

    const res = await fetch("https://api.nowpayments.io/v1/payment", {
      method: "POST",
      headers: {
        "x-api-key": NOWPAYMENTS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price_amount: priceAmount,
        price_currency: plan.currency,
        pay_currency: "crypto",
        ipn_url: NOWPAYMENTS_IPN_URL,
        order_id: sub.id,
        order_description: plan.label,
      }),
    });

    if (!res.ok) {
      console.error("NowPayments create payment error:", res.status, await res.text());
      return NextResponse.json(
        { error: "Failed to create payment" },
        { status: 502 }
      );
    }

    const data = (await res.json()) as { invoice_url?: string };

    await prisma.subscription.update({
      where: { id: sub.id },
      data: {
        providerOrderId: sub.id,
      },
    });

    return NextResponse.json(
      {
        paymentUrl: data.invoice_url,
        subscriptionId: sub.id,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Create payment error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
