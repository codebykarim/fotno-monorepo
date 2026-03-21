-- CreateTable
CREATE TABLE "pricing_tier" (
    "id" TEXT NOT NULL,
    "gb" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "lsVariantId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pricing_tier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regional_pricing" (
    "id" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "pppMultiplier" DOUBLE PRECISION NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "regional_pricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regional_tier_override" (
    "id" TEXT NOT NULL,
    "regionalPricingId" TEXT NOT NULL,
    "tierGb" INTEGER NOT NULL,
    "localPriceCents" INTEGER NOT NULL,
    "checkoutCents" INTEGER,
    "storageOverrideGb" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "regional_tier_override_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pricing_tier_gb_key" ON "pricing_tier"("gb");

-- CreateIndex
CREATE UNIQUE INDEX "regional_pricing_countryCode_key" ON "regional_pricing"("countryCode");

-- CreateIndex
CREATE INDEX "regional_tier_override_regionalPricingId_idx" ON "regional_tier_override"("regionalPricingId");

-- CreateIndex
CREATE UNIQUE INDEX "regional_tier_override_regionalPricingId_tierGb_key" ON "regional_tier_override"("regionalPricingId", "tierGb");

-- AddForeignKey
ALTER TABLE "regional_tier_override" ADD CONSTRAINT "regional_tier_override_regionalPricingId_fkey" FOREIGN KEY ("regionalPricingId") REFERENCES "regional_pricing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Seed initial data from hardcoded constants
INSERT INTO "pricing_tier" ("id", "gb", "label", "priceCents", "sortOrder") VALUES
  (gen_random_uuid()::text, 20, 'Starter', 900, 0),
  (gen_random_uuid()::text, 100, 'Professional', 1900, 1),
  (gen_random_uuid()::text, 500, 'Business', 3500, 2),
  (gen_random_uuid()::text, -1, 'Unlimited', 4900, 3);

INSERT INTO "regional_pricing" ("id", "countryCode", "currency", "symbol", "locale", "pppMultiplier") VALUES
  ('eg-regional', 'EG', 'EGP', 'EGP', 'en-EG', 0.33);

INSERT INTO "regional_tier_override" ("id", "regionalPricingId", "tierGb", "localPriceCents", "checkoutCents") VALUES
  (gen_random_uuid()::text, 'eg-regional', 20, 15000, 300),
  (gen_random_uuid()::text, 'eg-regional', 100, 30000, 627),
  (gen_random_uuid()::text, 'eg-regional', 500, 110000, 2200);
