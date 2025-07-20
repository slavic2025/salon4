'use client'

import type { Stylist } from '@/core/domains/stylists/stylist.types'

import { StylistCard } from './StylistCard'

type StylistsGridViewProps = {
  stylists: Stylist[]
  className?: string
}

export function StylistsGridView({ stylists, className }: StylistsGridViewProps) {
  if (stylists.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 text-center ${className}`}>
        <div className="rounded-full bg-muted p-3 mb-4">
          <svg className="h-8 w-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">Nu s-au găsit stiliști</h3>
        <p className="text-muted-foreground max-w-sm">Încearcă să modifici filtrele sau să adaugi un stilist nou.</p>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${className}`}>
      {stylists.map((stylist) => (
        <StylistCard key={stylist.id} stylist={stylist} />
      ))}
    </div>
  )
}
