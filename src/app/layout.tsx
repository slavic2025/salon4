// src/app/layout.tsx
import './globals.css' // Asigură-te că globals.css este importat

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Salon App',
  description: 'Management pentru salonul tău',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ro" className="h-full">
      <body className={`${inter.className} h-full`}>{children}</body>
    </html>
  )
}
