import type { NextApiRequest, NextApiResponse } from 'next'
import ClubCreateSchema from '../../../lib/validators/club'
import db from '../../../lib/db'
import { generateInviteCode } from '../../../lib/utils/invite'

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { limit = 50, offset = 0 } = req.query
  const q = await db.query('SELECT id, name, description, organizer_id as "organizerId", invite_code as "inviteCode" FROM clubs ORDER BY created_at DESC LIMIT $1 OFFSET $2', [Number(limit), Number(offset)])
  return res.status(200).json({ clubs: q.rows })
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const parsed = ClubCreateSchema.parse(req.body)
    // create with retry on invite_code collision
    for (let attempt = 0; attempt < 3; attempt++) {
      const inviteCode = generateInviteCode()
      try {
        const insert = await db.query(
          `INSERT INTO clubs (name, description, organizer_id, invite_code) VALUES ($1, $2, $3, $4) RETURNING id`,
          [parsed.name, parsed.description || null, null, inviteCode]
        )
        const id = insert.rows[0].id
        return res.status(201).json({ id, inviteCode })
      } catch (err: any) {
        // if unique violation on invite_code, retry
        const message = (err && err.message) || ''
        if (message.includes('duplicate') || message.includes('unique')) {
          continue
        }
        console.error('DB insert error', err)
        return res.status(500).json({ error: 'DB error' })
      }
    }
    return res.status(500).json({ error: 'Could not generate unique invite code' })
  } catch (e: any) {
    if (e?.issues) {
      return res.status(400).json({ error: 'Validation failed', issues: e.issues })
    }
    return res.status(500).json({ error: 'Unexpected error' })
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') return handleGet(req, res)
  if (req.method === 'POST') return handlePost(req, res)
  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
