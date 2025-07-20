'use client'

import { Search, X } from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DAY_NAMES } from '@/core/domains/work-schedule/workSchedule.constants'
import type { WorkSchedule } from '@/core/domains/work-schedule/workSchedule.types'

type WorkScheduleFiltersProps = {
  intervals: WorkSchedule[]
  onFiltersChange: (filters: WorkScheduleFilters) => void
  className?: string
}

export type WorkScheduleFilters = {
  search: string
  dayOfWeek: number | 'all'
  minDuration: number | 'all'
}

export function WorkScheduleFilters({ intervals: _intervals, onFiltersChange, className }: WorkScheduleFiltersProps) {
  const [filters, setFilters] = useState<WorkScheduleFilters>({
    search: '',
    dayOfWeek: 'all',
    minDuration: 'all',
  })

  const handleFilterChange = (key: keyof WorkScheduleFilters, value: string | number) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters: WorkScheduleFilters = {
      search: '',
      dayOfWeek: 'all',
      minDuration: 'all',
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const hasActiveFilters = filters.search || filters.dayOfWeek !== 'all' || filters.minDuration !== 'all'

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search and Day Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Caută intervale..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10"
          />
        </div>

        <Select
          value={filters.dayOfWeek.toString()}
          onValueChange={(value) => handleFilterChange('dayOfWeek', value === 'all' ? 'all' : parseInt(value))}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Toate zilele" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toate zilele</SelectItem>
            {Object.entries(DAY_NAMES).map(([dayNumber, dayName]) => (
              <SelectItem key={dayNumber} value={dayNumber}>
                {dayName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.minDuration.toString()}
          onValueChange={(value) => handleFilterChange('minDuration', value === 'all' ? 'all' : parseInt(value))}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Orice durată" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Orice durată</SelectItem>
            <SelectItem value="30">Minim 30 min</SelectItem>
            <SelectItem value="60">Minim 1 oră</SelectItem>
            <SelectItem value="120">Minim 2 ore</SelectItem>
            <SelectItem value="240">Minim 4 ore</SelectItem>
            <SelectItem value="480">Minim 8 ore</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="outline" size="icon" onClick={clearFilters} className="shrink-0">
            <X className="h-4 w-4" />
            <span className="sr-only">Șterge filtrele</span>
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Filtre active:</span>
          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Căutare: &ldquo;{filters.search}&rdquo;
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleFilterChange('search', '')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {filters.dayOfWeek !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Zi: {DAY_NAMES[filters.dayOfWeek as keyof typeof DAY_NAMES]}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleFilterChange('dayOfWeek', 'all')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {filters.minDuration !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Durată: {filters.minDuration} min+
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleFilterChange('minDuration', 'all')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
