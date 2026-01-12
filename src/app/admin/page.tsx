import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function AdminDashboard() {
  const session = await getServerSession();
  if (!session?.user?.email) redirect('/login');
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (user?.role !== 'admin') return <div className="p-8">Access denied.</div>;
  const users = await prisma.user.findMany();
  const workspaces = await prisma.workspace.findMany();
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Users</h2>
        <ul>
          {users.map(u => (
            <li key={u.id}>{u.email} ({u.role})</li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Workspaces</h2>
        <ul>
          {workspaces.map(w => (
            <li key={w.id}>{w.name} (Owner: {w.ownerId})</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
