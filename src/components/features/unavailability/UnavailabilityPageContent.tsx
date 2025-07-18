// src/components/features/unavailability/UnavailabilityPageContent.tsx
'use client'

import { EmptyState } from '@/components/shared/EmptyState'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Unavailability } from '@/core/domains/unavailability/unavailability.types'

import { AddUnavailabilityDialog } from './AddUnavailabilityDialog'
import { BulkUnavailabilityDialog } from './BulkUnavailabilityDialog'
import { UnavailabilityTable } from './UnavailabilityTable'

type UnavailabilityPageContentProps = {
  unavailabilities: Unavailability[]
  stylistId: string
}

export function UnavailabilityPageContent({ unavailabilities, stylistId }: UnavailabilityPageContentProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Indisponibilități</h1>
          <p className="text-muted-foreground">
            Gestionează intervalele tale de indisponibilitate pentru următoarele luni.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <BulkUnavailabilityDialog stylistId={stylistId} />
          <AddUnavailabilityDialog stylistId={stylistId} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista Indisponibilităților</CardTitle>
          <CardDescription>
            {unavailabilities.length > 0
              ? `Un total de ${unavailabilities.length} indisponibilități planificate.`
              : 'Nu ai nicio indisponibilitate planificată.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {unavailabilities.length > 0 ? (
            <UnavailabilityTable unavailabilities={unavailabilities} stylistId={stylistId} />
          ) : (
            <EmptyState
              title="Nicio indisponibilitate planificată"
              description="Adaugă intervale de indisponibilitate pentru a le exclude din programările tale."
              actions={
                <div className="flex items-center gap-2">
                  <BulkUnavailabilityDialog stylistId={stylistId} />
                  <AddUnavailabilityDialog stylistId={stylistId} />
                </div>
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
