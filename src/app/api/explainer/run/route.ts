import { auth } from "@/auth";
import { auditEvent } from "@/lib/auth/audit";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { workspaceId, input } = body;

    // TODO: integrate explainer engine invocation here

    await auditEvent({
      action: "explainer.run",
      metadata: { inputLength: input?.length ?? 0 },
      context: {
        userId: session.user.id,
        organizationId: session.user.activeOrgId,
        workspaceId,
        ip: req.headers.get("x-forwarded-for"),
        userAgent: req.headers.get("user-agent"),
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("explainer.run error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
