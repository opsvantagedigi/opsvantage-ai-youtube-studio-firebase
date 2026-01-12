import { NextRequest, NextResponse } from 'next/server';

// This endpoint starts the YouTube OAuth flow
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const workspaceId = form.get('workspaceId') as string;
  // Construct Google OAuth URL
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/youtube/oauth/callback`,
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.upload',
    access_type: 'offline',
    state: workspaceId,
    prompt: 'consent',
  });
  const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  return NextResponse.redirect(url);
}
