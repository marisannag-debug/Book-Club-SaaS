const { randomBytes } = require('crypto')

function generateInviteCode(len = 9) {
  const buf = randomBytes(len)
  // base64url: replace +/ with -_ and strip padding =
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

module.exports = { generateInviteCode }
