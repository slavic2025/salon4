'use client'

import type { Service } from '@/core/domains/services/service.types'

import { ServiceCard } from './ServiceCard'

type ServicesGridViewProps = {
  services: Service[]
  className?: string
}

export function ServicesGridView({ services, className }: ServicesGridViewProps) {
  if (services.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 text-center ${className}`}>
        <div className="rounded-full bg-muted p-3 mb-4">
          <svg className="h-8 w-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">Nu s-au găsit servicii</h3>
        <p className="text-muted-foreground max-w-sm">Încearcă să modifici filtrele sau să adaugi un serviciu nou.</p>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${className}`}>
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  )
}
