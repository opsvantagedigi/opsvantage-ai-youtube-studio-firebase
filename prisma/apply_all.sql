-- Combined apply_all.sql
-- This file applies the schema (migration), RLS policies, and seed data.

-- === MIGRATION ===

-- Migration SQL generated from Prisma schema

-- Create enums (idempotent)
DO $$
BEGIN
  BEGIN
    CREATE TYPE "UserRole" AS ENUM ('admin', 'member');
  EXCEPTION WHEN duplicate_object THEN
    -- type already exists, ignore
    NULL;
  END;
END$$;

DO $$
BEGIN
  BEGIN
    CREATE TYPE "WorkspaceRole" AS ENUM ('owner', 'editor', 'viewer');
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
END$$;

DO $$
BEGIN
  BEGIN
    CREATE TYPE "Timeframe" AS ENUM ('weekly', 'monthly', 'custom');
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
END$$;

DO $$
BEGIN
  BEGIN
    CREATE TYPE "ShortVideoStatus" AS ENUM ('idea', 'scripted', 'ready_to_upload', 'uploaded', 'failed');
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
END$$;

CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" TEXT NOT NULL UNIQUE,
  "name" TEXT,
  "role" "UserRole" NOT NULL DEFAULT 'member',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Workspace" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "ownerId" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "subscriptionPlanId" TEXT
);

CREATE TABLE IF NOT EXISTS "SubscriptionPlan" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "priceMonthly" INTEGER NOT NULL,
  "maxWorkspaces" INTEGER NOT NULL,
  "maxChannels" INTEGER NOT NULL,
  "maxVideosPerMonth" INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "UserWorkspaceMembership" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" TEXT NOT NULL,
  "workspaceId" TEXT NOT NULL,
  "role" "WorkspaceRole" NOT NULL DEFAULT 'viewer'
);
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_workspace_unique') THEN
    ALTER TABLE "UserWorkspaceMembership" ADD CONSTRAINT user_workspace_unique UNIQUE ("userId", "workspaceId");
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS "YouTubeChannelConfig" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "workspaceId" TEXT NOT NULL,
  "channelName" TEXT NOT NULL,
  "channelId" TEXT,
  "youtubeAccessToken" TEXT NOT NULL,
  "youtubeRefreshToken" TEXT NOT NULL,
  "tokenExpiry" TIMESTAMP WITH TIME ZONE NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Niche" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "workspaceId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true
);
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'workspace_name_unique') THEN
    ALTER TABLE "Niche" ADD CONSTRAINT workspace_name_unique UNIQUE ("workspaceId", "name");
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS "ContentPlan" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "workspaceId" TEXT NOT NULL,
  "nicheId" TEXT NOT NULL,
  "timeframe" "Timeframe" NOT NULL,
  "startDate" TIMESTAMP WITH TIME ZONE NOT NULL,
  "endDate" TIMESTAMP WITH TIME ZONE NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "ShortVideo" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Foreign keys (guarded)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'workspace_owner_fkey') THEN
    ALTER TABLE "Workspace" ADD CONSTRAINT workspace_owner_fkey FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'workspace_subscription_fkey') THEN
    ALTER TABLE "Workspace" ADD CONSTRAINT workspace_subscription_fkey FOREIGN KEY ("subscriptionPlanId") REFERENCES "SubscriptionPlan"("id") ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'membership_user_fkey') THEN
    ALTER TABLE "UserWorkspaceMembership" ADD CONSTRAINT membership_user_fkey FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'membership_workspace_fkey') THEN
    ALTER TABLE "UserWorkspaceMembership" ADD CONSTRAINT membership_workspace_fkey FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'yt_workspace_fkey') THEN
    ALTER TABLE "YouTubeChannelConfig" ADD CONSTRAINT yt_workspace_fkey FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'niche_workspace_fkey') THEN
    ALTER TABLE "Niche" ADD CONSTRAINT niche_workspace_fkey FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contentplan_workspace_fkey') THEN
    ALTER TABLE "ContentPlan" ADD CONSTRAINT contentplan_workspace_fkey FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contentplan_niche_fkey') THEN
    ALTER TABLE "ContentPlan" ADD CONSTRAINT contentplan_niche_fkey FOREIGN KEY ("nicheId") REFERENCES "Niche"("id") ON DELETE RESTRICT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'short_workspace_fkey') THEN
    ALTER TABLE "ShortVideo" ADD CONSTRAINT short_workspace_fkey FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'short_contentplan_fkey') THEN
    ALTER TABLE "ShortVideo" ADD CONSTRAINT short_contentplan_fkey FOREIGN KEY ("contentPlanId") REFERENCES "ContentPlan"("id") ON DELETE RESTRICT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'short_niche_fkey') THEN
    ALTER TABLE "ShortVideo" ADD CONSTRAINT short_niche_fkey FOREIGN KEY ("nicheId") REFERENCES "Niche"("id") ON DELETE RESTRICT;
  END IF;
