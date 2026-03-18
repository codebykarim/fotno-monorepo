-- Step 1: Create new enums
CREATE TYPE "SubscriptionSource" AS ENUM ('LEMON_SQUEEZY', 'MANUAL');
CREATE TYPE "ManualPlanRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- Step 2: Add PAST_DUE to SubscriptionStatus
ALTER TYPE "SubscriptionStatus" ADD VALUE IF NOT EXISTS 'PAST_DUE';

-- Step 3: Add new columns to user table (before changing plan enum)
ALTER TABLE "user" ADD COLUMN "trialEndsAt" TIMESTAMP(3);
ALTER TABLE "user" ADD COLUMN "lsCustomerId" TEXT;
CREATE UNIQUE INDEX "user_lsCustomerId_key" ON "user"("lsCustomerId");

-- Step 4: Create the new Plan enum with TRIAL, PRO, EXPIRED
-- Prisma enums map to PostgreSQL enums. We need to:
-- 1. Create new enum
-- 2. Migrate the column
-- 3. Drop old enum

CREATE TYPE "Plan_new" AS ENUM ('TRIAL', 'PRO', 'EXPIRED');

-- Migrate existing plan values:
-- FREE -> EXPIRED (or TRIAL if user created within last 14 days)
-- STARTER, PROFESSIONAL, STUDIO, ENTERPRISE -> PRO
ALTER TABLE "user" ADD COLUMN "plan_new" "Plan_new" NOT NULL DEFAULT 'TRIAL';

UPDATE "user"
SET "plan_new" = CASE
  WHEN "plan" IN ('STARTER', 'PROFESSIONAL', 'STUDIO', 'ENTERPRISE') THEN 'PRO'::"Plan_new"
  WHEN "plan" = 'FREE' AND "createdAt" > NOW() - INTERVAL '14 days' THEN 'TRIAL'::"Plan_new"
  ELSE 'EXPIRED'::"Plan_new"
END;

-- Set trialEndsAt for all users
UPDATE "user"
SET "trialEndsAt" = CASE
  WHEN "plan_new" = 'TRIAL' THEN "createdAt" + INTERVAL '14 days'
  ELSE "createdAt" + INTERVAL '14 days'
END;

-- Set storageLimit for existing paid users based on old plan
UPDATE "user"
SET "storageLimit" = CASE
  WHEN "plan" = 'STARTER' THEN 50::bigint * 1024 * 1024 * 1024
  WHEN "plan" = 'PROFESSIONAL' THEN 500::bigint * 1024 * 1024 * 1024
  WHEN "plan" = 'STUDIO' THEN 2048::bigint * 1024 * 1024 * 1024
  WHEN "plan" = 'ENTERPRISE' THEN 10240::bigint * 1024 * 1024 * 1024
  ELSE "storageLimit"
END
WHERE "storageLimit" = 0 AND "plan" IN ('STARTER', 'PROFESSIONAL', 'STUDIO', 'ENTERPRISE');

-- Set storageLimit to trial limit for trial/free users without a limit
UPDATE "user"
SET "storageLimit" = 5::bigint * 1024 * 1024 * 1024
WHERE "storageLimit" = 0;

-- Swap the columns
ALTER TABLE "user" DROP COLUMN "plan";
ALTER TABLE "user" RENAME COLUMN "plan_new" TO "plan";

-- Drop old Plan enum and rename new one
DROP TYPE "Plan";
ALTER TYPE "Plan_new" RENAME TO "Plan";

-- Step 5: Remove old stripe fields
ALTER TABLE "user" DROP COLUMN IF EXISTS "stripeCustomerId";
ALTER TABLE "user" DROP COLUMN IF EXISTS "stripeSubId";

-- Step 6: Drop old Payment table and PlanType enum
DROP TABLE IF EXISTS "payment";
DROP TYPE IF EXISTS "PlanType";

-- Step 7: Create Subscription table
CREATE TABLE "subscription" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "source" "SubscriptionSource" NOT NULL,
  "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
  "storageTierGb" INTEGER NOT NULL,
  "priceCents" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "lsSubscriptionId" TEXT,
  "lsVariantId" TEXT,
  "currentPeriodStart" TIMESTAMP(3),
  "currentPeriodEnd" TIMESTAMP(3),
  "cancelledAt" TIMESTAMP(3),
  "endsAt" TIMESTAMP(3),
  "approvedBy" TEXT,
  "adminNotes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "subscription_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "subscription_lsSubscriptionId_key" ON "subscription"("lsSubscriptionId");
CREATE INDEX "subscription_userId_idx" ON "subscription"("userId");

ALTER TABLE "subscription" ADD CONSTRAINT "subscription_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Step 8: Create ManualPlanRequest table
CREATE TABLE "manual_plan_request" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "storageTierGb" INTEGER NOT NULL,
  "status" "ManualPlanRequestStatus" NOT NULL DEFAULT 'PENDING',
  "adminNotes" TEXT,
  "reviewedBy" TEXT,
  "reviewedAt" TIMESTAMP(3),
  "expiresAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "manual_plan_request_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "manual_plan_request_userId_idx" ON "manual_plan_request"("userId");
CREATE INDEX "manual_plan_request_status_idx" ON "manual_plan_request"("status");

ALTER TABLE "manual_plan_request" ADD CONSTRAINT "manual_plan_request_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
