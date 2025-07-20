// src/components/features/unavailability/UnavailabilityPageContent.tsx
'use client'

import { Calendar, CalendarX, Clock } from 'lucide-react'
import { useMemo, useState } from 'react'

import { EmptyState } from '@/components/shared/EmptyState'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Unavailability } from '@/core/domains/unavailability/unavailability.types'

import { AddUnavailabilityDialog } from './AddUnavailabilityDialog'
import { BulkUnavailabilityDialog } from './BulkUnavailabilityDialog'
import { UnavailabilityFilters, type UnavailabilityFilters as UnavailabilityFiltersType } from './UnavailabilityFilters'
import { UnavailabilityGridView } from './UnavailabilityGridView'
import { UnavailabilityTable } from './UnavailabilityTable'
import { UnavailabilityViewToggle } from './UnavailabilityViewToggle'

type UnavailabilityPageContentProps = {
  unavailabilities: Unavailability[]
  stylistId: string
}

export function UnavailabilityPageContent({ unavailabilities, stylistId }: UnavailabilityPageContentProps) {
  const [view, setView] = useState<'table' | 'card'>('table')
  const [filters, setFilters] = useState<UnavailabilityFiltersType>({
    search: '',
    cause: 'all',
    showAllDayOnly: false,
    showTimeSpecificOnly: false,
  })

  // Calculăm statisticile
  const stats = useMemo(() => {
    const total = unavailabilities.length
    const allDay = unavailabilities.filter((u) => u.allDay).length
    const timeSpecific = unavailabilities.filter((u) => !u.allDay).length
    const upcoming = unavailabilities.filter((u) => new Date(u.date) >= new Date()).length

    return { total, allDay, timeSpecific, upcoming }
  }, [unavailabilities])

  // Filtrarea indisponibilităților
  const filteredUnavailabilities = useMemo(() => {
    return unavailabilities.filter((unavailability) => {
      // Filtrare după căutare
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const causeLabel = unavailability.cause.toLowerCase()
        const description = unavailability.description?.toLowerCase() || ''
        const date = unavailability.date.toLowerCase()

        if (!causeLabel.includes(searchLower) && !description.includes(searchLower) && !date.includes(searchLower)) {
          return false
        }
      }

      // Filtrare după cauză
      if (filters.cause !== 'all' && unavailability.cause !== filters.cause) {
        return false
      }

      // Filtrare după tip (toată ziua)
      if (filters.showAllDayOnly && !unavailability.allDay) {
        return false
      }

      // Filtrare după tip (interval specific)
      if (filters.showTimeSpecificOnly && unavailability.allDay) {
        return false
      }

      return true
    })
  }, [unavailabilities, filters])

  return (
    <div className="space-y-6">
      {/* Header cu statistici */}
      <div className="space-y-4">
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

        {/* Cards cu statistici */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">indisponibilități</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toată ziua</CardTitle>
              <CalendarX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.allDay}</div>
              <p className="text-xs text-muted-foreground">zile complete</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Intervale</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.timeSpecific}</div>
              <p className="text-xs text-muted-foreground">intervale specifice</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Viitoare</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcoming}</div>
              <p className="text-xs text-muted-foreground">în următoarele zile</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Secțiunea principală */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista Indisponibilităților</CardTitle>
              <CardDescription>
                {filteredUnavailabilities.length > 0
                  ? `Se afișează ${filteredUnavailabilities.length} din ${unavailabilities.length} indisponibilități.`
                  : 'Nu ai nicio indisponibilitate planificată.'}
              </CardDescription>
            </div>
            <UnavailabilityViewToggle view={view} onViewChange={setView} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filtre */}
          <UnavailabilityFilters unavailabilities={unavailabilities} onFiltersChange={setFilters} />

          {/* Conținut */}
          {filteredUnavailabilities.length > 0 ? (
            view === 'table' ? (
              <UnavailabilityTable unavailabilities={filteredUnavailabilities} stylistId={stylistId} />
            ) : (
              <UnavailabilityGridView unavailabilities={filteredUnavailabilities} stylistId={stylistId} />
            )
          ) : (
            <EmptyState
              title="Nicio indisponibilitate găsită"
              description={
                unavailabilities.length === 0
                  ? 'Adaugă intervale de indisponibilitate pentru a le exclude din programările tale.'
                  : 'Nu există indisponibilități care să corespundă filtrelor selectate.'
              }
              actions={
                unavailabilities.length === 0 ? (
                  <div className="flex items-center gap-2">
                    <BulkUnavailabilityDialog stylistId={stylistId} />
                    <AddUnavailabilityDialog stylistId={stylistId} />
                  </div>
                ) : undefined
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
