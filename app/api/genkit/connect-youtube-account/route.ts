// app/api/genkit/connect-youtube-account/route.ts
import { NextRequest } from 'next/server';

// This API route will call the deployed Genkit flow via HTTP request
// Since the flow is deployed as a Firebase Function, we'll make an HTTP call to it

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return Response.json(
        { error: 'Missing userId' },
        { status: 400 }
      );
    }

    // Call the deployed Genkit flow via HTTP request
    const response = await fetch(`https://us-central1-marz-ai-studio-ops.cloudfunctions.net/connectYouTubeAccount`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return Response.json(result);
  } catch (error) {
    console.error('Error in connect-youtube-account API route:', error);
    return Response.json(
      { error: 'Failed to connect YouTube account' },
      { status: 500 }
    );
  }
}