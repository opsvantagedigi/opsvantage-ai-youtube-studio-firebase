-- =============================
-- ENUMS
-- =============================

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'userrole') THEN
    CREATE TYPE "UserRole" AS ENUM ('admin','member','superuser');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscriptionstatus') THEN
    CREATE TYPE "SubscriptionStatus" AS ENUM ('pending','active','cancelled','failed');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'workspacerole') THEN
    CREATE TYPE "WorkspaceRole" AS ENUM ('owner','editor','viewer');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'timeframe') THEN
    CREATE TYPE "Timeframe" AS ENUM ('weekly','monthly','custom');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'shortvideostatus') THEN
    CREATE TYPE "ShortVideoStatus" AS ENUM ('idea','scripted','ready_to_upload','uploaded','failed');
  END IF;
END $$;

-- =============================
-- TABLES (each wrapped in DO block)
-- =============================

DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "name" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'member',
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
  );
END $$;

DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS "SubscriptionPlan" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "priceMonthly" INTEGER NOT NULL,
    "maxWorkspaces" INTEGER NOT NULL,
    "maxChannels" INTEGER NOT NULL,
    "maxVideosPerMonth" INTEGER NOT NULL
  );
END $$;

DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS "Workspace" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "ownerId" TEXT NOT NULL,
    "subscriptionPlanId" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
  );
END $$;

DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS "UserWorkspaceMembership" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "role" "WorkspaceRole" NOT NULL DEFAULT 'viewer'
  );
END $$;

DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS "YouTubeChannelConfig" (
    "id" TEXT PRIMARY KEY,
    "workspaceId" TEXT NOT NULL,
    "channelName" TEXT NOT NULL,
    "channelId" TEXT,
    "youtubeAccessToken" TEXT NOT NULL,
    "youtubeRefreshToken" TEXT NOT NULL,
    "tokenExpiry" TIMESTAMP WITH TIME ZONE NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
  );
END $$;

DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS "Niche" (
    "id" TEXT PRIMARY KEY,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true
  );
END $$;

DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS "ContentPlan" (
    "id" TEXT PRIMARY KEY,
    "workspaceId" TEXT NOT NULL,
    "nicheId" TEXT NOT NULL,
    "timeframe" "Timeframe" NOT NULL,
    "startDate" TIMESTAMP WITH TIME ZONE NOT NULL,
    "endDate" TIMESTAMP WITH TIME ZONE NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
  );
END $$;

DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS "ShortVideo" (
    "id" TEXT PRIMARY KEY,
    "workspaceId" TEXT NOT NULL,
    "contentPlanId" TEXT NOT NULL,
    "nicheId" TEXT NOT NULL,
    "dayIndex" INTEGER NOT NULL,
    "hook" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "script" TEXT NOT NULL,
    "hashtags" TEXT NOT NULL,
    "status" "ShortVideoStatus" NOT NULL DEFAULT 'idea',
    "youtubeVideoId" TEXT,
    "youtubeUrl" TEXT,
    "scheduledAt" TIMESTAMP WITH TIME ZONE,
    "uploadedAt" TIMESTAMP WITH TIME ZONE
  );
END $$;

DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS "Subscription" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "workspaceId" TEXT,
    "planId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerOrderId" TEXT UNIQUE,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'pending',
    "amountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "startedAt" TIMESTAMP WITH TIME ZONE,
    "expiresAt" TIMESTAMP WITH TIME ZONE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
  );
END $$;

DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS "AuditLog" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
  );
END $$;

-- =============================
-- FOREIGN KEYS (each wrapped in DO block)
-- =============================

DO $$ BEGIN
  ALTER TABLE "Workspace"
    ADD CONSTRAINT "Workspace_owner_fkey"
    FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "Workspace"
    ADD CONSTRAINT "Workspace_subscriptionPlan_fkey"
    FOREIGN KEY ("subscriptionPlanId") REFERENCES "SubscriptionPlan"("id") ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "UserWorkspaceMembership"
    ADD CONSTRAINT "UserWorkspaceMembership_user_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "UserWorkspaceMembership"
    ADD CONSTRAINT "UserWorkspaceMembership_workspace_fkey"
    FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "YouTubeChannelConfig"
    ADD CONSTRAINT "YouTubeChannelConfig_workspace_fkey"
    FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "Niche"
    ADD CONSTRAINT "Niche_workspace_fkey"
    FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "ContentPlan"
    ADD CONSTRAINT "ContentPlan_workspace_fkey"
    FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "ContentPlan"
    ADD CONSTRAINT "ContentPlan_niche_fkey"
    FOREIGN KEY ("nicheId") REFERENCES "Niche"("id") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "ShortVideo"
    ADD CONSTRAINT "ShortVideo_workspace_fkey"
    FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "ShortVideo"
    ADD CONSTRAINT "ShortVideo_contentPlan_fkey"
    FOREIGN KEY ("contentPlanId") REFERENCES "ContentPlan"("id") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "ShortVideo"
    ADD CONSTRAINT "ShortVideo_niche_fkey"
    FOREIGN KEY ("nicheId") REFERENCES "Niche"("id") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "Subscription"
    ADD CONSTRAINT "Subscription_user_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "Subscription"
    ADD CONSTRAINT "Subscription_workspace_fkey"
    FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "Subscription"
    ADD CONSTRAINT "Subscription_plan_fkey"
    FOREIGN KEY ("planId") REFERENCES "SubscriptionPlan"("id") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "AuditLog"
    ADD CONSTRAINT "AuditLog_user_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- =============================
-- UNIQUE CONSTRAINTS
-- =============================

DO $$ BEGIN
  ALTER TABLE "UserWorkspaceMembership"
    ADD CONSTRAINT "UserWorkspaceMembership_user_workspace_unique"
    UNIQUE ("userId", "workspaceId");
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "Niche"
    ADD CONSTRAINT "Niche_workspace_name_unique"
    UNIQUE ("workspaceId", "name");
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
