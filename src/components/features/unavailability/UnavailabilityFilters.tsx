'use client'

import { Filter, Search, X } from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  UNAVAILABILITY_CAUSE_LABELS,
  UNAVAILABILITY_CAUSES,
} from '@/core/domains/unavailability/unavailability.constants'
import type { Unavailability } from '@/core/domains/unavailability/unavailability.types'

type UnavailabilityFiltersProps = {
  unavailabilities: Unavailability[]
  onFiltersChange: (filters: UnavailabilityFilters) => void
  className?: string
}

export type UnavailabilityFilters = {
  search: string
  cause: string | 'all'
  showAllDayOnly: boolean
  showTimeSpecificOnly: boolean
}

export function UnavailabilityFilters({
  unavailabilities: _unavailabilities,
  onFiltersChange,
  className,
}: UnavailabilityFiltersProps) {
  const [filters, setFilters] = useState<UnavailabilityFilters>({
    search: '',
    cause: 'all',
    showAllDayOnly: false,
    showTimeSpecificOnly: false,
  })

  const handleFilterChange = (key: keyof UnavailabilityFilters, value: string | boolean) => {
    const newFilters = { ...filters, [key]: value }

    // Asigură-te că nu sunt selectate ambele opțiuni simultan
    if (key === 'showAllDayOnly' && value === true) {
      newFilters.showTimeSpecificOnly = false
    }
    if (key === 'showTimeSpecificOnly' && value === true) {
      newFilters.showAllDayOnly = false
    }

    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      cause: 'all',
      showAllDayOnly: false,
      showTimeSpecificOnly: false,
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const hasActiveFilters =
    filters.search || filters.cause !== 'all' || filters.showAllDayOnly || filters.showTimeSpecificOnly

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search and Cause Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Caută indisponibilități..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filters.cause} onValueChange={(value) => handleFilterChange('cause', value)}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Toate cauzele" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toate cauzele</SelectItem>
            {Object.entries(UNAVAILABILITY_CAUSES).map(([, value]) => (
              <SelectItem key={value} value={value}>
                {UNAVAILABILITY_CAUSE_LABELS[value as keyof typeof UNAVAILABILITY_CAUSE_LABELS]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="outline" size="icon" onClick={clearFilters} className="shrink-0">
            <X className="h-4 w-4" />
            <span className="sr-only">Șterge filtrele</span>
          </Button>
        )}
      </div>

      {/* Additional Filters */}
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Filtre suplimentare</span>
          </div>
          <p className="text-sm text-muted-foreground">Filtrează după tipul de indisponibilitate</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={filters.showAllDayOnly}
              onCheckedChange={(checked) => handleFilterChange('showAllDayOnly', checked)}
            />
            <span className="text-sm">Toată ziua</span>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={filters.showTimeSpecificOnly}
              onCheckedChange={(checked) => handleFilterChange('showTimeSpecificOnly', checked)}
            />
            <span className="text-sm">Interval specific</span>
          </div>
        </div>
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
          {filters.cause !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Cauză: {UNAVAILABILITY_CAUSE_LABELS[filters.cause as keyof typeof UNAVAILABILITY_CAUSE_LABELS]}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleFilterChange('cause', 'all')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {filters.showAllDayOnly && (
            <Badge variant="secondary" className="gap-1">
              Doar toată ziua
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleFilterChange('showAllDayOnly', false)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {filters.showTimeSpecificOnly && (
            <Badge variant="secondary" className="gap-1">
              Doar intervale specifice
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleFilterChange('showTimeSpecificOnly', false)}
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
