-- CreateTable
CREATE TABLE "tier_feature" (
    "id" TEXT NOT NULL,
    "tierId" TEXT NOT NULL,
    "featureKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tier_feature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_preference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "galleryExpiryBrowser" BOOLEAN NOT NULL DEFAULT false,
    "galleryExpiryEmail" BOOLEAN NOT NULL DEFAULT false,
    "storageWarningBrowser" BOOLEAN NOT NULL DEFAULT false,
    "storageWarningEmail" BOOLEAN NOT NULL DEFAULT false,
    "billingFailedBrowser" BOOLEAN NOT NULL DEFAULT false,
    "billingFailedEmail" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_preference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fcm_token" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "device" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fcm_token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tier_feature_tierId_idx" ON "tier_feature"("tierId");

-- CreateIndex
CREATE UNIQUE INDEX "tier_feature_tierId_featureKey_key" ON "tier_feature"("tierId", "featureKey");

-- CreateIndex
CREATE UNIQUE INDEX "notification_preference_userId_key" ON "notification_preference"("userId");

-- CreateIndex
CREATE INDEX "fcm_token_userId_idx" ON "fcm_token"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "fcm_token_userId_token_key" ON "fcm_token"("userId", "token");

-- AddForeignKey
ALTER TABLE "tier_feature" ADD CONSTRAINT "tier_feature_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "pricing_tier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_preference" ADD CONSTRAINT "notification_preference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fcm_token" ADD CONSTRAINT "fcm_token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "smart_album_product_configId_widthCm_heightCm_coverType_paperTy" RENAME TO "smart_album_product_configId_widthCm_heightCm_coverType_pap_key";
