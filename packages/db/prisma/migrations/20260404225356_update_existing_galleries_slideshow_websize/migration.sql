-- Update existing galleries to match new defaults
UPDATE "gallery" SET "slideshowEnabled" = false WHERE "slideshowEnabled" = true;
UPDATE "gallery" SET "downloadSizeWeb" = false WHERE "downloadSizeWeb" = true;
