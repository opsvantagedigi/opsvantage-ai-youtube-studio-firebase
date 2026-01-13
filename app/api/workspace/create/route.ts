import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auditEvent } from "@/lib/auth/audit";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { organizationId, name } = body;

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
}
