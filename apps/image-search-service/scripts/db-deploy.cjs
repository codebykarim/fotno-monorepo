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

