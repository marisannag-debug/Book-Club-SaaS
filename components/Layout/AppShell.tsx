import React from 'react'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-56 bg-slate-50 border-r p-4">Sidebar</aside>
      <div className="flex-1">{children}</div>
    </div>
  )
}

export default AppShell
