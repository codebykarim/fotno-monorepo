-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "ImportSource" AS ENUM ('DRIVE', 'PHOTOS');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AlterTable
ALTER TABLE "drive_import_job" ADD COLUMN IF NOT EXISTS "source" "ImportSource" NOT NULL DEFAULT 'DRIVE';
