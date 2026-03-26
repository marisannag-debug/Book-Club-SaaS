const { spawn } = require('child_process')
const http = require('http')

function runCmd(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit', shell: true, ...opts })
    p.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`))))
  })
}

function waitForUrl(url, timeout = 60000) {
  return new Promise((resolve, reject) => {
    const start = Date.now()
    ;(function ping() {
      http.get(url, (res) => {
        if (res.statusCode >= 200 && res.statusCode < 400) return resolve()
        if (Date.now() - start > timeout) return reject(new Error('Timeout waiting for URL'))
        setTimeout(ping, 500)
      }).on('error', () => {
        if (Date.now() - start > timeout) return reject(new Error('Timeout waiting for URL'))
        setTimeout(ping, 500)
      })
    })()
  })
}

async function main() {
  let devProcess
  try {
    // 1) Unit tests
    console.log('Running unit tests...')
    await runCmd('npm', ['run', 'test:unit'])

    // 2) DB tests (starts docker-compose db)
    console.log('Running DB tests (starts postgres) ...')
    await runCmd('node', ['scripts/run-test-db.js'])

    // 3) Start dev server on port matching Cypress baseUrl (3001)
    console.log('Starting dev server (next dev) on PORT=3001 ...')
    devProcess = spawn('npm', ['run', 'dev'], { shell: true, stdio: 'inherit', env: Object.assign({}, process.env, { PORT: '3001' }) })

    // wait for http://localhost:3001
    console.log('Waiting for dev server at http://localhost:3001 ...')
    await waitForUrl('http://localhost:3001')

    // 4) Run Cypress E2E
    console.log('Running Cypress E2E tests...')
    await runCmd('npx', ['cypress', 'run'])

    console.log('All tests completed successfully')
  } catch (err) {
    console.error('Tests failed:', err.message || err)
    process.exitCode = 1
  } finally {
    if (devProcess && !devProcess.killed) {
      try {
        devProcess.kill()
      } catch (e) {
        // ignore
      }
    }
    // bring down docker-compose
    try {
      await runCmd('docker-compose', ['down'])
    } catch (e) {
      // ignore
    }
  }
}

main()