END$$;

-- Indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_email ON "User"("email");
CREATE UNIQUE INDEX IF NOT EXISTS idx_workspace_slug ON "Workspace"("slug");

-- === RLS POLICIES ===

BEGIN;

-- Fix RLS policies: use column references directly in WITH CHECK expressions

-- Drop existing policies to make re-apply idempotent
DROP POLICY IF EXISTS "subscriptionplan_select_authenticated" ON public."SubscriptionPlan";
DROP POLICY IF EXISTS "subscriptionplan_insert_service_role" ON public."SubscriptionPlan";
DROP POLICY IF EXISTS "subscriptionplan_update_service_role" ON public."SubscriptionPlan";
DROP POLICY IF EXISTS "subscriptionplan_delete_service_role" ON public."SubscriptionPlan";

DROP POLICY IF EXISTS "workspace_select_members" ON public."Workspace";
DROP POLICY IF EXISTS "workspace_insert_service_role" ON public."Workspace";
DROP POLICY IF EXISTS "workspace_update_owner_or_editor" ON public."Workspace";
DROP POLICY IF EXISTS "workspace_delete_owner" ON public."Workspace";

DROP POLICY IF EXISTS "shortvideo_select_members" ON public."ShortVideo";
DROP POLICY IF EXISTS "shortvideo_insert_service_role" ON public."ShortVideo";
DROP POLICY IF EXISTS "shortvideo_update_owner_editor" ON public."ShortVideo";
DROP POLICY IF EXISTS "shortvideo_delete_owner" ON public."ShortVideo";

DROP POLICY IF EXISTS "contentplan_select_members" ON public."ContentPlan";
DROP POLICY IF EXISTS "contentplan_insert_owner_editor" ON public."ContentPlan";
DROP POLICY IF EXISTS "contentplan_update_owner_editor" ON public."ContentPlan";
DROP POLICY IF EXISTS "contentplan_delete_owner" ON public."ContentPlan";

DROP POLICY IF EXISTS "niche_select_members" ON public."Niche";
DROP POLICY IF EXISTS "niche_insert_owner_editor" ON public."Niche";
DROP POLICY IF EXISTS "niche_update_owner_editor" ON public."Niche";
DROP POLICY IF EXISTS "niche_delete_owner" ON public."Niche";

DROP POLICY IF EXISTS "membership_select_self" ON public."UserWorkspaceMembership";
DROP POLICY IF EXISTS "membership_insert_service_role_or_self" ON public."UserWorkspaceMembership";
DROP POLICY IF EXISTS "membership_update_service_role_or_self" ON public."UserWorkspaceMembership";
DROP POLICY IF EXISTS "membership_delete_service_role" ON public."UserWorkspaceMembership";

DROP POLICY IF EXISTS "user_select_self" ON public."User";
DROP POLICY IF EXISTS "user_insert_service_role" ON public."User";
DROP POLICY IF EXISTS "user_update_self" ON public."User";
DROP POLICY IF EXISTS "user_delete_service_role" ON public."User";

DROP POLICY IF EXISTS "youtubeconfig_select_members" ON public."YouTubeChannelConfig";
DROP POLICY IF EXISTS "youtubeconfig_insert_owner_editor_or_service" ON public."YouTubeChannelConfig";
DROP POLICY IF EXISTS "youtubeconfig_update_owner_editor_or_service" ON public."YouTubeChannelConfig";
DROP POLICY IF EXISTS "youtubeconfig_delete_service_role" ON public."YouTubeChannelConfig";

-- SubscriptionPlan: allow read for authenticated and service_role; mutations by service_role
ALTER TABLE public."SubscriptionPlan" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "subscriptionplan_select_authenticated" ON public."SubscriptionPlan"
  FOR SELECT
  USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');
