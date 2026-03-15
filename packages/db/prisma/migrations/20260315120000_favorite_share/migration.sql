-- CreateTable: FavoriteShare
CREATE TABLE "favorite_share" (
    "id" TEXT NOT NULL,
    "galleryId" TEXT NOT NULL,
    "viewerId" TEXT NOT NULL,
    "viewerName" TEXT NOT NULL,
    "shareToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorite_share_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "favorite_share_shareToken_key" ON "favorite_share"("shareToken");

-- CreateIndex
CREATE UNIQUE INDEX "favorite_share_galleryId_viewerId_key" ON "favorite_share"("galleryId", "viewerId");

-- AddForeignKey
ALTER TABLE "favorite_share" ADD CONSTRAINT "favorite_share_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "gallery"("id") ON DELETE CASCADE ON UPDATE CASCADE;
