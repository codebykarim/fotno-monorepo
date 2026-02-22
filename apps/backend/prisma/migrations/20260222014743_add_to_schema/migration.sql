-- AlterTable
ALTER TABLE "gallery" ADD COLUMN     "deadline" TIMESTAMP(3),
ADD COLUMN     "eventDate" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "photo" ADD COLUMN     "loved" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "client" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_client" (
    "galleryId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gallery_client_pkey" PRIMARY KEY ("galleryId","clientId")
);

-- CreateTable
CREATE TABLE "album" (
    "id" TEXT NOT NULL,
    "galleryId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "album_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "album_photo" (
    "albumId" TEXT NOT NULL,
    "photoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "album_photo_pkey" PRIMARY KEY ("albumId","photoId")
);

-- CreateIndex
CREATE UNIQUE INDEX "client_id_key" ON "client"("id");

-- CreateIndex
CREATE UNIQUE INDEX "client_userId_email_key" ON "client"("userId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "album_id_key" ON "album"("id");

-- AddForeignKey
ALTER TABLE "client" ADD CONSTRAINT "client_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_client" ADD CONSTRAINT "gallery_client_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "gallery"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_client" ADD CONSTRAINT "gallery_client_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "album" ADD CONSTRAINT "album_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "gallery"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "album_photo" ADD CONSTRAINT "album_photo_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "album"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "album_photo" ADD CONSTRAINT "album_photo_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "photo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
