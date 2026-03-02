const path = require('path')
const { Pool } = require('pg')
const dotenv = require('dotenv')

dotenv.config({ path: path.resolve(__dirname, '../../../.env') })

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is required to reset the image-search schema.')
}

async function main() {
  const pool = new Pool({ connectionString })

  try {
    console.log('[image-search-service] Resetting image-search database data')

    await pool.query('BEGIN')

    // Keep schema/indexes; only clear data.
    await pool.query('TRUNCATE TABLE "image_search_album_cache", "image_search_image" CASCADE;')

    await pool.query('COMMIT')
    console.log('[image-search-service] Image-search database data reset successfully')
  } catch (err) {
    try {
      await pool.query('ROLLBACK')
    } catch {}
    console.error('[image-search-service] Failed to reset image-search database data')
    throw err
  } finally {
    await pool.end()
  }
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})

