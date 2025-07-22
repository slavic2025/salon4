// src/components/features/stylist-services/StylistServicesPageContent.tsx
'use client'

import { useMemo, useState } from 'react'

import { EmptyState } from '@/components/shared/EmptyState'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { StylistServiceLinkWithService } from '@/core/domains/stylist-services/stylist-service.types'
import { DEFAULT_CURRENCY } from '@/lib/constants'

import { AddStylistServiceDialog } from './AddStylistServiceDialog'
import { type StylistServiceFilters as Filters,StylistServiceFilters } from './StylistServiceFilters'
import { StylistServicesGridView } from './StylistServicesGridView'
import { StylistServicesTable } from './StylistServicesTable'
import { StylistServiceViewToggle } from './StylistServiceViewToggle'

type StylistServicesPageContentProps = {
  services: StylistServiceLinkWithService[]
  stylistId: string
  stylistName: string
}

export function StylistServicesPageContent({ services, stylistId, stylistName }: StylistServicesPageContentProps) {
  const [view, setView] = useState<'table' | 'card'>('card')
  const [filters, setFilters] = useState<Filters>({
    search: '',
    category: 'all',
    hasCustomizations: false,
  })

  // Filtrare servicii
  const filteredServices = useMemo(() => {
    return services.filter((link) => {
      const service = link.service
      const hasCustomPrice = link.customPrice !== null && link.customPrice !== undefined
      const hasCustomDuration = link.customDuration !== null && link.customDuration !== undefined
      const hasCustomizations = hasCustomPrice || hasCustomDuration

      // Filtrare după căutare
      if (filters.search && !service.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }

      // Filtrare după categorie
      if (filters.category !== 'all' && service.category !== filters.category) {
        return false
      }

      // Filtrare după personalizări
      if (filters.hasCustomizations && !hasCustomizations) {
        return false
      }

      return true
    })
  }, [services, filters])

  // Statistici
  const stats = useMemo(() => {
    const totalServices = services.length
    const customizedServices = services.filter(
      (link) =>
        (link.customPrice !== null && link.customPrice !== undefined) ||
        (link.customDuration !== null && link.customDuration !== undefined),
    ).length
    const totalValue = services.reduce((sum, link) => {
      const price = link.customPrice || link.service.price
      return sum + (typeof price === 'number' ? price : parseFloat(price || '0'))
    }, 0)

    return {
      total: totalServices,
      customized: customizedServices,
      totalValue,
    }
  }, [services])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Servicii pentru {stylistName}</h1>
          <p className="text-muted-foreground">Gestionează serviciile asociate acestui stilist.</p>
        </div>
        <AddStylistServiceDialog stylistId={stylistId} />
      </div>

      {/* Statistici */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Servicii</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">servicii asociate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personalizate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.customized}</div>
            <p className="text-xs text-muted-foreground">cu preț/durată personalizată</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valoare Totală</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalValue} {DEFAULT_CURRENCY}
            </div>
            <p className="text-xs text-muted-foreground">valoarea serviciilor</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtre */}
      <Card>
        <CardHeader>
          <CardTitle>Filtre și Căutare</CardTitle>
          <CardDescription>Filtrează serviciile după diferite criterii</CardDescription>
        </CardHeader>
        <CardContent>
          <StylistServiceFilters services={services} onFiltersChange={setFilters} />
        </CardContent>
      </Card>

      {/* Lista Servicii */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista Serviciilor</CardTitle>
              <CardDescription>
                {filteredServices.length} din {services.length} servicii
                {filters.search && ` pentru "${filters.search}"`}
              </CardDescription>
            </div>
            <StylistServiceViewToggle view={view} onViewChange={setView} />
          </div>
        </CardHeader>
        <CardContent>
          {filteredServices.length > 0 ? (
            view === 'card' ? (
              <StylistServicesGridView services={filteredServices} stylistId={stylistId} />
            ) : (
              <StylistServicesTable services={filteredServices} stylistId={stylistId} />
            )
          ) : (
            <EmptyState
              title="Niciun serviciu găsit"
              description={
                filters.search || filters.category !== 'all' || filters.hasCustomizations
                  ? 'Nu există servicii care să corespundă criteriilor de filtrare.'
                  : 'Adaugă un serviciu pentru acest stilist.'
              }
              actions={
                filters.search || filters.category !== 'all' || filters.hasCustomizations ? (
                  <button
                    onClick={() => setFilters({ search: '', category: 'all', hasCustomizations: false })}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Șterge filtrele
                  </button>
                ) : (
                  <AddStylistServiceDialog stylistId={stylistId} />
                )
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
