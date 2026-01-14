-- Create enum type for subscription status
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscriptionstatus') THEN
    CREATE TYPE "SubscriptionStatus" AS ENUM ('pending','active','cancelled','failed');
  END IF;
END$$;

-- Create Subscription table
CREATE TABLE IF NOT EXISTS "Subscription" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" TEXT NOT NULL,
  "workspaceId" TEXT NULL,
  "planId" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "providerOrderId" TEXT NULL UNIQUE,
  "status" "SubscriptionStatus" NOT NULL DEFAULT 'pending',
  "amountCents" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "startedAt" TIMESTAMP WITH TIME ZONE NULL,
  "expiresAt" TIMESTAMP WITH TIME ZONE NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Foreign keys
-- Foreign keys (add only if referenced tables exist)
DO $$
BEGIN
  IF to_regclass('"User"') IS NOT NULL THEN
    ALTER TABLE "Subscription"
      ADD CONSTRAINT "Subscription_user_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;
  END IF;

  IF to_regclass('"Workspace"') IS NOT NULL THEN
    ALTER TABLE "Subscription"
      ADD CONSTRAINT "Subscription_workspace_fkey"
      FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL;
  END IF;
END$$;
