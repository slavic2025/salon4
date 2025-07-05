// src/components/features/stylists/StylistsPageContent.tsx
'use client'

import { PlusCircle } from 'lucide-react'

import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Stylist } from '@/core/domains/stylists/stylist.types'

import { StylistsTable } from './StylistsTable'

type StylistsPageContentProps = {
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
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adaugă Stilist
        </Button>
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
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
