import { NextResponse } from 'next/server';
const { getPrisma } = require('@/lib/getPrisma');

export async function GET(req: Request) {
  try {
    const prisma = getPrisma();
    const url = new URL(req.url);
    const workspaceId = url.searchParams.get('workspaceId');
    if (!workspaceId) return NextResponse.json({ error: 'workspaceId required' }, { status: 400 });
    const items = await prisma.shortVideo.findMany({ where: { workspaceId }, orderBy: { dayIndex: 'asc' } });
    return NextResponse.json(items);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
