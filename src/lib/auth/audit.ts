import { prisma } from "@/lib/prisma";

type AuditContext = {
  userId?: string;
  organizationId?: string;
  workspaceId?: string;
  ip?: string | null;
  userAgent?: string | null;
};

export async function auditEvent(input: {
  action: string;
  metadata?: Record<string, any>;
  context?: AuditContext;
}) {
  const { action, metadata, context = {} } = input;

  await prisma.auditLog.create({
    data: {
      action,
      metadata,
      userId: context.userId,
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      ip: context.ip ?? undefined,
      userAgent: context.userAgent ?? undefined,
    },
  });
}
