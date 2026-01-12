import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function ConnectChannelPage({ params }: { params: { id: string } }) {
  const session = await getServerSession();
  if (!session?.user?.email) redirect('/login');
  // This would redirect to the YouTube OAuth URL (to be implemented)
  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-xl font-bold mb-4">Connect a YouTube Channel</h1>
      <form action={`/api/youtube/oauth/start`} method="POST">
        <input type="hidden" name="workspaceId" value={params.id} />
        <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded">Connect with YouTube</button>
      </form>
    </div>
  );
}
