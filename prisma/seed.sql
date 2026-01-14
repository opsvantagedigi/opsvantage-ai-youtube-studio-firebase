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
