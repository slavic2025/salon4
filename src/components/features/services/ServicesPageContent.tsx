// src/components/features/services/ServicesPageContent.tsx
'use client'

import { EmptyState } from '@/components/shared/EmptyState'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Service } from '@/core/domains/services/service.types'

import { AddServiceDialog } from './AddServiceDialog'
import { ServicesTable } from './ServicesTable'

interface ServicesPageContentProps {
  services: Service[]
}

export function ServicesPageContent({ services }: ServicesPageContentProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Management Servicii</h1>
          <p className="text-muted-foreground">Vizualizează, adaugă sau editează serviciile oferite de salon.</p>
        </div>
        <AddServiceDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista Serviciilor</CardTitle>
          <CardDescription>Un total de {services.length} servicii înregistrate.</CardDescription>
        </CardHeader>
        <CardContent>
          {services.length > 0 ? (
            <ServicesTable services={services} />
          ) : (
            <EmptyState
              title="Niciun serviciu adăugat"
              description="Începe prin a adăuga primul serviciu oferit de salon."
              actions={<AddServiceDialog />}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