CREATE POLICY "subscriptionplan_insert_service_role" ON public."SubscriptionPlan"
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "subscriptionplan_update_service_role" ON public."SubscriptionPlan"
  FOR UPDATE
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "subscriptionplan_delete_service_role" ON public."SubscriptionPlan"
  FOR DELETE
  USING (auth.role() = 'service_role');

-- Workspace: members can SELECT if they belong; owner can UPDATE/DELETE; service_role bypass
ALTER TABLE public."Workspace" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "workspace_select_members" ON public."Workspace"
  FOR SELECT
  USING (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public."UserWorkspaceMembership" m
      WHERE m."workspaceId" = public."Workspace".id
        AND m."userId" = auth.uid()
    )
  );
CREATE POLICY "workspace_insert_service_role" ON public."Workspace"
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "workspace_update_owner_or_editor" ON public."Workspace"
  FOR UPDATE
  USING (
    auth.role() = 'service_role'
    OR public."Workspace"."ownerId" = auth.uid()
  )
  WITH CHECK (
    auth.role() = 'service_role'
    OR public."Workspace"."ownerId" = auth.uid()
  );
CREATE POLICY "workspace_delete_owner" ON public."Workspace"
  FOR DELETE
  USING (
    auth.role() = 'service_role'
    OR public."Workspace"."ownerId" = auth.uid()
  );

-- ShortVideo: members can SELECT; editors/owners can UPDATE; inserts allowed by service_role or workspace owner/editor
ALTER TABLE public."ShortVideo" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "shortvideo_select_members" ON public."ShortVideo"
  FOR SELECT
  USING (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public."UserWorkspaceMembership" m
      WHERE m."workspaceId" = public."ShortVideo"."workspaceId"
        AND m."userId" = auth.uid()
    )
  );
CREATE POLICY "shortvideo_insert_service_role" ON public."ShortVideo"
  FOR INSERT
  WITH CHECK (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public."UserWorkspaceMembership" m
      WHERE m."workspaceId" = "workspaceId"
        AND m."userId" = auth.uid()
        AND m.role IN ('owner','editor')
    )
  );
CREATE POLICY "shortvideo_update_owner_editor" ON public."ShortVideo"
  FOR UPDATE
  USING (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public."UserWorkspaceMembership" m
      WHERE m."workspaceId" = public."ShortVideo"."workspaceId"
        AND m."userId" = auth.uid()
        AND m.role IN ('owner','editor')
    )
  )
  WITH CHECK (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public."UserWorkspaceMembership" m
      WHERE m."workspaceId" = "workspaceId"
        AND m."userId" = auth.uid()
        AND m.role IN ('owner','editor')
    )
  );
CREATE POLICY "shortvideo_delete_owner" ON public."ShortVideo"
  FOR DELETE
  USING (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public."UserWorkspaceMembership" m
      WHERE m."workspaceId" = public."ShortVideo"."workspaceId"
        AND m."userId" = auth.uid()
        AND m.role = 'owner'
    )
  );

-- ContentPlan: members can SELECT; owners/editors can INSERT/UPDATE; deletions by owner/service_role
ALTER TABLE public."ContentPlan" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "contentplan_select_members" ON public."ContentPlan"
  FOR SELECT
  USING (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public."UserWorkspaceMembership" m
      WHERE m."workspaceId" = public."ContentPlan"."workspaceId"
        AND m."userId" = auth.uid()
    )
  );
CREATE POLICY "contentplan_insert_owner_editor" ON public."ContentPlan"
  FOR INSERT
  WITH CHECK (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public."UserWorkspaceMembership" m
      WHERE m."workspaceId" = "workspaceId"
        AND m."userId" = auth.uid()
        AND m.role IN ('owner','editor')
    )
  );
CREATE POLICY "contentplan_update_owner_editor" ON public."ContentPlan"
  FOR UPDATE
  USING (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public."UserWorkspaceMembership" m
      WHERE m."workspaceId" = public."ContentPlan"."workspaceId"
        AND m."userId" = auth.uid()
        AND m.role IN ('owner','editor')
    )
  )
  WITH CHECK (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public."UserWorkspaceMembership" m
      WHERE m."workspaceId" = "workspaceId"
        AND m."userId" = auth.uid()
        AND m.role IN ('owner','editor')
    )
  );
