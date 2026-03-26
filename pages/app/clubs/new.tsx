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

