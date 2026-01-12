import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function NewShortPage({ params }: { params: { id: string } }) {
  const session = await getServerSession();
  if (!session?.user?.email) redirect('/login');
  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-xl font-bold mb-4">Generate AI Explainer Short</h1>
      <form action={`/api/ai-explainer`} method="POST" className="space-y-4">
        <input type="hidden" name="workspaceId" value={params.id} />
        <input name="title" placeholder="Short Title" className="w-full border p-2 rounded" required />
        <textarea name="prompt" placeholder="Describe the topic or paste a YouTube link..." className="w-full border p-2 rounded" rows={4} required />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Generate</button>
      </form>
    </div>
  );
}
