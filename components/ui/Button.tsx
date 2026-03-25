"use client"
import React from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary'
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const base = 'px-4 py-2 rounded-md focus:outline-none'
  const styles = variant === 'primary' ? 'bg-sky-600 text-white hover:bg-sky-700' : 'bg-slate-100 text-slate-900'
  return <button className={`${base} ${styles} ${className}`} {...props} />
}

export default Button
