const assert = require('assert')
const { ClubCreateSchema } = require('../../lib/validators')

function testValid() {
  const res = ClubCreateSchema.safeParse({ name: 'Książkoholicy' })
  assert(res.success, 'Expected valid input to pass validation')
}

function testInvalid() {
  const res = ClubCreateSchema.safeParse({ name: '' })
  assert(!res.success, 'Expected invalid input to fail validation')
}

try {
  testValid()
  testInvalid()
  console.log('Validator unit tests passed')
  process.exit(0)
} catch (err) {
  console.error('Validator unit tests failed')
  console.error(err)
  process.exit(1)
}
