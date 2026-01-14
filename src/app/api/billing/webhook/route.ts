import { NextRequest, NextResponse } from 'next/server';
const { getPrisma } = require('@/lib/getPrisma');

// NowPayments webhook handler
export async function POST(req: NextRequest) {
  const prisma = getPrisma();
  const event = await req.json();
  // Validate NowPayments signature if needed
  if (event.payment_status === 'finished' && event.order_id) {
    // Parse order_id: workspaceId-planId-timestamp
    const [workspaceId, planId] = event.order_id.split('-');
    // Update workspace subscriptionPlanId
    await prisma.workspace.update({
      where: { id: workspaceId },
      data: { subscriptionPlanId: planId },
    });
  }
  return NextResponse.json({ ok: true });
}
