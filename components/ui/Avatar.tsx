import React from 'react'

export function Avatar({ name, className = '' }: { name?: string; className?: string }) {
  const initials = name ? name.split(' ').map(n=>n[0]).slice(0,2).join('') : 'BC'
  return <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-200 ${className}`}>{initials}</div>
}

export default Avatar
