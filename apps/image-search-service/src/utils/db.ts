import { Pool } from 'pg'
import pgvector from 'pgvector/pg'
import { env } from '../constants/env'
import { logger } from './logger'

let pool: Pool | null = null

export async function getPool(): Promise<Pool> {
  if (!pool) {
    pool = new Pool({
      connectionString: env.DATABASE_URL,
    })
    pool.on('connect', (client) => pgvector.registerTypes(client))
    logger.info('Database pool initialized with pgvector')
  }
  return pool
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end()
    pool = null
    logger.info('Database pool closed')
  }
}

export async function query<T>(text: string, params?: unknown[]): Promise<T[]> {
  const p = await getPool()
  const result = await p.query(text, params)
  return result.rows as T[]
}

export async function queryOne<T>(text: string, params?: unknown[]): Promise<T | null> {
  const rows = await query<T>(text, params)
  return rows[0] ?? null
}
