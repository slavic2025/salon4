// src/app/layout.tsx
import './globals.css'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { GlobalPreloader } from '@/components/shared/GlobalPreloader'
import { Toaster } from '@/components/ui/sonner'

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
      <body className={`${inter.className} h-full`}>
        {children}
        <GlobalPreloader />
        <Toaster richColors />
      </body>
    </html>
  )
}
