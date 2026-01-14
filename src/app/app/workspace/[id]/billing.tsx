import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function BillingPage({ params }: { params: { id: string } }) {
  const session = await getServerSession();
  if (!session?.user?.email) redirect('/login');
  const workspace = await prisma.workspace.findUnique({
    where: { id: params.id },
    include: { subscriptionPlan: true },
  });
  if (!workspace) return <div className="p-8">Workspace not found.</div>;
  const plans = [
    { id: 'basic', name: 'Basic', price: 10 },
    { id: 'pro', name: 'Pro', price: 30 },
  ];
  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Billing for {workspace.name}</h1>
      <div className="mb-4">Current plan: <b>{workspace.subscriptionPlan?.name || 'Free'}</b></div>
      <form
        action="/api/billing/create-payment"
        method="POST"
        target="_blank"
        className="space-y-4"
      >
        <input type="hidden" name="workspaceId" value={workspace.id} />
        <select name="planId" className="w-full border p-2 rounded">
          {plans.map(plan => (
            <option key={plan.id} value={plan.id}>
              {plan.name} (${plan.price}/mo)
            </option>
          ))}
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Upgrade</button>
      </form>
    </div>
  );
}
