// Simple DB helper placeholder — use pg or supabase-js in real setup
import { Client } from 'pg'

const connectionString = process.env.DATABASE_URL || ''

export async function query(text: string, params?: unknown[]) {
  const client = new Client({ connectionString })
  await client.connect()
  try {
    const res = await client.query(text, params as any)
    return res
  } finally {
    await client.end()
  }
}

export default { query }
