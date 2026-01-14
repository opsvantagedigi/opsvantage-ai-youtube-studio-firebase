@echo off
set "DATABASE_URL=postgresql://neondb_owner:npg_u8GEIZxy5Rkc@ep-empty-cherry-a7v42mn1-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
set "PRISMA_CLIENT_ENGINE_TYPE=binary"
npm run start
