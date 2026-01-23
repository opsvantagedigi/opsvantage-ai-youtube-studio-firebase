// app/api/genkit/generate-content-strategy/route.ts
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, projectId } = body;

    if (!userId || !projectId) {
      return Response.json(
        { error: 'Missing userId or projectId' },
        { status: 400 }
      );
    }

    // Call the deployed Genkit flow via HTTP request
    const response = await fetch(`https://us-central1-marz-ai-studio-ops.cloudfunctions.net/generateContentStrategy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, projectId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return Response.json(result);
  } catch (error) {
    console.error('Error in generate-content-strategy API route:', error);
    return Response.json(
      { error: 'Failed to generate content strategy' },
      { status: 500 }
    );
  }
}