-- AlterEnum
ALTER TYPE "Plan" ADD VALUE 'FREE' BEFORE 'TRIAL';

-- AlterTable: User
ALTER TABLE "user" ADD COLUMN "galleryLimit" INTEGER,
ADD COLUMN "downgradedAt" TIMESTAMP(3);

ALTER TABLE "user" ALTER COLUMN "plan" SET DEFAULT 'FREE';
ALTER TABLE "user" ALTER COLUMN "storageLimit" SET DEFAULT 1073741824;

-- AlterTable: PricingTier
ALTER TABLE "pricing_tier" ADD COLUMN "galleryLimit" INTEGER;

-- Set gallery limit for free tier (1 gallery)
UPDATE "pricing_tier" SET "galleryLimit" = 1 WHERE "gb" = 0;

-- Comment: gb=0 for free tier, -1 for unlimited
COMMENT ON COLUMN "pricing_tier"."gb" IS '-1 for unlimited, 0 for free';
