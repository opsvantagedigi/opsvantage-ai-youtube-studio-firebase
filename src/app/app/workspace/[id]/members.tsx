import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function MembersPage({ params }: { params: { id: string } }) {
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
  const workspace = await prisma.workspace.findUnique({
    where: { id: params.id },
    include: {
      memberships: { include: { user: true } },
    },
  });
  if (!workspace) return <div className="p-8">Workspace not found.</div>;
  const canManage = membership.role === 'owner' || membership.role === 'editor';
  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Members of {workspace.name}</h1>
      <ul className="mb-8">
        {workspace.memberships.map(m => (
          <li key={m.id} className="mb-2 flex items-center justify-between">
            <span>{m.user.email} <span className="ml-2 text-xs text-gray-500">({m.role})</span></span>
            {canManage && m.role !== 'owner' && (
              <form action={`/app/api/workspace/${workspace.id}/role`} method="POST" className="inline">
                <input type="hidden" name="membershipId" value={m.id} />
                <select name="role" defaultValue={m.role} className="border rounded p-1 mr-2">
                  <option value="editor">editor</option>
                  <option value="viewer">viewer</option>
                </select>
                <button type="submit" className="bg-blue-600 text-white px-2 py-1 rounded">Update</button>
              </form>
            )}
          </li>
        ))}
      </ul>
      {canManage && (
        <form action={`/app/api/workspace/${workspace.id}/invite`} method="POST" className="flex gap-2">
          <input name="email" placeholder="Invite by email" className="border p-2 rounded flex-1" required />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Invite</button>
        </form>
      )}
      <div className="mt-8">
        <Link href={`/app/workspace/${workspace.id}`}>Back to workspace</Link>
      </div>
    </div>
  );
}
