import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession();
  if (!session?.user?.email) return NextResponse.redirect('/login');
  const form = await req.formData();
  const membershipId = form.get('membershipId') as string;
  const role = form.get('role') as string;
  if (!membershipId || !role) return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  // Only allow owner/editor to update, and not demote owner
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { memberships: { where: { workspaceId: params.id } } },
  });
  const membership = user?.memberships[0];
  if (!membership || (membership.role !== 'owner' && membership.role !== 'editor')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const target = await prisma.userWorkspaceMembership.findUnique({ where: { id: membershipId } });
  if (!target || target.role === 'owner') return NextResponse.json({ error: 'Cannot change owner role' }, { status: 400 });
  await prisma.userWorkspaceMembership.update({ where: { id: membershipId }, data: { role } });
  return NextResponse.redirect(`/app/workspace/${params.id}/members`);
}
