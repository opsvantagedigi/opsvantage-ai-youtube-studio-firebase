import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function ShortsPage({ params }: { params: { id: string } }) {
  const session = await getServerSession();
  if (!session?.user?.email) redirect('/login');
  const workspace = await prisma.workspace.findUnique({
    where: { id: params.id },
    include: { shortVideos: true },
  });
  if (!workspace) return <div className="p-8">Workspace not found.</div>;
  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">AI Shorts</h1>
      <ul className="mb-8">
        {workspace.shortVideos.map(short => (
          <li key={short.id} className="mb-2">
            <span className="font-mono">{short.title}</span>
            <span className="ml-2 text-xs text-gray-500">({short.status})</span>
            <Link href={`/app/workspace/${workspace.id}/shorts/${short.id}`} className="ml-4 underline">View</Link>
          </li>
        ))}
      </ul>
      <Link href={`/app/workspace/${workspace.id}/shorts/new`} className="bg-blue-600 text-white px-4 py-2 rounded">+ Generate New Short</Link>
    </div>
  );
}
