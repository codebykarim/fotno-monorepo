-- DropTable
DROP TABLE IF EXISTS "gallery_client";
DROP TABLE IF EXISTS "client";

-- AlterTable
ALTER TABLE "gallery" DROP COLUMN IF EXISTS "downloadContactsOnly";
