import '../styles/globals.css'
import React from 'react'

export const metadata = {
  title: 'BookClub Pro',
  description: 'MVP'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body>
        <div className="min-h-screen">
          <header className="bg-slate-100 p-4 shadow-sm">
            <div className="container mx-auto">BookClub Pro — MVP</div>
          </header>
          <main className="container mx-auto p-4">{children}</main>
        </div>
      </body>
    </html>
  )
}
