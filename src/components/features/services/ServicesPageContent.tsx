// src/components/features/services/ServicesPageContent.tsx
'use client'

import { useMemo, useState } from 'react'

import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Service } from '@/core/domains/services/service.types'

import { AddServiceDialog } from './AddServiceDialog'
import { ServiceFilters, type ServiceFilters as ServiceFiltersType } from './ServiceFilters'
import { ServicesGridView } from './ServicesGridView'
import { ServicesTable } from './ServicesTable'
import { ServiceViewToggle } from './ServiceViewToggle'

type ServicesPageContentProps = {
  services: Service[]
}

export function ServicesPageContent({ services }: ServicesPageContentProps) {
  const [view, setView] = useState<'table' | 'card'>('card')
  const [filters, setFilters] = useState<ServiceFiltersType>({
    search: '',
    category: 'all',
    showActiveOnly: false,
  })

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      // Căutare după nume sau descriere
      const matchesSearch =
        !filters.search ||
        service.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        (service.description && service.description.toLowerCase().includes(filters.search.toLowerCase()))

      // Filtrare după categorie
      const matchesCategory = filters.category === 'all' || service.category === filters.category

      // Filtrare după status activ
      const matchesActiveStatus = !filters.showActiveOnly || service.isActive

      return matchesSearch && matchesCategory && matchesActiveStatus
    })
  }, [services, filters])

  const activeServicesCount = services.filter((service) => service.isActive).length
  const inactiveServicesCount = services.length - activeServicesCount

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Management Servicii</h1>
          <p className="text-muted-foreground mt-1">
            Gestionează serviciile oferite de salon și organizează-le pe categorii.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ServiceViewToggle view={view} onViewChange={setView} />
          <AddServiceDialog />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Servicii</p>
                <p className="text-2xl font-bold">{services.length}</p>
              </div>
              <div className="rounded-full bg-primary/10 p-3">
                <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Servicii Active</p>
                <p className="text-2xl font-bold text-green-600">{activeServicesCount}</p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Servicii Inactive</p>
                <p className="text-2xl font-bold text-gray-600">{inactiveServicesCount}</p>
              </div>
              <div className="rounded-full bg-gray-100 p-3">
                <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filtre și Căutare
          </CardTitle>
          <CardDescription>Filtrează serviciile după categorie, status sau caută după nume.</CardDescription>
        </CardHeader>
        <CardContent>
          <ServiceFilters services={services} onFiltersChange={setFilters} />
        </CardContent>
      </Card>

      {/* Services List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista Serviciilor</CardTitle>
              <CardDescription>
                {filteredServices.length === services.length
                  ? `Un total de ${services.length} servicii înregistrate.`
                  : `Se afișează ${filteredServices.length} din ${services.length} servicii.`}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {services.length === 0 ? (
            <EmptyState
              title="Niciun serviciu adăugat"
              description="Începe prin a adăuga primul serviciu oferit de salon."
              actions={<AddServiceDialog />}
            />
          ) : filteredServices.length === 0 ? (
            <EmptyState
              title="Nu s-au găsit servicii"
              description="Încearcă să modifici filtrele pentru a găsi serviciile dorite."
              actions={
                <Button
                  variant="outline"
                  onClick={() => setFilters({ search: '', category: 'all', showActiveOnly: false })}
                >
                  Șterge filtrele
                </Button>
              }
            />
          ) : view === 'table' ? (
            <ServicesTable services={filteredServices} />
          ) : (
            <ServicesGridView services={filteredServices} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
