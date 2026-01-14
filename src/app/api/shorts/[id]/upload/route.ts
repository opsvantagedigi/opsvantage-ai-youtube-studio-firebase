import { NextResponse } from 'next/server';
const { getPrisma } = require('@/lib/getPrisma');
import { uploadShort } from '@/lib/youtube';

export async function POST(req: Request, ctx: any) {
  try {
    const id = ctx?.params?.id as string;
    const prisma = getPrisma();
    const short = await prisma.shortVideo.findUnique({ where: { id } });
    if (!short) return NextResponse.json({ error: 'Short not found' }, { status: 404 });
    const workspaceId = short.workspaceId;
    const url = await uploadShort(workspaceId, id);
    return NextResponse.json({ ok: true, url });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
