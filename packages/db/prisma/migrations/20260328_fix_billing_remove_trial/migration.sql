/*
  Warnings:

  - The values [TRIAL] on the enum `Plan` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `trialEndsAt` on the `user` table. All the data in the column will be lost.

*/

-- Step 1: Migrate any existing TRIAL users to FREE
UPDATE "user" SET "plan" = 'FREE' WHERE "plan" = 'TRIAL';

-- Step 2: Drop trialEndsAt column from user table
ALTER TABLE "user" DROP COLUMN IF EXISTS "trialEndsAt";

-- Step 3: Recreate Plan enum without TRIAL
-- Must drop the default before casting, then re-add it after
ALTER TABLE "user" ALTER COLUMN "plan" DROP DEFAULT;
CREATE TYPE "Plan_new" AS ENUM ('FREE', 'PRO', 'EXPIRED');
ALTER TABLE "user" ALTER COLUMN "plan" TYPE "Plan_new" USING ("plan"::text::"Plan_new");
ALTER TYPE "Plan" RENAME TO "Plan_old";
ALTER TYPE "Plan_new" RENAME TO "Plan";
DROP TYPE "Plan_old";
ALTER TABLE "user" ALTER COLUMN "plan" SET DEFAULT 'FREE'::"Plan";

-- Step 4: Add pending tier fields to subscription table
ALTER TABLE "subscription" ADD COLUMN "pendingTierGb" INTEGER,
ADD COLUMN "pendingEffectiveAt" TIMESTAMP(3);
