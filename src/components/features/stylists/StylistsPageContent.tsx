// src/components/features/stylists/StylistsPageContent.tsx
'use client'

import { useMemo, useState } from 'react'

import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Stylist } from '@/core/domains/stylists/stylist.types'

import { AddStylistDialog } from './AddStylistDialog'
import { StylistFilters, type StylistFilters as StylistFiltersType } from './StylistFilters'
import { StylistsGridView } from './StylistsGridView'
import { StylistsTable } from './StylistsTable'
import { StylistViewToggle } from './StylistViewToggle'

type StylistsPageContentProps = {
  stylists: Stylist[]
}

export function StylistsPageContent({ stylists }: StylistsPageContentProps) {
  const [view, setView] = useState<'table' | 'card'>('card')
  const [filters, setFilters] = useState<StylistFiltersType>({
    search: '',
    status: 'all',
  })

  const filteredStylists = useMemo(() => {
    return stylists.filter((stylist) => {
      // Căutare după nume sau email
      const matchesSearch =
        !filters.search ||
        stylist.fullName.toLowerCase().includes(filters.search.toLowerCase()) ||
        stylist.email.toLowerCase().includes(filters.search.toLowerCase())

      // Filtrare după status
      const matchesStatus =
        filters.status === 'all' ||
        (filters.status === 'active' && stylist.isActive) ||
        (filters.status === 'inactive' && !stylist.isActive)

      return matchesSearch && matchesStatus
    })
  }, [stylists, filters])

  const activeStylistsCount = stylists.filter((stylist) => stylist.isActive).length
  const inactiveStylistsCount = stylists.length - activeStylistsCount

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Management Stiliști</h1>
          <p className="text-muted-foreground mt-1">Gestionează echipa de stiliști și cosmetologi ai salonului.</p>
        </div>
        <div className="flex items-center gap-3">
          <StylistViewToggle view={view} onViewChange={setView} />
          <AddStylistDialog />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Stiliști</p>
                <p className="text-2xl font-bold">{stylists.length}</p>
              </div>
              <div className="rounded-full bg-primary/10 p-3">
                <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
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
                <p className="text-sm font-medium text-muted-foreground">Stiliști Activi</p>
                <p className="text-2xl font-bold text-green-600">{activeStylistsCount}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Stiliști Inactivi</p>
                <p className="text-2xl font-bold text-gray-600">{inactiveStylistsCount}</p>
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
          <CardDescription>Filtrează stiliștii după status sau caută după nume sau email.</CardDescription>
        </CardHeader>
        <CardContent>
          <StylistFilters stylists={stylists} onFiltersChange={setFilters} />
        </CardContent>
      </Card>

      {/* Stylists List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista Stiliștilor</CardTitle>
              <CardDescription>
                {filteredStylists.length === stylists.length
                  ? `Un total de ${stylists.length} stiliști înregistrați.`
                  : `Se afișează ${filteredStylists.length} din ${stylists.length} stiliști.`}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {stylists.length === 0 ? (
            <EmptyState
              title="Niciun stilist adăugat"
              description="Începe prin a adăuga primul stilist în echipa ta."
              actions={<AddStylistDialog />}
            />
          ) : filteredStylists.length === 0 ? (
            <EmptyState
              title="Nu s-au găsit stiliști"
              description="Încearcă să modifici filtrele pentru a găsi stiliștii doriti."
              actions={
                <Button variant="outline" onClick={() => setFilters({ search: '', status: 'all' })}>
                  Șterge filtrele
                </Button>
              }
            />
          ) : view === 'table' ? (
            <StylistsTable stylists={filteredStylists} />
          ) : (
            <StylistsGridView stylists={filteredStylists} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
