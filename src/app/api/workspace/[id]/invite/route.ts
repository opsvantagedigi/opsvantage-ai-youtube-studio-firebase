import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession();
  if (!session?.user?.email) return NextResponse.redirect('/login');
  const form = await req.formData();
  const email = form.get('email') as string;
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email }, include: { memberships: { where: { workspaceId: params.id } } } });
  const membership = user?.memberships[0];
  if (!membership || (membership.role !== 'owner' && membership.role !== 'editor')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  let invitee = await prisma.user.findUnique({ where: { email } });
  if (!invitee) {
    invitee = await prisma.user.create({ data: { email, name: email.split('@')[0] } });
  }
  await prisma.userWorkspaceMembership.upsert({
    where: { userId_workspaceId: { userId: invitee.id, workspaceId: params.id } },
    update: {},
    create: { userId: invitee.id, workspaceId: params.id, role: 'viewer' },
  });
  return NextResponse.redirect(`/app/workspace/${params.id}/members`);
}
