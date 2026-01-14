



import { NextRequest, NextResponse } from "next/server";
import { generateExplainer } from "@/lib/explainer-engine";
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { isSuperUser } from "@/lib/roles"
import { getUserSubscriptionStatus } from "@/lib/subscription"

export async function POST(req: NextRequest) {
  // enforce authentication + subscription for API usage
  const session = await getServerSession(authOptions)
  const userId = (session?.user as any)?.id ?? null

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!(await isSuperUser(userId))) {
    const status = await getUserSubscriptionStatus(userId)
    if (status !== "active") {
      return NextResponse.json({ error: "Subscription required", status }, { status: 402 })
    }
  }

  try {
    const body = await req.json();
    if (!body || typeof body.prompt !== "string" || typeof body.niche !== "string") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
    const output = await generateExplainer({ prompt: body.prompt, niche: body.niche });
    return NextResponse.json(output);
  } catch (e: any) {
    return NextResponse.json({ error: "Failed to generate explainer" }, { status: 500 });
  }
}
