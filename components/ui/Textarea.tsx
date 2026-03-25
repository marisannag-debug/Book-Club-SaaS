"use client"
import React from 'react'

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

export function Textarea(props: TextareaProps) {
  return <textarea className="border rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-sky-200" {...props} />
}

export default Textarea
