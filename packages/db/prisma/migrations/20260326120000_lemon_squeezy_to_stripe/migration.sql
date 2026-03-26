-- Migrate from Lemon Squeezy to Stripe

-- Rename User columns
ALTER TABLE "user" RENAME COLUMN "lsCustomerId" TO "stripeCustomerId";

-- Rename Subscription columns
ALTER TABLE "subscription" RENAME COLUMN "lsSubscriptionId" TO "stripeSubscriptionId";
ALTER TABLE "subscription" RENAME COLUMN "lsVariantId" TO "stripePriceId";

-- Rename PricingTier columns
ALTER TABLE "pricing_tier" RENAME COLUMN "lsVariantId" TO "stripePriceId";

-- Add new enum values (must be committed before use)
ALTER TYPE "SubscriptionSource" ADD VALUE IF NOT EXISTS 'STRIPE';
ALTER TYPE "SubscriptionSource" ADD VALUE IF NOT EXISTS 'MANUAL';
