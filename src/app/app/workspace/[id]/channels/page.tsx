import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
const { getPrisma } = require('@/lib/getPrisma');
import Link from 'next/link';

export default async function ChannelsPage({ params }: { params: { id: string } }) {
  const session = await getServerSession();
  if (!session?.user?.email) redirect('/login');
  const prisma = getPrisma();
  const workspace = await prisma.workspace.findUnique({
    where: { id: params.id },
    include: { youtubeConfigs: true },
  });
  if (!workspace) return <div className="p-8">Workspace not found.</div>;
  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">YouTube Channels</h1>
      <ul className="mb-8">
        {workspace.youtubeConfigs.map((channel: any) => (
          <li key={channel.id} className="mb-2">
            <span className="font-mono">{channel.channelName}</span>
          </li>
        ))}
      </ul>
      <Link href={`/app/workspace/${workspace.id}/channels/connect`} className="bg-blue-600 text-white px-4 py-2 rounded">+ Connect Channel</Link>
    </div>
  );
}
