-- AlterTable: Add new settings fields to gallery
ALTER TABLE "gallery" ADD COLUMN "categoryTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "expiresAt" TIMESTAMP(3),
ADD COLUMN "slideshowEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "socialSharingEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "emailRegistration" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "language" TEXT NOT NULL DEFAULT 'en',
ADD COLUMN "downloadEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "downloadPin" TEXT,
ADD COLUMN "downloadSizeOriginal" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "downloadSizeHighRes" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "downloadSizeWeb" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "downloadWebMaxPx" INTEGER NOT NULL DEFAULT 2048,
ADD COLUMN "downloadHighResMaxPx" INTEGER NOT NULL DEFAULT 3600,
ADD COLUMN "downloadLimit" INTEGER,
ADD COLUMN "downloadContactsOnly" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "favoritesEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "favoriteNotesEnabled" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable: Add downloadEnabled to album
ALTER TABLE "album" ADD COLUMN "downloadEnabled" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable: GalleryFavorite
CREATE TABLE "gallery_favorite" (
    "id" TEXT NOT NULL,
    "galleryId" TEXT NOT NULL,
    "photoId" TEXT NOT NULL,
    "viewerId" TEXT NOT NULL,
    "viewerName" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gallery_favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable: DownloadEvent
CREATE TABLE "download_event" (
    "id" TEXT NOT NULL,
    "galleryId" TEXT NOT NULL,
    "photoId" TEXT,
    "viewerName" TEXT,
    "viewerIp" TEXT,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "download_event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "gallery_favorite_galleryId_idx" ON "gallery_favorite"("galleryId");

-- CreateIndex
CREATE UNIQUE INDEX "gallery_favorite_galleryId_photoId_viewerId_key" ON "gallery_favorite"("galleryId", "photoId", "viewerId");

-- CreateIndex
CREATE INDEX "download_event_galleryId_idx" ON "download_event"("galleryId");

-- AddForeignKey
ALTER TABLE "gallery_favorite" ADD CONSTRAINT "gallery_favorite_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "gallery"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_favorite" ADD CONSTRAINT "gallery_favorite_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "photo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "download_event" ADD CONSTRAINT "download_event_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "gallery"("id") ON DELETE CASCADE ON UPDATE CASCADE;
