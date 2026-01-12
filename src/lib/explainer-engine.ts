import fetch from 'node-fetch';

export type ExplainerOutput = {
  title: string;
  script: string;
  keyPoints: string[];
  hashtags: string[];
};

function safeExtractJSON(text: string): any | null {
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace === -1 || lastBrace === -1) return null;
  const jsonLike = text.slice(firstBrace, lastBrace + 1);
  try {
    return JSON.parse(jsonLike);
  } catch (err) {
    return null;
  }
}

function deterministicFallback(prompt: string, niche: string): ExplainerOutput {
  const cleaned = prompt.replace(/\s+/g, ' ').trim();
  const words = cleaned.split(' ').filter(Boolean);
  const titleSnippet = words.slice(0, 8).join(' ');

  const title = `${niche ? `${niche} — ` : ''}${titleSnippet}`;
  const script = `Explainer: ${cleaned}.\n\nSummary:\nProvide a concise, step-by-step explanation suitable for the selected audience. Begin with an overview, then list core components, and finish with an example or next steps.`;

  const keyPoints = [
    `What it is: A brief statement about ${titleSnippet}.`,
    `How it works: Core steps or components to understand the system.`,
    `Why it matters: Benefits and common pitfalls to watch for.`,
  ];

  const hashtags = [
    `#${niche.replace(/\s+/g, '')}`,
    `#Explainer`,
    `#OpsVantage`,
  ];

  return { title, script, keyPoints, hashtags };
}

export async function generateExplainer({ prompt, niche }: { prompt: string; niche: string }): Promise<ExplainerOutput> {
  const OPENAI_KEY = process.env.OPENAI_API_KEY;
  const GEMINI_KEY = process.env.GEMINI_API_KEY;

  const systemMessage = `You are an expert technical writer and explainer focused on clear, concise, and actionable content for operational teams. Respond with valid JSON only. The JSON object must have keys: title (string), script (string), keyPoints (array of short strings), hashtags (array of short strings). Do not include any extra text outside the JSON object.`;

  const userMessage = `Input: ${prompt}\nAudience/Niche: ${niche}\nProduce: title, full script suitable for a short explainer (3-6 concise paragraphs or bullets), 3-6 key points, and 3-6 hashtags.`;

  try {
    if (OPENAI_KEY) {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OPENAI_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: userMessage },
          ],
          max_tokens: 800,
          temperature: 0.2,
        }),
      });

      const data: any = await res.json().catch(() => null);
      const text =
        data?.choices?.[0]?.message?.content ?? data?.choices?.[0]?.text ?? String(data ?? '');
      const parsed = safeExtractJSON(String(text));
      if (parsed && parsed.title && parsed.script) {
        return {
          title: String(parsed.title),
          script: String(parsed.script),
          keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints.map(String) : [],
          hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags.map(String) : [],
        };
      }
    }

    if (GEMINI_KEY) {
      const url = `https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generate?key=${GEMINI_KEY}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: { text: `${systemMessage}\n\n${userMessage}` },
          temperature: 0.2,
          candidate_count: 1,
        }),
      });
      const data: any = await res.json().catch(() => null);
      const text = data?.candidates?.[0]?.content ?? data?.candidates?.[0]?.output ?? String(data ?? '');
      const parsed = safeExtractJSON(String(text));
      if (parsed && parsed.title && parsed.script) {
        return {
          title: String(parsed.title),
          script: String(parsed.script),
          keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints.map(String) : [],
          hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags.map(String) : [],
        };
      }
    }
  } catch (err) {
    // silently fall through to deterministic fallback
  }

  return deterministicFallback(prompt, niche || 'General');
}
