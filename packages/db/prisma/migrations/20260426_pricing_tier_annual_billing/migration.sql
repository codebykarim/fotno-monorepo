-- Add annual billing support to pricing tiers.
-- Both columns are nullable: existing tiers have no annual option until set
-- via the admin pricing page. Safe to run on prod with live data.

ALTER TABLE "pricing_tier"
  ADD COLUMN "priceCentsAnnual" INTEGER,
  ADD COLUMN "stripePriceIdAnnual" TEXT;
