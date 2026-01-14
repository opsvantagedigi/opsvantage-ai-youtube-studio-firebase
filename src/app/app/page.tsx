import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import type { UserWorkspaceMembership } from '@prisma/client';
const { getPrisma } = require('@/lib/getPrisma');
import Link from 'next/link';

export default async function AppPage() {
  const session = await getServerSession();
  if (!session?.user?.email) redirect('/login');

  const prisma = getPrisma();
  // Fetch workspaces for the user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      memberships: {
        include: { workspace: true },
      },
    },
  });

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Your Workspaces</h1>
      <ul className="mb-8">
        {user?.memberships.map((m: any) => (
          <li key={m.workspace.id} className="mb-2">
            <Link href={`/app/workspace/${m.workspace.id}`}>{m.workspace.name}</Link>
            <span className="ml-2 text-xs text-gray-500">({m.role})</span>
          </li>
        ))}
      </ul>
      <Link href="/app/workspace/new" className="bg-blue-600 text-white px-4 py-2 rounded">+ New Workspace</Link>
    </div>
  );
}
