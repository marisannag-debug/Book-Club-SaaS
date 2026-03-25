/*
Migration smoke test
Usage: set TEST_DATABASE_URL env var to a test Postgres database, e.g.
TEST_DATABASE_URL=postgres://user:pass@localhost:5432/bookclub_test node tests/db/migration-smoke.test.js
If TEST_DATABASE_URL is not set, this script will exit with code 0 and print a note.
*/
const { Client } = require('pg')
const fs = require('fs')
const path = require('path')

async function main() {
  const url = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL
  if (!url) {
    console.log('No TEST_DATABASE_URL or DATABASE_URL set — skipping DB smoke test')
    process.exit(0)
  }

  const client = new Client({ connectionString: url })
  await client.connect()
  try {
    const sql = fs.readFileSync(path.join(__dirname, '../../db/migrations/001_create_core_tables.sql'), 'utf8')
    console.log('Running migration...')
    await client.query(sql)
    // verify that clubs table exists
    const res = await client.query("SELECT to_regclass('public.clubs') as exists")
    if (!res.rows[0].exists) {
      console.error('clubs table not found after migration')
      process.exit(2)
    }
    console.log('Migration smoke test passed: clubs table exists')
  } catch (err) {
    console.error(err)
    process.exit(3)
  } finally {
    await client.end()
  }
}

main()
