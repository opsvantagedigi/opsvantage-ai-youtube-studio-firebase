$Env:DATABASE_URL = 'postgresql://neondb_owner:npg_u8GEIZxy5Rkc@ep-empty-cherry-a7v42mn1-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
$Env:PRISMA_CLIENT_ENGINE_TYPE = 'binary'
Write-Output "Starting Next.js (npm run start) with DATABASE_URL set"
npm run start
