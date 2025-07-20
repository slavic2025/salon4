'use client'

import type { StylistServiceLinkWithService } from '@/core/domains/stylist-services/stylist-service.types'

import { StylistServiceCard } from './StylistServiceCard'

type StylistServicesGridViewProps = {
  services: StylistServiceLinkWithService[]
  stylistId: string
  className?: string
}

export function StylistServicesGridView({ services, stylistId, className }: StylistServicesGridViewProps) {
  if (services.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="mx-auto h-12 w-12 text-muted-foreground">
          <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-semibold text-gray-900">Niciun serviciu găsit</h3>
        <p className="mt-1 text-sm text-gray-500">Nu există servicii care să corespundă criteriilor de filtrare.</p>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${className}`}>
      {services.map((link) => (
        <StylistServiceCard key={link.serviceId} link={link} stylistId={stylistId} />
      ))}
    </div>
  )
}
