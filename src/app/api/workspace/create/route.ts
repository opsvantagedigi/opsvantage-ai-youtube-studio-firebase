import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.email) return NextResponse.redirect('/login');
  const form = await req.formData();
  const name = form.get('name') as string;
  if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 });
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.redirect('/login');
  const workspace = await prisma.workspace.create({
    data: {
      name,
      slug,
      ownerId: user.id,
      memberships: {
        create: { userId: user.id, role: 'owner' },
      },
    },
  });
  return NextResponse.redirect(`/app/workspace/${workspace.id}`);
}
