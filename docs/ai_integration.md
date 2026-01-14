# AI Integration

## Where to Plug in a Real LLM
- See `lib/aiEngine.ts` for all AI logic
- Replace the mock functions with real API calls to OpenAI, Gemini, etc.
- Read API keys from environment variables (see `.env.example`)

## Adjusting Prompts
- Prompts can be customized per niche or content plan
- See comments in `lib/aiEngine.ts` for prompt structure

## Example: Using OpenAI
```ts
import { OpenAI } from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// ...
```

## Example: Using Gemini
```ts
// Use Google Gemini API client
```
