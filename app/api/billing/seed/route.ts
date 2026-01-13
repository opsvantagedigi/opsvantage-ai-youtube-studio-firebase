import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Development-only helper to create a Subscription row for local IPN testing.
export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not allowed in production" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { userId, providerOrderId, price = 0, currency = "USD" } = body;
    if (!userId || !providerOrderId) {
      return NextResponse.json({ error: "Missing userId or providerOrderId" }, { status: 400 });
    }

    const sub = await prisma.subscription.create({
      data: {
        userId,
        planId: 'dev',
        provider: "nowpayments",
        providerOrderId,
        amountCents: Math.round(Number(price) * 100),
        currency,
        status: "pending",
      },
    });

    return NextResponse.json({ ok: true, subscription: sub }, { status: 201 });
  } catch (err) {
    console.error("seed route error", err);
    return NextResponse.json({ error: "Internal" }, { status: 500 });
  }
}
