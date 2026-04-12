-- CreateTable
CREATE TABLE "gallery_view" (
    "id" TEXT NOT NULL,
    "galleryId" TEXT NOT NULL,
    "viewerIp" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gallery_view_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "gallery_view_galleryId_idx" ON "gallery_view"("galleryId");

-- CreateIndex
CREATE INDEX "gallery_view_galleryId_createdAt_idx" ON "gallery_view"("galleryId", "createdAt");

-- AddForeignKey
ALTER TABLE "gallery_view" ADD CONSTRAINT "gallery_view_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "gallery"("id") ON DELETE CASCADE ON UPDATE CASCADE;