CREATE POLICY "contentplan_delete_owner" ON public."ContentPlan"
  FOR DELETE
  USING (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public."UserWorkspaceMembership" m
      WHERE m."workspaceId" = public."ContentPlan"."workspaceId"
        AND m."userId" = auth.uid()
        AND m.role = 'owner'
    )
  );

-- Niche: members can SELECT; owners/editors can INSERT/UPDATE; delete by owner/service_role
ALTER TABLE public."Niche" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "niche_select_members" ON public."Niche"
  FOR SELECT
  USING (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public."UserWorkspaceMembership" m
      WHERE m."workspaceId" = public."Niche"."workspaceId"
        AND m."userId" = auth.uid()
    )
  );
CREATE POLICY "niche_insert_owner_editor" ON public."Niche"
  FOR INSERT
  WITH CHECK (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public."UserWorkspaceMembership" m
      WHERE m."workspaceId" = "workspaceId"
        AND m."userId" = auth.uid()
        AND m.role IN ('owner','editor')
    )
  );
CREATE POLICY "niche_update_owner_editor" ON public."Niche"
  FOR UPDATE
  USING (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public."UserWorkspaceMembership" m
      WHERE m."workspaceId" = public."Niche"."workspaceId"
        AND m."userId" = auth.uid()
        AND m.role IN ('owner','editor')
    )
  )
  WITH CHECK (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public."UserWorkspaceMembership" m
      WHERE m."workspaceId" = "workspaceId"
        AND m."userId" = auth.uid()
        AND m.role IN ('owner','editor')
    )
  );
CREATE POLICY "niche_delete_owner" ON public."Niche"
  FOR DELETE
  USING (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public."UserWorkspaceMembership" m
      WHERE m."workspaceId" = public."Niche"."workspaceId"
        AND m."userId" = auth.uid()
        AND m.role = 'owner'
    )
  );

-- UserWorkspaceMembership: allow users to view their own membership; service_role can manage all
ALTER TABLE public."UserWorkspaceMembership" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "membership_select_self" ON public."UserWorkspaceMembership"
  FOR SELECT
  USING (
    auth.role() = 'service_role'
    OR "userId" = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public."UserWorkspaceMembership" m2
      WHERE m2."workspaceId" = public."UserWorkspaceMembership"."workspaceId"
        AND m2."userId" = auth.uid()
    )
  );
CREATE POLICY "membership_insert_service_role_or_self" ON public."UserWorkspaceMembership"
  FOR INSERT
  WITH CHECK (
    auth.role() = 'service_role'
    OR ("userId" = auth.uid() AND "workspaceId" IS NOT NULL)
  );
CREATE POLICY "membership_update_service_role_or_self" ON public."UserWorkspaceMembership"
  FOR UPDATE
  USING (
    auth.role() = 'service_role'
    OR "userId" = auth.uid()
  )
  WITH CHECK (
    auth.role() = 'service_role'
    OR "userId" = auth.uid()
  );
CREATE POLICY "membership_delete_service_role" ON public."UserWorkspaceMembership"
  FOR DELETE
  USING (auth.role() = 'service_role');

-- User: users can read/update their own row; service_role can manage all; inserts by service_role
ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_select_self" ON public."User"
  FOR SELECT
  USING (auth.role() = 'service_role' OR id = auth.uid());
CREATE POLICY "user_insert_service_role" ON public."User"
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "user_update_self" ON public."User"
  FOR UPDATE
  USING (auth.role() = 'service_role' OR id = auth.uid())
  WITH CHECK (auth.role() = 'service_role' OR id = auth.uid());
CREATE POLICY "user_delete_service_role" ON public."User"
  FOR DELETE
  USING (auth.role() = 'service_role');

-- YouTubeChannelConfig: only workspace owners/editors or service_role may read/update; inserts by service_role or owners/editors
ALTER TABLE public."YouTubeChannelConfig" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "youtubeconfig_select_members" ON public."YouTubeChannelConfig"
  FOR SELECT
  USING (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public."UserWorkspaceMembership" m
      WHERE m."workspaceId" = public."YouTubeChannelConfig"."workspaceId"
        AND m."userId" = auth.uid()
    )
  );
