-- CreateTable
CREATE TABLE "gallery_comment" (
    "id" TEXT NOT NULL,
    "galleryId" TEXT NOT NULL,
    "photoId" TEXT,
    "parentId" TEXT,
    "authorName" TEXT NOT NULL,
    "authorRole" TEXT NOT NULL DEFAULT 'client',
    "viewerId" TEXT,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gallery_comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "gallery_comment_galleryId_createdAt_idx" ON "gallery_comment"("galleryId", "createdAt");

-- AddForeignKey
ALTER TABLE "gallery_comment" ADD CONSTRAINT "gallery_comment_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "gallery"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_comment" ADD CONSTRAINT "gallery_comment_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "photo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_comment" ADD CONSTRAINT "gallery_comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "gallery_comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
