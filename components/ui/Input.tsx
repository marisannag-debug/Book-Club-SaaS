"use client"
import React from 'react'

type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export function Input(props: InputProps) {
  return <input className="border rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-sky-200" {...props} />
}

export default Input
