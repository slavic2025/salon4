// src/components/features/work-schedule/WorkSchedulePageContent.tsx
'use client'

import { Calendar, Clock, TrendingUp } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { WORK_SCHEDULE_MESSAGES } from '@/core/domains/work-schedule/workSchedule.constants'
import type { StylistWeeklySchedule, WorkSchedule } from '@/core/domains/work-schedule/workSchedule.types'

import { AddWorkScheduleDialog } from './AddWorkScheduleDialog'
import { WorkScheduleFilters, type WorkScheduleFilters as WorkScheduleFiltersType } from './WorkScheduleFilters'
import { WorkScheduleGridView } from './WorkScheduleGridView'
import { WorkScheduleTable } from './WorkScheduleTable'
import { WorkScheduleViewToggle } from './WorkScheduleViewToggle'

type WorkSchedulePageContentProps = {
  stylistSchedule: StylistWeeklySchedule
}

export function WorkSchedulePageContent({ stylistSchedule }: WorkSchedulePageContentProps) {
  const [view, setView] = useState<'table' | 'card'>('table')
  const [filters, setFilters] = useState<WorkScheduleFiltersType>({
    search: '',
    dayOfWeek: 'all',
    minDuration: 'all',
  })

  // Convertim programul săptămânal într-o listă de intervale pentru filtrare
  const allIntervals = useMemo(() => {
    const intervals: WorkSchedule[] = []
    Object.values(stylistSchedule.schedule).forEach((daySchedules) => {
      if (daySchedules) {
        intervals.push(...daySchedules)
      }
    })
    return intervals
  }, [stylistSchedule.schedule])

  // Aplicăm filtrele
  const filteredIntervals = useMemo(() => {
    return allIntervals.filter((interval) => {
      // Filtrare după căutare
      if (filters.search) {
        const dayName = DAY_NAMES[interval.dayOfWeek as keyof typeof DAY_NAMES]
        const searchLower = filters.search.toLowerCase()
        if (
          !dayName.toLowerCase().includes(searchLower) &&
          !interval.startTime.includes(searchLower) &&
          !interval.endTime.includes(searchLower)
        ) {
          return false
        }
      }

      // Filtrare după zi
      if (filters.dayOfWeek !== 'all' && interval.dayOfWeek !== filters.dayOfWeek) {
        return false
      }

      // Filtrare după durată minimă
      if (filters.minDuration !== 'all') {
        const duration = calculateDuration(interval.startTime, interval.endTime)
        const durationMinutes = parseDurationToMinutes(duration)
        if (durationMinutes < filters.minDuration) {
          return false
        }
      }

      return true
    })
  }, [allIntervals, filters])

  // Calculăm statisticile
  const stats = useMemo(() => {
    const totalIntervals = allIntervals.length
    const totalHours = allIntervals.reduce((total, interval) => {
      const duration = calculateDuration(interval.startTime, interval.endTime)
      return total + parseDurationToMinutes(duration) / 60
    }, 0)
    const daysWithSchedule = Object.values(stylistSchedule.schedule).filter((day) => day && day.length > 0).length

    return {
      totalIntervals,
      totalHours: Math.round(totalHours * 10) / 10,
      daysWithSchedule,
    }
  }, [allIntervals, stylistSchedule.schedule])

  return (
    <div className="space-y-6">
      {/* Header cu statistici */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{WORK_SCHEDULE_MESSAGES.UI.PAGE_TITLE}</h1>
          <p className="text-muted-foreground">{WORK_SCHEDULE_MESSAGES.UI.PAGE_DESCRIPTION}</p>
        </div>
        <AddWorkScheduleDialog stylistId={stylistSchedule.stylistId} />
      </div>

      {/* Cards cu statistici */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Intervale</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalIntervals}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalIntervals === 1 ? 'interval configurat' : 'intervale configurate'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ore Totale</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHours}</div>
            <p className="text-xs text-muted-foreground">ore de lucru pe săptămână</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Zile Active</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.daysWithSchedule}</div>
            <p className="text-xs text-muted-foreground">
              {stats.daysWithSchedule === 1 ? 'zi cu program' : 'zile cu program'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtre și toggle vizualizare */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <WorkScheduleFilters intervals={allIntervals} onFiltersChange={setFilters} className="flex-1" />
        <WorkScheduleViewToggle view={view} onViewChange={setView} />
      </div>

      {/* Conținut principal */}
      <Card>
        <CardHeader>
          <CardTitle>{WORK_SCHEDULE_MESSAGES.UI.SCHEDULE_OVERVIEW_TITLE}</CardTitle>
          <CardDescription>
            {filteredIntervals.length > 0
              ? `${filteredIntervals.length} ${filteredIntervals.length === 1 ? 'interval găsit' : 'intervale găsite'}`
              : 'Niciun interval nu corespunde filtrelor'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredIntervals.length > 0 ? (
            view === 'card' ? (
              <WorkScheduleGridView intervals={filteredIntervals} stylistId={stylistSchedule.stylistId} />
            ) : (
              <WorkScheduleTable intervals={filteredIntervals} stylistId={stylistSchedule.stylistId} />
            )
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Niciun interval nu corespunde filtrelor selectate.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Funcții helper
import { DAY_NAMES } from '@/core/domains/work-schedule/workSchedule.constants'

function calculateDuration(startTime: string, endTime: string): string {
  const [startHours, startMinutes] = startTime.split(':').map(Number)
  const [endHours, endMinutes] = endTime.split(':').map(Number)

  const startTotalMinutes = startHours * 60 + startMinutes
  const endTotalMinutes = endHours * 60 + endMinutes

  const durationMinutes = endTotalMinutes - startTotalMinutes
  const hours = Math.floor(durationMinutes / 60)
  const minutes = durationMinutes % 60

  if (hours > 0) {
    return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`.trim()
  }
  return `${minutes}m`
}

function parseDurationToMinutes(duration: string): number {
  const hoursMatch = duration.match(/(\d+)h/)
  const minutesMatch = duration.match(/(\d+)m/)

  const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0
  const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0

  return hours * 60 + minutes
}
