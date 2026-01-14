# YouTube API Setup

## 1. Create a Google Cloud Project
- Go to https://console.developers.google.com/
- Create a new project
- Enable YouTube Data API v3

## 2. Create OAuth 2.0 Credentials
- Go to "APIs & Services" > "Credentials"
- Create OAuth client ID (Web application)
- Set redirect URI to: `https://your-domain.com/api/workspaces/[workspaceId]/youtube/callback`
- Copy client ID and secret to `.env`

## 3. Configure Environment Variables
- `YOUTUBE_CLIENT_ID`
- `YOUTUBE_CLIENT_SECRET`
- `YOUTUBE_REDIRECT_URI`

## 4. Run OAuth Flow
- Each workspace connects its own YouTube channel
- Use the UI to start the OAuth flow
- Tokens are stored per workspace

## 5. Uploading Shorts
- Video files must be accessible to the server (e.g., via storage URL)
- See `lib/youtube.ts` for upload logic
