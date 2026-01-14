import { NextRequest, NextResponse } from 'next/server';
const { getPrisma } = require('@/lib/getPrisma');

export async function POST(req: NextRequest) {
  const prisma = getPrisma();
  const { userId, action, details } = await req.json();
  if (!userId || !action) return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  await prisma.auditLog.create({
    data: {
      userId,
      action,
      details: details || '',
      timestamp: new Date(),
    },
  });
  return NextResponse.json({ ok: true });
}