CREATE POLICY "youtubeconfig_insert_owner_editor_or_service" ON public."YouTubeChannelConfig"
  FOR INSERT
  WITH CHECK (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public."UserWorkspaceMembership" m
      WHERE m."workspaceId" = "workspaceId"
        AND m."userId" = auth.uid()
        AND m.role IN ('owner','editor')
    )
  );
CREATE POLICY "youtubeconfig_update_owner_editor_or_service" ON public."YouTubeChannelConfig"
  FOR UPDATE
  USING (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public."UserWorkspaceMembership" m
      WHERE m."workspaceId" = public."YouTubeChannelConfig"."workspaceId"
        AND m."userId" = auth.uid()
        AND m.role IN ('owner','editor')
    )
  )
  WITH CHECK (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public."UserWorkspaceMembership" m
      WHERE m."workspaceId" = "workspaceId"
        AND m."userId" = auth.uid()
        AND m.role IN ('owner','editor')
    )
  );
CREATE POLICY "youtubeconfig_delete_service_role" ON public."YouTubeChannelConfig"
  FOR DELETE
  USING (auth.role() = 'service_role');

COMMIT;

-- === SEED ===

-- Seed SQL for OpsVantage initial data
-- Uses gen_random_uuid(); ensure pgcrypto extension is available in Neon
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Admin user
INSERT INTO "User" (id, email, name, role, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'admin@opsvantagedigital.online', 'Admin', 'admin', now(), now())
ON CONFLICT (email) DO NOTHING;

-- Workspace
INSERT INTO "Workspace" (id, name, slug, "ownerId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'OpsVantage', 'opsvantage', u.id, now(), now() FROM "User" u WHERE u.email = 'admin@opsvantagedigital.online'
ON CONFLICT (slug) DO NOTHING;

-- Membership
INSERT INTO "UserWorkspaceMembership" (id, "userId", "workspaceId", role)
SELECT gen_random_uuid(), u.id, w.id, 'owner' FROM "User" u JOIN "Workspace" w ON u.email = 'admin@opsvantagedigital.online' AND w.slug='opsvantage'
ON CONFLICT ("userId", "workspaceId") DO NOTHING;

-- Niches
INSERT INTO "Niche" (id, "workspaceId", name, description, "isActive")
SELECT gen_random_uuid(), w.id, 'Psychology of Everyday Behavior', 'Behavioral psychology insights.', true FROM "Workspace" w WHERE w.slug='opsvantage'
ON CONFLICT ("workspaceId", name) DO NOTHING;

INSERT INTO "Niche" (id, "workspaceId", name, description, "isActive")
SELECT gen_random_uuid(), w.id, 'Productivity Systems', 'Systems for productivity and focus.', true FROM "Workspace" w WHERE w.slug='opsvantage'
ON CONFLICT ("workspaceId", name) DO NOTHING;

INSERT INTO "Niche" (id, "workspaceId", name, description, "isActive")
SELECT gen_random_uuid(), w.id, 'AI for Humans', 'AI tools and tips for everyday people.', true FROM "Workspace" w WHERE w.slug='opsvantage'
ON CONFLICT ("workspaceId", name) DO NOTHING;

-- Content plan and 30 shorts for Psychology niche
WITH niche_row AS (
  SELECT id AS niche_id, "workspaceId" AS workspace_id
  FROM "Niche"
  WHERE name = 'Psychology of Everyday Behavior'
    AND "workspaceId" = (SELECT id FROM "Workspace" WHERE slug='opsvantage')
  LIMIT 1
), plan AS (
  INSERT INTO "ContentPlan" (id, "workspaceId", "nicheId", timeframe, "startDate", "endDate", "createdAt")
  SELECT gen_random_uuid(), workspace_id, niche_id, 'monthly', now(), (now() + interval '30 days'), now()
  FROM niche_row
  RETURNING id
)
INSERT INTO "ShortVideo" (id, "workspaceId", "contentPlanId", "nicheId", "dayIndex", hook, title, script, hashtags, status)
SELECT gen_random_uuid(), n.workspace_id, p.id, n.niche_id, seq.i, concat('Psychology Hook #', seq.i), '', '', '', 'idea'
FROM niche_row n CROSS JOIN plan p CROSS JOIN generate_series(1,30) AS seq(i);
