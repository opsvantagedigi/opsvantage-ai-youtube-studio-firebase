import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function ShortDetailPage({ params }: { params: { id: string, shortId: string } }) {
  const session = await getServerSession();
  if (!session?.user?.email) redirect('/login');
  const short = await prisma.shortVideo.findUnique({ where: { id: params.shortId } });
  if (!short) return <div className="p-8">Short not found.</div>;
  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">{short.title}</h1>
      <div className="mb-4"><b>Status:</b> {short.status}</div>
      <div className="mb-4"><b>Script:</b>
        <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">{short.script}</pre>
      </div>
      {/* Future: Add video preview, upload, publish actions */}
    </div>
  );
}
