import { NextResponse } from 'next/server';
const { getPrisma } = require('@/lib/getPrisma');

export async function POST(req: Request, ctx: any) {
  try {
    const id = ctx?.params?.id as string;
    const body = await req.json().catch(() => ({}));
    const scheduledAt = body?.scheduledAt ? new Date(body.scheduledAt) : null;
    const prisma = getPrisma();
    await prisma.shortVideo.update({ where: { id }, data: { status: 'ready_to_upload', scheduledAt } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
