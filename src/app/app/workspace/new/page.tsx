import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function NewWorkspacePage() {
  const session = await getServerSession();
  if (!session?.user?.email) redirect('/login');

  // UI for creating a new workspace (form submission handled client-side)
  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-xl font-bold mb-4">Create New Workspace</h1>
      <form action="/app/api/workspace/create" method="POST" className="space-y-4">
        <input name="name" placeholder="Workspace Name" className="w-full border p-2 rounded" required />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
      </form>
    </div>
  );
}
