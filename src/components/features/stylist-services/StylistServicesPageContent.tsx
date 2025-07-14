// src/components/features/stylist-services/StylistServicesPageContent.tsx
'use client'

import { EmptyState } from '@/components/shared/EmptyState'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { StylistServiceLinkWithService } from '@/core/domains/stylist-services/stylist-service.types'

import { AddStylistServiceDialog } from './AddStylistServiceDialog'
import { StylistServicesTable } from './StylistServicesTable'

type StylistServicesPageContentProps = {
  services: StylistServiceLinkWithService[]
  stylistId: string
  stylistName: string
}

export function StylistServicesPageContent({ services, stylistId, stylistName }: StylistServicesPageContentProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Servicii pentru {stylistName}</h1>
          <p className="text-muted-foreground">Gestionează serviciile asociate acestui stilist.</p>
        </div>
        <AddStylistServiceDialog stylistId={stylistId} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lista Serviciilor</CardTitle>
          <CardDescription>{services.length} servicii asociate.</CardDescription>
        </CardHeader>
        <CardContent>
          {services.length > 0 ? (
            <StylistServicesTable services={services} stylistId={stylistId} />
          ) : (
            <EmptyState
              title="Niciun serviciu asociat"
              description="Adaugă un serviciu pentru acest stilist."
              actions={<AddStylistServiceDialog stylistId={stylistId} />}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
