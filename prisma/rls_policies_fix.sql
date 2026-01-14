BEGIN;

-- Fix RLS policies: use column references directly in WITH CHECK expressions

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
