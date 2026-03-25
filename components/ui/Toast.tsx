"use client"
import React from 'react'

export function Toast({ message }: { message: string }) {
  if (!message) return null
  return <div className="fixed bottom-4 right-4 bg-slate-800 text-white px-4 py-2 rounded">{message}</div>
}

export default Toast
