import { NextRequest, NextResponse } from 'next/server';
import { generateExplainer } from '@/lib/explainer-engine';
const { getPrisma } = require('@/lib/getPrisma');

// Support form POST for AI-powered short generation
export async function POST(req: NextRequest) {
  if (req.headers.get('content-type')?.includes('application/json')) {
    try {
      const body = await req.json().catch(() => ({}));
      if (!body || typeof body.prompt !== 'string' || !body.prompt.trim()) {
        return NextResponse.json({ message: 'Invalid request: prompt is required' }, { status: 400 });
      }
      const niche = typeof body.niche === 'string' && body.niche.trim() ? body.niche.trim() : 'General';
      const result = await generateExplainer({ prompt: body.prompt.trim(), niche });
      return NextResponse.json(result, { status: 200 });
    } catch (err) {
      console.error('ai-explainer error', err);
      return NextResponse.json({ message: 'Failed to generate explainer' }, { status: 500 });
    }
  } else {
    // Handle form POST from UI
    const form = await req.formData();
    const workspaceId = form.get('workspaceId') as string;
    const title = form.get('title') as string;
    const prompt = form.get('prompt') as string;
    if (!workspaceId || !title || !prompt) return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    // Call AI engine to generate script
    // (Assume generateExplainer returns { script })
    const result = await generateExplainer({ prompt, niche: 'General' });
    const script = result?.script || '';
    // Save short video (requires prisma)
    // Use placeholder values for required fields
    const prisma = getPrisma();
    const short = await prisma.shortVideo.create({
      data: {
        workspaceId,
        contentPlanId: 'placeholder', // TODO: link to real ContentPlan
        nicheId: 'placeholder', // TODO: link to real Niche
        dayIndex: 0,
        hook: '',
        title,
        script,
        hashtags: '',
        status: 'scripted',
      },
    });
    return NextResponse.redirect(`/app/workspace/${workspaceId}/shorts/${short.id}`);
  }
}
