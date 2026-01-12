



import { NextRequest, NextResponse } from "next/server";
import { generateExplainer } from "@/lib/explainer-engine";

export async function POST(req: NextRequest) {
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
