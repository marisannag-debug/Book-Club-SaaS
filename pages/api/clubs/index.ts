import type { NextApiRequest, NextApiResponse } from 'next'
import db from '../../../lib/db'

// validator may be zod-based or a runtime fallback (lib/validators/index.js)
const { ClubCreateSchema } = require('../../../lib/validators')
const { generateInviteCode } = require('../../../lib/utils')

async function getClubs(req: NextApiRequest, res: NextApiResponse) {
  const limit = parseInt((req.query.limit as string) || '50', 10)
  const offset = parseInt((req.query.offset as string) || '0', 10)
  try {
    const result = await db.query(
      'SELECT id, name, description, organizer_id AS "organizerId", invite_code AS "inviteCode" FROM clubs ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    )
    return res.status(200).json({ clubs: result.rows })
  } catch (err) {
    console.warn('DB read failed, returning empty clubs list', err)
    return res.status(200).json({ clubs: [] })
  }
}

async function createClub(req: NextApiRequest, res: NextApiResponse) {
  const parsed = ClubCreateSchema.safeParse ? ClubCreateSchema.safeParse(req.body) : { success: true, data: req.body }
  if (!parsed.success) {
    const issues = parsed.error && parsed.error.format ? parsed.error.format() : parsed.error || {}
    return res.status(400).json({ error: 'Validation failed', issues })
  }

  const { name, description } = parsed.data

  // simple insert, generate inviteCode
  const inviteCode = generateInviteCode()
  try {
    const insert = await db.query(
      'INSERT INTO clubs (name, description, invite_code) VALUES ($1, $2, $3) RETURNING id',
      [name, description || null, inviteCode]
    )
    const id = insert.rows[0].id
    return res.status(201).json({ id, inviteCode })
  } catch (err) {
    console.error('DB insert error', err)
    return res.status(500).json({ error: 'DB error' })
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') return getClubs(req, res)
    if (req.method === 'POST') return createClub(req, res)
    res.setHeader('Allow', ['GET', 'POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (err) {
    console.error('API /api/clubs error', err)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
