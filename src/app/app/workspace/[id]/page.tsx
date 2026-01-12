import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function WorkspacePage({ params }: { params: { id: string } }) {
  const session = await getServerSession();
  if (!session?.user?.email) redirect('/login');
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      memberships: { where: { workspaceId: params.id } },
    },
  });
  const membership = user?.memberships[0];
  if (!membership) return <div className="p-8">Access denied.</div>;
  const workspace = await prisma.workspace.findUnique({ where: { id: params.id } });
  if (!workspace) return <div className="p-8">Workspace not found.</div>;
  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">{workspace.name}</h1>
      <div className="mb-2">Role: <span className="font-mono">{membership.role}</span></div>
      {/* Membership management UI for owners/admins will go here */}
    </div>
  );
}
