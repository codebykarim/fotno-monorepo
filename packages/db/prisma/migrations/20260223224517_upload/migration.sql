-- CreateEnum
CREATE TYPE "UploadSessionStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'ABORTED', 'EXPIRED');

-- AlterTable
ALTER TABLE "photo" ADD COLUMN     "checksum" TEXT,
ADD COLUMN     "processedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "storageReserved" BIGINT NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "UploadSession" (
    "id" TEXT NOT NULL,
    "photoId" TEXT NOT NULL,
    "s3UploadId" TEXT NOT NULL,
    "s3Key" TEXT NOT NULL,
    "totalParts" INTEGER NOT NULL,
    "totalSize" BIGINT NOT NULL,
    "completedParts" JSONB NOT NULL DEFAULT '[]',
    "status" "UploadSessionStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UploadSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UploadSession_photoId_key" ON "UploadSession"("photoId");

-- AddForeignKey
ALTER TABLE "UploadSession" ADD CONSTRAINT "UploadSession_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "photo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
