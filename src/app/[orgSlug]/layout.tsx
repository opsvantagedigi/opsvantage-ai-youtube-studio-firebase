import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import TenantProvider from "@/components/providers/TenantProvider";
import AppShell from "@/components/layout/AppShell";

type Props = {
  children: React.ReactNode;
  params: { orgSlug: string };
};

export default async function OrgLayout({ children, params }: Props) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session!.user!.id;

  const orgs = await prisma.organization.findMany({
    where: { memberships: { some: { userId } } },
    include: { memberships: { where: { userId }, select: { role: true } } },
  });

  const activeOrg = orgs.find((o) => o.slug === params.orgSlug) ?? orgs[0] ?? null;

  const workspaces = activeOrg
    ? await prisma.workspace.findMany({ where: { organizationId: activeOrg.id } })
    : [];

  const initialUser = session
    ? {
        id: userId,
        email: session.user?.email ?? undefined,
        name: session.user?.name ?? undefined,
        globalRole: (session.user as any).globalRole,
      }
    : null;

  const initialOrgs = orgs.map((o) => ({
    id: o.id,
    name: o.name,
    slug: o.slug,
    role: o.memberships[0]?.role ?? "MEMBER",
  }));

  const initialWorkspaces = workspaces.map((w) => ({
    id: w.id,
    name: w.name,
    organizationId: w.organizationId,
    role: "MEMBER",
  }));

  return (
    <TenantProvider
      initialUser={initialUser}
      initialOrgs={initialOrgs}
      initialActiveOrg={initialOrgs[0] ?? null}
      initialWorkspaces={initialWorkspaces}
      initialActiveWorkspace={initialWorkspaces[0] ?? null}
    >
      <AppShell>{children}</AppShell>
    </TenantProvider>
  );
}
