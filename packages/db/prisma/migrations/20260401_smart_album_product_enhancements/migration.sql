-- AlterTable: SmartAlbumProduct
-- Replace 'size' (string) with widthCm + heightCm (float)
-- Replace 'maxPages' with 'maxSpreads'
-- Add new fields: minSpreads, allowFewerSpreads, hasCover, hasFirstPage, hasLastPage, images

-- Step 1: Add new columns with defaults
ALTER TABLE "smart_album_product" ADD COLUMN "widthCm" DOUBLE PRECISION;
ALTER TABLE "smart_album_product" ADD COLUMN "heightCm" DOUBLE PRECISION;
ALTER TABLE "smart_album_product" ADD COLUMN "maxSpreads" INTEGER;
ALTER TABLE "smart_album_product" ADD COLUMN "minSpreads" INTEGER;
ALTER TABLE "smart_album_product" ADD COLUMN "allowFewerSpreads" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "smart_album_product" ADD COLUMN "hasCover" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "smart_album_product" ADD COLUMN "hasFirstPage" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "smart_album_product" ADD COLUMN "hasLastPage" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "smart_album_product" ADD COLUMN "images" JSONB NOT NULL DEFAULT '[]';

-- Step 2: Migrate existing data
-- Parse old 'size' field (e.g., "12x12") into widthCm and heightCm
UPDATE "smart_album_product"
SET
  "widthCm" = CASE
    WHEN "size" ~ '^\d+(\.\d+)?x\d+(\.\d+)?$'
    THEN CAST(split_part("size", 'x', 1) AS DOUBLE PRECISION)
    ELSE 20.0
  END,
  "heightCm" = CASE
    WHEN "size" ~ '^\d+(\.\d+)?x\d+(\.\d+)?$'
    THEN CAST(split_part("size", 'x', 2) AS DOUBLE PRECISION)
    ELSE 15.0
  END,
  "maxSpreads" = "maxPages";

-- Step 3: Make new columns NOT NULL after data migration
ALTER TABLE "smart_album_product" ALTER COLUMN "widthCm" SET NOT NULL;
ALTER TABLE "smart_album_product" ALTER COLUMN "heightCm" SET NOT NULL;
ALTER TABLE "smart_album_product" ALTER COLUMN "maxSpreads" SET NOT NULL;

-- Step 4: Drop old unique constraint and create new one
DROP INDEX IF EXISTS "smart_album_product_configId_size_coverType_paperType_key";
CREATE UNIQUE INDEX "smart_album_product_configId_widthCm_heightCm_coverType_paperType_key"
  ON "smart_album_product"("configId", "widthCm", "heightCm", "coverType", "paperType");

-- Step 5: Drop old columns
ALTER TABLE "smart_album_product" DROP COLUMN "size";
ALTER TABLE "smart_album_product" DROP COLUMN "maxPages";
