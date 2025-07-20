'use client'

import { Search, X } from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Stylist } from '@/core/domains/stylists/stylist.types'

type StylistFiltersProps = {
  stylists: Stylist[]
  onFiltersChange: (filters: StylistFilters) => void
  className?: string
}

export type StylistFilters = {
  search: string
  status: 'all' | 'active' | 'inactive'
}

export function StylistFilters({ stylists: _stylists, onFiltersChange, className }: StylistFiltersProps) {
  const [filters, setFilters] = useState<StylistFilters>({
    search: '',
    status: 'all',
  })

  const handleFilterChange = (key: keyof StylistFilters, value: string) => {
    if (key === 'status') {
      const newFilters: StylistFilters = { ...filters, status: value as 'all' | 'active' | 'inactive' }
      setFilters(newFilters)
      onFiltersChange(newFilters)
    } else {
      const newFilters: StylistFilters = { ...filters, [key]: value }
      setFilters(newFilters)
      onFiltersChange(newFilters)
    }
  }

  const clearFilters = () => {
    const clearedFilters: StylistFilters = {
      search: '',
      status: 'all',
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const hasActiveFilters = filters.search || filters.status !== 'all'

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search and Status Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Caută după nume sau email..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Toate statusurile" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toate statusurile</SelectItem>
            <SelectItem value="active">Doar activi</SelectItem>
            <SelectItem value="inactive">Doar inactivi</SelectItem>
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
          {filters.status !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Status: {filters.status === 'active' ? 'Activi' : 'Inactivi'}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleFilterChange('status', 'all')}
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
