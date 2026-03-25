/*
Integration test: insert/select basic clubs row
Usage:
TEST_DATABASE_URL=postgres://user:pass@localhost:5432/bookclub_test node tests/db/integration.test.js
*/
const { Client } = require('pg')

async function main() {
  const url = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL
  if (!url) {
    console.log('No TEST_DATABASE_URL or DATABASE_URL set — skipping DB integration test')
    process.exit(0)
  }

  const client = new Client({ connectionString: url })
  await client.connect()
  try {
    // insert a club
    const insert = await client.query("INSERT INTO clubs(name, description) VALUES($1,$2) RETURNING id, name", ['Test Club', 'desc'])
    const id = insert.rows[0].id
    console.log('Inserted club id', id)
    const sel = await client.query('SELECT id, name FROM clubs WHERE id = $1', [id])
    if (sel.rows.length !== 1) {
      console.error('Failed to read back inserted club')
      process.exit(2)
    }
    console.log('Integration test passed: read back club', sel.rows[0])
    // cleanup
    await client.query('DELETE FROM clubs WHERE id = $1', [id])
  } catch (err) {
    console.error(err)
    process.exit(3)
  } finally {
    await client.end()
  }
}

main()
