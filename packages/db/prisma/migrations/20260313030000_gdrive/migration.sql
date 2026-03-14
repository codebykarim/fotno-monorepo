-- CreateEnum
CREATE TYPE "DriveImportStatus" AS ENUM ('PENDING', 'LISTING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "DriveImportItemStatus" AS ENUM ('PENDING', 'DOWNLOADING', 'UPLOADED', 'PROCESSING', 'COMPLETED', 'FAILED', 'SKIPPED');

-- CreateTable
CREATE TABLE "drive_import_job" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "DriveImportStatus" NOT NULL DEFAULT 'PENDING',
    "totalFiles" INTEGER NOT NULL DEFAULT 0,
    "completedFiles" INTEGER NOT NULL DEFAULT 0,
    "failedFiles" INTEGER NOT NULL DEFAULT 0,
    "skippedFiles" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "drive_import_job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drive_import_item" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "galleryId" TEXT NOT NULL,
    "driveFolderId" TEXT NOT NULL,
    "driveFolderName" TEXT NOT NULL,
    "driveFileId" TEXT,
    "driveFileName" TEXT,
    "driveFileSize" BIGINT NOT NULL DEFAULT 0,
    "driveMimeType" TEXT,
    "photoId" TEXT,
    "status" "DriveImportItemStatus" NOT NULL DEFAULT 'PENDING',
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "drive_import_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "drive_import_job_userId_status_idx" ON "drive_import_job"("userId", "status");

-- CreateIndex
CREATE INDEX "drive_import_item_jobId_status_idx" ON "drive_import_item"("jobId", "status");

-- AddForeignKey
ALTER TABLE "drive_import_job" ADD CONSTRAINT "drive_import_job_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drive_import_item" ADD CONSTRAINT "drive_import_item_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "drive_import_job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drive_import_item" ADD CONSTRAINT "drive_import_item_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "gallery"("id") ON DELETE CASCADE ON UPDATE CASCADE;
