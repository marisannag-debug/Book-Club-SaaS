"use client"
import React from 'react'
import { Button } from '../components/ui/Button'

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-6 py-12">
      <h1 className="text-3xl font-semibold">BookClub Pro — MVP</h1>
      <p className="text-slate-600 max-w-xl text-center">Zarządzaj małym klubem książkowym w jednym miejscu.</p>
      <Button onClick={() => alert('CTA kliknięte')} variant="primary">Załóż darmowy klub</Button>
    </div>
  )
}
