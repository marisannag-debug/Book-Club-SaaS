"use client"
import React from 'react'
import ClubForm from '../../../components/clubs/ClubForm'
import { Card } from '../../../components/ui/Card'

export default function NewClubPage() {
  return (
    <div className="max-w-3xl mx-auto py-12">
      <h1 className="text-2xl font-semibold mb-6">Utwórz nowy klub</h1>
      <Card>
        <div className="p-4">
          <ClubForm />
        </div>
      </Card>
    </div>
  )
}
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { Input } from '../../../components/ui/Input'
import { Textarea } from '../../../components/ui/Textarea'
import { Button } from '../../../components/ui/Button'
import { Toast } from '../../../components/ui/Toast'

export default function NewClubPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setToast('')
    try {
      const res = await fetch('/api/clubs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      })
      const json = await res.json()
      if (!res.ok) {
        setToast(json?.error || 'Błąd')
        setLoading(false)
        return
      }
      setToast('Klub utworzony')
      router.push(`/app/clubs/${json.id}`)
    } catch (err) {
      setToast('Błąd sieci')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto py-12">
      <h1 className="text-2xl font-semibold mb-4">Utwórz nowy klub</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nazwa</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required minLength={3} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Opis (opcjonalnie)</label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
        </div>
        <div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Tworzenie...' : 'Utwórz'}
          </Button>
        </div>
      </form>
      <Toast message={toast} />
    </div>
  )
}
