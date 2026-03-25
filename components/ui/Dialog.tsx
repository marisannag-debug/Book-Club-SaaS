"use client"
import React from 'react'

export function Dialog({ children, open }: { children: React.ReactNode; open?: boolean }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white rounded p-4 max-w-md w-full">{children}</div>
    </div>
  )
}

export default Dialog
