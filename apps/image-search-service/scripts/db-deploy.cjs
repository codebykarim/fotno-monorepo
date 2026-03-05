const path = require('path')
const { Pool } = require('pg')
const dotenv = require('dotenv')

dotenv.config({ path: path.resolve(__dirname, '../../../.env') })

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is required to deploy the image-search schema.')
}

async function main() {
  const pool = new Pool({ connectionString })

  try {
    console.log('[image-search-service] Deploying image-search database schema')

    await pool.query('BEGIN')

    await pool.query('CREATE EXTENSION IF NOT EXISTS vector;')
    await pool.query('CREATE EXTENSION IF NOT EXISTS pgcrypto;')

    await pool.query(`
      CREATE TABLE IF NOT EXISTS "image_search_image" (
        "id" TEXT NOT NULL,
        "photoId" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "galleryId" TEXT NOT NULL,
        "storageUrl" TEXT NOT NULL,
        "thumbnailUrl" TEXT,
        "caption" TEXT,
        "tags" TEXT[],
        "metadata" JSONB,
        "embedding" vector(1152),
        "indexedAt" TIMESTAMP(3),
        "version" INTEGER NOT NULL DEFAULT 1,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "image_search_image_pkey" PRIMARY KEY ("id")
      );
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS "image_search_album_cache" (
        "id" TEXT NOT NULL,
        "galleryId" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "normalizedPrompt" TEXT NOT NULL,
        "photoIds" TEXT[],
        "albumTitle" TEXT,
        "albumDescription" TEXT,
        "expiresAt" TIMESTAMP(3) NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "image_search_album_cache_pkey" PRIMARY KEY ("id")
      );
    `)

    await pool.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS "image_search_image_photoId_key" ON "image_search_image"("photoId");'
    )
    await pool.query(
      'CREATE INDEX IF NOT EXISTS "image_search_image_galleryId_userId_idx" ON "image_search_image"("galleryId", "userId");'
    )
    await pool.query(
      'CREATE INDEX IF NOT EXISTS "image_search_image_photoId_idx" ON "image_search_image"("photoId");'
    )

    await pool.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS "image_search_album_cache_galleryId_userId_normalizedPrompt_key" ON "image_search_album_cache"("galleryId", "userId", "normalizedPrompt");'
    )
    await pool.query(
      'CREATE INDEX IF NOT EXISTS "image_search_album_cache_galleryId_userId_idx" ON "image_search_album_cache"("galleryId", "userId");'
    )
    await pool.query(
      'CREATE INDEX IF NOT EXISTS "image_search_album_cache_expiresAt_idx" ON "image_search_album_cache"("expiresAt");'
    )

    await pool.query(`
      CREATE INDEX IF NOT EXISTS "image_search_image_embedding_idx" ON "image_search_image"
      USING hnsw ("embedding" vector_cosine_ops)
      WITH (m = 16, ef_construction = 64);
    `)

    // --- Caption library table ---
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "caption_library" (
        "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
        "embedding" vector(1152) NOT NULL,
        "caption" TEXT NOT NULL,
        "tags" TEXT[] NOT NULL DEFAULT '{}',
        "usageCount" INTEGER NOT NULL DEFAULT 1,
        "sourcePhotoId" TEXT,
        "sourceGalleryId" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "caption_library_pkey" PRIMARY KEY ("id")
      );
    `)

    await pool.query(`
      CREATE INDEX IF NOT EXISTS "caption_library_embedding_idx" ON "caption_library"
      USING hnsw ("embedding" vector_cosine_ops)
      WITH (m = 16, ef_construction = 64);
    `)

    // --- New columns on image_search_image for captioning ---
    await pool.query(`
      ALTER TABLE "image_search_image"
        ADD COLUMN IF NOT EXISTS "captionedAt" TIMESTAMP(3),
        ADD COLUMN IF NOT EXISTS "captionSource" TEXT,
        ADD COLUMN IF NOT EXISTS "captionTsv" tsvector;
    `)

    // --- Failure tracking columns ---
    await pool.query(`
      ALTER TABLE "image_search_image"
        ADD COLUMN IF NOT EXISTS "embeddingAttempts" INTEGER NOT NULL DEFAULT 0,
        ADD COLUMN IF NOT EXISTS "embeddingError" TEXT,
        ADD COLUMN IF NOT EXISTS "captionAttempts" INTEGER NOT NULL DEFAULT 0,
        ADD COLUMN IF NOT EXISTS "captionError" TEXT;
    `)

    await pool.query(`
      CREATE INDEX IF NOT EXISTS "image_search_image_captionTsv_idx"
      ON "image_search_image" USING gin("captionTsv");
    `)

    // --- Full-text search trigger: auto-update captionTsv when caption/tags change ---
    await pool.query(`
      CREATE OR REPLACE FUNCTION image_search_caption_tsv_trigger() RETURNS trigger AS $$
      BEGIN
        NEW."captionTsv" := to_tsvector('english',
          coalesce(NEW.caption, '') || ' ' || coalesce(array_to_string(NEW.tags, ' '), '')
        );
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `)

    await pool.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_trigger WHERE tgname = 'trg_image_search_caption_tsv'
        ) THEN
          CREATE TRIGGER trg_image_search_caption_tsv
            BEFORE INSERT OR UPDATE OF caption, tags ON "image_search_image"
            FOR EACH ROW EXECUTE FUNCTION image_search_caption_tsv_trigger();
        END IF;
      END $$;
    `)

    await pool.query('COMMIT')
    console.log('[image-search-service] Image-search database schema deployed successfully')
  } catch (err) {
    try {
      await pool.query('ROLLBACK')
    } catch {}
    console.error('[image-search-service] Failed to deploy image-search database schema')
    throw err
  } finally {
    await pool.end()
  }
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})

