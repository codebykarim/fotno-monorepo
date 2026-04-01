-- CreateEnum
CREATE TYPE "SmartAlbumPaymentMethod" AS ENUM ('OUTSIDE_FOTNO', 'INSIDE_FOTNO');

-- CreateEnum
CREATE TYPE "SmartAlbumDesignStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED', 'CHANGES_REQUESTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "SmartAlbumSubmissionStatus" AS ENUM ('PENDING', 'APPROVED', 'CHANGES_REQUESTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "SmartAlbumTransactionStatus" AS ENUM ('PENDING', 'SUCCEEDED', 'FAILED', 'REFUNDED');

-- CreateTable
CREATE TABLE "smart_album_config" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "paymentMethod" "SmartAlbumPaymentMethod" NOT NULL DEFAULT 'OUTSIDE_FOTNO',
    "stripeConnectAccountId" TEXT,
    "stripeConnectOnboarded" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "smart_album_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "smart_album_product" (
    "id" TEXT NOT NULL,
    "configId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "coverType" TEXT NOT NULL,
    "paperType" TEXT NOT NULL,
    "maxPages" INTEGER NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "smart_album_product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "smart_album_design" (
    "id" TEXT NOT NULL,
    "galleryId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "configId" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Untitled Album',
    "designData" JSONB NOT NULL DEFAULT '{}',
    "status" "SmartAlbumDesignStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "smart_album_design_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "smart_album_submission" (
    "id" TEXT NOT NULL,
    "designId" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "designSnapshot" JSONB NOT NULL,
    "status" "SmartAlbumSubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "photographerNotes" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "exportReady" BOOLEAN NOT NULL DEFAULT false,
    "exportUrl" TEXT,

    CONSTRAINT "smart_album_submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "smart_album_transaction" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "stripePaymentIntentId" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "feeCents" INTEGER NOT NULL,
    "netCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" "SmartAlbumTransactionStatus" NOT NULL DEFAULT 'PENDING',
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "smart_album_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "smart_album_config_userId_key" ON "smart_album_config"("userId");

-- CreateIndex
CREATE INDEX "smart_album_product_configId_idx" ON "smart_album_product"("configId");

-- CreateIndex
CREATE UNIQUE INDEX "smart_album_product_configId_size_coverType_paperType_key" ON "smart_album_product"("configId", "size", "coverType", "paperType");

-- CreateIndex
CREATE INDEX "smart_album_design_galleryId_status_idx" ON "smart_album_design"("galleryId", "status");

-- CreateIndex
CREATE INDEX "smart_album_design_galleryId_clientEmail_idx" ON "smart_album_design"("galleryId", "clientEmail");

-- CreateIndex
CREATE INDEX "smart_album_submission_designId_status_idx" ON "smart_album_submission"("designId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "smart_album_submission_designId_version_key" ON "smart_album_submission"("designId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "smart_album_transaction_submissionId_key" ON "smart_album_transaction"("submissionId");

-- CreateIndex
CREATE UNIQUE INDEX "smart_album_transaction_stripePaymentIntentId_key" ON "smart_album_transaction"("stripePaymentIntentId");

-- CreateIndex
CREATE INDEX "smart_album_transaction_submissionId_idx" ON "smart_album_transaction"("submissionId");

-- AddForeignKey
ALTER TABLE "smart_album_config" ADD CONSTRAINT "smart_album_config_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "smart_album_product" ADD CONSTRAINT "smart_album_product_configId_fkey" FOREIGN KEY ("configId") REFERENCES "smart_album_config"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "smart_album_design" ADD CONSTRAINT "smart_album_design_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "gallery"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "smart_album_design" ADD CONSTRAINT "smart_album_design_productId_fkey" FOREIGN KEY ("productId") REFERENCES "smart_album_product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "smart_album_design" ADD CONSTRAINT "smart_album_design_configId_fkey" FOREIGN KEY ("configId") REFERENCES "smart_album_config"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "smart_album_submission" ADD CONSTRAINT "smart_album_submission_designId_fkey" FOREIGN KEY ("designId") REFERENCES "smart_album_design"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "smart_album_transaction" ADD CONSTRAINT "smart_album_transaction_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "smart_album_submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
