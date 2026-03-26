// Runtime-robust validator: prefer zod if available, otherwise fallback to simple checks
let ClubCreateSchema
try {
  const { z } = require('zod')
  ClubCreateSchema = z.object({
    name: z.string().min(3, 'Nazwa musi mieć co najmniej 3 znaki').max(100),
    description: z.string().max(1000).optional(),
  })
} catch (e) {
  // fallback minimal implementation with safeParse API used by server code
  ClubCreateSchema = {
    safeParse(obj) {
      const issues = {}
      if (!obj || typeof obj.name !== 'string' || obj.name.trim().length < 3) {
        issues.name = 'Nazwa musi mieć co najmniej 3 znaki'
      }
      if (obj && obj.description && obj.description.length > 1000) {
        issues.description = 'Opis jest za długi'
      }
      if (Object.keys(issues).length > 0) {
        return { success: false, error: { format: () => issues } }
      }
      return { success: true, data: { name: String(obj.name).trim(), description: obj.description } }
    },
  }
}

module.exports = { ClubCreateSchema }
