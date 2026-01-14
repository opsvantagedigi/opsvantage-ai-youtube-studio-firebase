import { prisma } from "@/lib/prisma";

export async function getUserOrganizations(userId: string) {
  return prisma.organization.findMany({
    where: {
      memberships: {
        some: { userId },
      },
    },
  });
}

export async function getUserWorkspacesForOrg(
  userId: string,
  organizationId: string
) {
  return prisma.workspace.findMany({
    where: {
      organizationId,
      organization: {
        memberships: { some: { userId } },
      },
    },
  });
}

export async function ensureWorkspaceAccess(opts: {
  userId: string;
  workspaceId: string;
}) {
  const workspace = await prisma.workspace.findFirst({
    where: {
      id: opts.workspaceId,
      organization: {
        memberships: { some: { userId: opts.userId } },
      },
    },
  });

  if (!workspace) {
    throw new Error("FORBIDDEN");
  }

  return workspace;
}
