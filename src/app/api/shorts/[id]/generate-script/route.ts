import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateScriptForShort } from '@/lib/ai';

export async function POST(req: Request, ctx: any) {
  try {
    const id = ctx?.params?.id as string;
    const short = await prisma.shortVideo.findUnique({ where: { id } });
    if (!short) return NextResponse.json({ error: 'Short not found' }, { status: 404 });
    const result = await generateScriptForShort(id);
    await prisma.shortVideo.update({ where: { id }, data: { script: result.script, title: result.title || short.title, hashtags: result.hashtags || short.hashtags, status: 'scripted' } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
