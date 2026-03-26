import { randomBytes } from 'crypto'

export function generateInviteCode(len = 9) {
  return randomBytes(len).toString('base64url')
}

export default generateInviteCode
