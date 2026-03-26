import React from 'react'
import Link from 'next/link'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'

export default function Dashboard() {
  return (
    <div className="max-w-3xl mx-auto py-12">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      <Card>
        <div className="p-4">
          <p className="mb-4">Szybkie akcje:</p>
          <Link href="/app/clubs/new">
            <Button>Utwórz nowy klub</Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
