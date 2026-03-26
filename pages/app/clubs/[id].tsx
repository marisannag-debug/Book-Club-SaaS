import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function ClubPage() {
  const router = useRouter()
  const { id } = router.query
  const [club, setClub] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    ;(async () => {
      try {
        const res = await fetch(`/api/clubs/${id}`)
        if (res.ok) {
          const json = await res.json()
          setClub(json)
        } else {
          setClub(null)
        }
      } catch (e) {
        setClub(null)
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  if (loading) return <div>Ładowanie...</div>
  if (!club) return <div>Klub nie znaleziony</div>

  return (
    <div className="max-w-3xl mx-auto py-12">
      <h1 className="text-2xl font-semibold mb-6">{club.name}</h1>
      <p className="text-muted">{club.description}</p>
    </div>
  )
}
