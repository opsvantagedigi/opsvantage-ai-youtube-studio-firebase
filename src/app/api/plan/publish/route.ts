import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { auditEvent } from "@/lib/auth/audit";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { planId, workspaceId } = body;

    const plan = await prisma.plan.update({
      where: { id: planId },
      data: { published: true },
    });

    await auditEvent({
      action: "plan.publish",
      metadata: { planId },
      context: {
        userId: session.user.id,
        organizationId: session.user.activeOrgId,
        workspaceId,
        ip: req.headers.get("x-forwarded-for"),
        userAgent: req.headers.get("user-agent"),
      },
    });

    return NextResponse.json(plan);
  } catch (err) {
    console.error("plan.publish error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
