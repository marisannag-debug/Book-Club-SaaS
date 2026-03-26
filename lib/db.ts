// TypeScript DB helper using pg Pool
import { Pool } from 'pg'

const connectionString =
  process.env.DATABASE_URL || process.env.TEST_DATABASE_URL || 'postgres://test:testpass@localhost:5432/test_db'

const pool = new Pool({ connectionString })

export async function query(text: string, params?: unknown[]): Promise<any> {
  try {
    return await pool.query(text, params as any)
  } catch (err) {
    console.error('DB query error', err)
    throw err
  }
}

export function getPool() {
  return pool
}

// Graceful shutdown helper (useful in tests)
export async function shutdown() {
  await pool.end()
}

export default { query, getPool, shutdown }

/* Usage example (TypeScript):
import db from './lib/db'
await db.query('SELECT 1')
*/
