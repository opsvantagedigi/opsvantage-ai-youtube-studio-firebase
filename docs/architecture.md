# Architecture Overview

## Modules
- **Frontend**: Next.js App Router, React, Tailwind CSS
- **Backend**: Next.js API routes (serverless), Prisma ORM
- **Database**: Postgres (hosted, e.g., Neon)
- **Auth**: NextAuth.js
- **AI Engine**: lib/aiEngine.ts (mocked, ready for LLM)
- **YouTube Integration**: lib/youtube.ts
- **Scheduling**: Vercel Cron + API route

## Data Flow
User → Workspace → Niche → ContentPlan → ShortVideo → YouTube

- Users can belong to multiple workspaces
- Each workspace can have multiple niches
- Each niche can have multiple content plans
- Each content plan generates ShortVideos
- ShortVideos are uploaded to YouTube via API

## Extending
- Add more workspaces, users, or niches via UI or seed script
- Add more automation or AI features in lib/aiEngine.ts
- Add more API integrations as needed
