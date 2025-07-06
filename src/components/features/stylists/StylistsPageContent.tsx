// src/components/features/stylists/StylistsPageContent.tsx
'use client'

import { EmptyState } from '@/components/shared/EmptyState'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Stylist } from '@/core/domains/stylists/stylist.types'

import { AddStylistDialog } from './AddStylistDialog' // Importăm dialogul de adăugare
import { StylistsTable } from './StylistsTable'

interface StylistsPageContentProps {
  stylists: Stylist[]
}

export function StylistsPageContent({ stylists }: StylistsPageContentProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Management Stiliști</h1>
          <p className="text-muted-foreground">Vizualizează, adaugă sau editează stiliștii din salonul tău.</p>
        </div>
        {/* Adăugăm componenta de dialog direct în header */}
        <AddStylistDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista Stiliștilor</CardTitle>
          <CardDescription>Un total de {stylists.length} stiliști înregistrați.</CardDescription>
        </CardHeader>
        <CardContent>
          {stylists.length > 0 ? (
            <StylistsTable stylists={stylists} />
          ) : (
            <EmptyState
              title="Niciun stilist adăugat"
              description="Începe prin a adăuga primul stilist în echipa ta."
              actions={<AddStylistDialog />} // Putem refolosi dialogul și aici
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
