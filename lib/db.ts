// TypeScript DB helper using pg Pool
import { Pool, QueryResult } from 'pg'

const connectionString = process.env.DATABASE_URL || ''

const pool = new Pool({ connectionString })

export async function query<T = any>(text: string, params?: unknown[]): Promise<QueryResult<T>> {
  return pool.query<T>(text, params as any)
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
