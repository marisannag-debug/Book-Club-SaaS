import type { NextApiRequest, NextApiResponse } from 'next'
import db from '../../../lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  if (req.method === 'GET') {
    try {
      const q = await db.query('SELECT id, name, description, organizer_id as "organizerId", invite_code as "inviteCode" FROM clubs WHERE id = $1', [id])
      if (!q.rows.length) return res.status(404).json({ error: 'Not found' })
      return res.status(200).json({ club: q.rows[0] })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'DB error' })
    }
  }
  res.setHeader('Allow', ['GET'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
