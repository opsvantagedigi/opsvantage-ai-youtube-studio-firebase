import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Mocked AI engine for content generation
// Replace these with real LLM API calls (OpenAI, Gemini, etc.)
// Read API keys from process.env.OPENAI_API_KEY, etc.

export async function generateHooksForNiche(nicheName: string, count: number): Promise<string[]> {
  // TODO: Replace with real LLM call
  return Array.from({ length: count }, (_, i) => `${nicheName} Hook #${i + 1}`);
}

export async function generateScriptForHook(nicheName: string, hook: string): Promise<{ title: string; script: string; hashtags: string[] }> {
  // TODO: Replace with real LLM call
  return {
    title: `${hook} — ${nicheName}`,
    script: `Script for: ${hook} in ${nicheName}`,
    hashtags: ['#AI', '#Shorts', '#OpsVantage'],
  };
}

export async function generateContentPlan(nicheName: string, days: number): Promise<Array<{ dayIndex: number; hook: string }>> {
  // TODO: Replace with real LLM call
  return Array.from({ length: days }, (_, i) => ({ dayIndex: i + 1, hook: `${nicheName} Hook #${i + 1}` }));
}

// To use a real LLM:
// 1. Import the API client (e.g., OpenAI)
// 2. Read API key from process.env
// 3. Replace the mock logic with an API call
// 4. Adjust prompts as needed (see docs/ai_integration.md)
