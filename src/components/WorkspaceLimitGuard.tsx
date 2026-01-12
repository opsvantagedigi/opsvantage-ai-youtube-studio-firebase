import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function WorkspaceLimitGuard({ children, workspaceId }: { children: React.ReactNode, workspaceId: string }) {
  const session = await getServerSession();
  if (!session?.user?.email) redirect('/login');
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    include: { subscriptionPlan: true },
  });
  // Example: enforce max channels
  const maxChannels = workspace?.subscriptionPlan?.maxChannels ?? 1;
  const channelCount = await prisma.youTubeChannelConfig.count({ where: { workspaceId } });
  if (channelCount >= maxChannels) {
    return <div className="p-8 text-red-600">Plan limit reached. <a href={`/app/workspace/${workspaceId}/billing`} className="underline">Upgrade your plan</a> to add more channels.</div>;
  }
  return <>{children}</>;
}
