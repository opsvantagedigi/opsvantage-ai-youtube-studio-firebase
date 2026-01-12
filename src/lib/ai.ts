import { prisma } from './prisma';

type GenerateResult = {
  script: string;
  hashtags?: string;
  title?: string;
};

async function callOpenAI(prompt: string): Promise<string> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY not set');

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 800,
    }),
  });
  if (!res.ok) throw new Error(`OpenAI error: ${res.statusText}`);
  const data: any = await res.json();
  const text = data?.choices?.[0]?.message?.content ?? data?.choices?.[0]?.text;
  return String(text ?? '').trim();
}

export async function generateScriptForShort(shortId: string) {
  const short = await prisma.shortVideo.findUnique({ where: { id: shortId } });
  if (!short) throw new Error('Short not found');

  const prompt = `Write a concise 3-4 sentence TikTok/Shorts script for this hook: "${short.hook}". Include a short engaging title and 3-5 hashtags as a comma-separated list.`;

  try {
    const out = await callOpenAI(prompt);
    // Simple parsing: assume first line title, rest script, hashtags at end after "Hashtags:"
    const parts = out.split('\n').map((s: string) => s.trim()).filter(Boolean);
    let title = short.title ?? '';
    let script = '';
    let hashtags = '';
    if (parts.length === 1) {
      script = parts[0];
    } else {
      title = parts[0];
      script = parts.slice(1).join('\n');
      const last = parts[parts.length - 1];
      if (/hashtag/i.test(last) || last.startsWith('#')) {
        hashtags = last;
      }
    }

    return { title, script, hashtags } as GenerateResult;
  } catch (err) {
    // fallback deterministic
    const fallbackScript = `${short.hook} — Quick explainer: keep it under 30 seconds. Call to action: follow for more.`;
    return { title: short.hook.slice(0, 50), script: fallbackScript, hashtags: '#opsvantage #shorts' } as GenerateResult;
  }
}

export default { generateScriptForShort };
