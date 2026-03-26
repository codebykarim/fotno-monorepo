-- Migrate from Lemon Squeezy to Stripe

-- Rename User columns
ALTER TABLE "user" RENAME COLUMN "lsCustomerId" TO "stripeCustomerId";

-- Rename Subscription columns
ALTER TABLE "subscription" RENAME COLUMN "lsSubscriptionId" TO "stripeSubscriptionId";
ALTER TABLE "subscription" RENAME COLUMN "lsVariantId" TO "stripePriceId";

-- Rename PricingTier columns
ALTER TABLE "pricing_tier" RENAME COLUMN "lsVariantId" TO "stripePriceId";

-- Update SubscriptionSource enum: add STRIPE and MANUAL, migrate data, remove LEMON_SQUEEZY
ALTER TYPE "SubscriptionSource" ADD VALUE IF NOT EXISTS 'STRIPE';
ALTER TYPE "SubscriptionSource" ADD VALUE IF NOT EXISTS 'MANUAL';

-- Update existing subscriptions from LEMON_SQUEEZY to STRIPE
UPDATE "subscription" SET "source" = 'STRIPE' WHERE "source" = 'LEMON_SQUEEZY';

-- Rename RegionalTierOverride comment column (no actual rename needed, just a note)
-- checkoutCents was previously "override LS checkout price" - now just "override checkout price"
