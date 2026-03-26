const { spawn } = require('child_process')

function runCmd(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit', shell: true, ...opts })
    p.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`))))
  })
}

async function waitForDb() {
  console.log('Waiting for Postgres to be ready...')
  for (let i = 0; i < 60; i++) {
    try {
      await runCmd('docker-compose', ['exec', 'db', 'pg_isready', '-U', 'test', '-d', 'test_db'])
      return
    } catch (e) {
      await new Promise((r) => setTimeout(r, 1000))
    }
  }
  throw new Error('DB not ready after timeout')
}

async function main() {
  try {
    await runCmd('docker-compose', ['up', '-d', 'db'])
    await waitForDb()

    const env = Object.assign({}, process.env, {
      TEST_DATABASE_URL: 'postgres://test:testpass@localhost:5432/test_db',
    })

    await runCmd('node', ['tests/db/migration-smoke.test.js'], { env })
    await runCmd('node', ['tests/db/integration.test.js'], { env })

    console.log('DB tests completed successfully')
  } catch (err) {
    console.error(err.message || err)
    process.exit(1)
  }
}

main()
