"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ClubCreateSchema } from '../../lib/validators/club'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { Button } from '../../components/ui/Button'
import Toast from '../../components/ui/Toast'

type FormData = { name: string; description?: string }

export default function ClubForm() {
  const router = useRouter()
  const [toast, setToast] = useState('')
  const { register, handleSubmit, formState } = useForm<FormData>({
    resolver: zodResolver(ClubCreateSchema as any),
  })

  async function onSubmit(data: FormData) {
    try {
      const res = await fetch('/api/clubs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      if (!res.ok) {
        const err = await res.json()
        setToast(err.error || 'Błąd serwera')
        return
      }
      const json = await res.json()
      router.push(`/app/clubs/${json.id}`)
    } catch (e) {
      setToast('Błąd sieci')
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <label className="block">
          <div className="text-sm font-medium mb-1">Nazwa klubu</div>
          <Input data-cy="create-club-name" placeholder="Nazwa" {...register('name', { required: true, minLength: 3 })} aria-invalid={!!formState.errors.name} />
        </label>
        <label className="block">
          <div className="text-sm font-medium mb-1">Opis (opcjonalnie)</div>
          <Textarea data-cy="create-club-description" placeholder="Opis" {...register('description')} />
        </label>
        <div>
          <Button type="submit" disabled={formState.isSubmitting} data-cy="create-club-submit">
            {formState.isSubmitting ? 'Tworzenie...' : 'Utwórz'}
          </Button>
        </div>
      </form>
      <Toast message={toast} />
    </div>
  )
}
