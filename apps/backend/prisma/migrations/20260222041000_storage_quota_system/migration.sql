-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'STARTER', 'PROFESSIONAL', 'STUDIO', 'ENTERPRISE');

-- AlterTable
ALTER TABLE "user"
  ADD COLUMN "storageUsed" BIGINT NOT NULL DEFAULT 0,
  ADD COLUMN "storageLimit" BIGINT NOT NULL DEFAULT 0,
  ADD COLUMN "overageBytes" BIGINT NOT NULL DEFAULT 0,
  ADD COLUMN "overageResetAt" TIMESTAMP(3),
  ADD COLUMN "stripeCustomerId" TEXT,
  ADD COLUMN "stripeSubId" TEXT,
  ADD COLUMN "warningEmailSent80" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "warningEmailSent95" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "plan_new" "Plan" NOT NULL DEFAULT 'FREE';

UPDATE "user"
SET "plan_new" = CASE "plan"::text
  WHEN 'FREE' THEN 'FREE'::"Plan"
  WHEN 'PRO' THEN 'PROFESSIONAL'::"Plan"
  WHEN 'STUDIO' THEN 'STUDIO'::"Plan"
  ELSE 'FREE'::"Plan"
END;

ALTER TABLE "user" DROP COLUMN "plan";
ALTER TABLE "user" RENAME COLUMN "plan_new" TO "plan";

-- AlterTable
ALTER TABLE "photo"
  ADD COLUMN "originalSize" BIGINT NOT NULL DEFAULT 0,
  ADD COLUMN "thumbnailSize" BIGINT NOT NULL DEFAULT 0,
  ADD COLUMN "previewSize" BIGINT NOT NULL DEFAULT 0,
  ADD COLUMN "totalSize" BIGINT NOT NULL DEFAULT 0,
  ADD COLUMN "aiTags" TEXT[] DEFAULT ARRAY[]::TEXT[];

UPDATE "photo"
SET "originalSize" = "size",
    "totalSize" = "size";

ALTER TABLE "photo"
  ALTER COLUMN "aiTags" SET NOT NULL,
  ALTER COLUMN "status" TYPE TEXT USING LOWER("status"::text),
  ALTER COLUMN "status" SET DEFAULT 'pending';

ALTER TABLE "photo" DROP COLUMN "size";

-- DropEnum
DROP TYPE "PhotographerPlan";
DROP TYPE "PhotoStatus";

-- CreateTable
CREATE TABLE "storage_event" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "photoId" TEXT,
    "delta" BIGINT NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "storage_event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_stripeCustomerId_key" ON "user"("stripeCustomerId");
CREATE UNIQUE INDEX "user_stripeSubId_key" ON "user"("stripeSubId");
CREATE INDEX "storage_event_userId_createdAt_idx" ON "storage_event"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "storage_event"
  ADD CONSTRAINT "storage_event_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
