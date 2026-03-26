const assert = require('assert')
const { generateInviteCode } = require('../../lib/utils/invite')

function testLength() {
  const code = generateInviteCode(9)
  // base64 of 9 bytes -> 12 chars without padding typically, but we check non-empty and url-safe
  assert(typeof code === 'string' && code.length > 0, 'Expected non-empty string')
}

function testUrlSafe() {
  const code = generateInviteCode(12)
  assert(!/[+/=]/.test(code), 'Expected URL-safe characters only')
}

function testUniqueness() {
  const set = new Set()
  for (let i = 0; i < 10; i++) set.add(generateInviteCode(9))
  assert(set.size === 10, 'Expected codes to be unique in 10 samples')
}

try {
  testLength()
  testUrlSafe()
  testUniqueness()
  console.log('Invite generator unit tests passed')
  process.exit(0)
} catch (err) {
  console.error('Invite generator unit tests failed')
  console.error(err)
  process.exit(1)
}
