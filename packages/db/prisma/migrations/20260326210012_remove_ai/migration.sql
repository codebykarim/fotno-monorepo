/*
  Warnings:

  - The values [LEMON_SQUEEZY,MANUAL] on the enum `SubscriptionSource` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `aiContext` on the `gallery` table. All the data in the column will be lost.
  - You are about to drop the column `aiCaption` on the `photo` table. All the data in the column will be lost.
  - You are about to drop the column `aiTags` on the `photo` table. All the data in the column will be lost.
  - You are about to drop the column `faceCount` on the `photo` table. All the data in the column will be lost.
  - You are about to drop the column `adminNotes` on the `subscription` table. All the data in the column will be lost.
  - You are about to drop the column `approvedBy` on the `subscription` table. All the data in the column will be lost.
  - You are about to drop the `manual_plan_request` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SubscriptionSource_new" AS ENUM ('STRIPE');
ALTER TABLE "subscription" ALTER COLUMN "source" TYPE "SubscriptionSource_new" USING ("source"::text::"SubscriptionSource_new");
ALTER TYPE "SubscriptionSource" RENAME TO "SubscriptionSource_old";
ALTER TYPE "SubscriptionSource_new" RENAME TO "SubscriptionSource";
DROP TYPE "public"."SubscriptionSource_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "manual_plan_request" DROP CONSTRAINT "manual_plan_request_userId_fkey";

-- AlterTable
ALTER TABLE "gallery" DROP COLUMN "aiContext";

-- AlterTable
ALTER TABLE "photo" DROP COLUMN "aiCaption",
DROP COLUMN "aiTags",
DROP COLUMN "faceCount";

-- AlterTable
ALTER TABLE "subscription" DROP COLUMN "adminNotes",
DROP COLUMN "approvedBy";

-- DropTable
DROP TABLE "manual_plan_request";

-- DropEnum
DROP TYPE "ManualPlanRequestStatus";

-- RenameIndex
ALTER INDEX "subscription_lsSubscriptionId_key" RENAME TO "subscription_stripeSubscriptionId_key";

-- RenameIndex
ALTER INDEX "user_lsCustomerId_key" RENAME TO "user_stripeCustomerId_key";
