import type { NextApiRequest, NextApiResponse } from 'next'
import db from '../../../lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query
    if (req.method === 'GET') {
      const q = await db.query(
        'SELECT id, name, description, organizer_id AS "organizerId", invite_code AS "inviteCode" FROM clubs WHERE id = $1',
        [id]
      )
      if (q.rowCount === 0) return res.status(404).json({ error: 'Not Found' })
      return res.status(200).json({ club: q.rows[0] })
    }

    res.setHeader('Allow', ['GET'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('API /api/clubs/[id] error', err)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
