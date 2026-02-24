-- CreateEnum
CREATE TYPE "PhotographerPlan" AS ENUM ('FREE', 'PRO', 'STUDIO');

-- CreateEnum
CREATE TYPE "PhotoStatus" AS ENUM ('PENDING', 'UPLOADED', 'PROCESSING', 'PROCESSED', 'FAILED');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "plan" "PhotographerPlan" NOT NULL DEFAULT 'FREE';

-- CreateTable
CREATE TABLE "gallery" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "coverPhotoId" TEXT,
    "passwordHash" TEXT,
    "shareToken" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "photo" (
    "id" TEXT NOT NULL,
    "galleryId" TEXT NOT NULL,
    "s3Key" TEXT NOT NULL,
    "s3Bucket" TEXT NOT NULL,
    "originalFilename" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "mimeType" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isCulled" BOOLEAN NOT NULL DEFAULT false,
    "aiCaption" TEXT,
    "faceCount" INTEGER NOT NULL DEFAULT 0,
    "thumbnailKey" TEXT,
    "previewKey" TEXT,
    "status" "PhotoStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "photo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "gallery_id_key" ON "gallery"("id");

-- CreateIndex
CREATE UNIQUE INDEX "gallery_shareToken_key" ON "gallery"("shareToken");

-- CreateIndex
CREATE UNIQUE INDEX "gallery_userId_slug_key" ON "gallery"("userId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "photo_id_key" ON "photo"("id");

-- CreateIndex
CREATE INDEX "photo_galleryId_order_idx" ON "photo"("galleryId", "order");

-- AddForeignKey
ALTER TABLE "gallery" ADD CONSTRAINT "gallery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery" ADD CONSTRAINT "gallery_coverPhotoId_fkey" FOREIGN KEY ("coverPhotoId") REFERENCES "photo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photo" ADD CONSTRAINT "photo_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "gallery"("id") ON DELETE CASCADE ON UPDATE CASCADE;
