import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auditEvent } from "@/lib/auth/audit";

export async function POST(req: Request) {
  try {
    let session;
    try {
      session = await auth();
    } catch (e) {
      // auth() failure should be treated as unauthenticated for safety
      console.error("[workspace.create] auth() error:", e);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { organizationId, name } = body;

    if (!organizationId || !name) {
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

    // Check membership
    const org = await prisma.organization.findFirst({
      where: {
        id: organizationId,
        memberships: { some: { userId: session.user.id } },
      },
    });

    if (!org) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const workspace = await prisma.workspace.create({
      data: {
        name,
        organizationId,
      },
    });

    await auditEvent({
      action: "workspace.create",
      metadata: { name, organizationId },
      context: {
        userId: session.user.id,
        organizationId,
        ip: req.headers.get("x-forwarded-for"),
        userAgent: req.headers.get("user-agent"),
      },
    });

    return NextResponse.json(workspace);
  } catch (err) {
    // Structured logging for production visibility
    try {
      // Prefer console.error for Vercel logs
      console.error("[workspace.create] error:", err);
    } catch (e) {
      // noop
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
