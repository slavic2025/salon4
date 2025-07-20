'use client'

import { Filter, Search, X } from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { SERVICE_CATEGORIES, SERVICE_CATEGORY_LABELS } from '@/core/domains/services/service.constants'
import type { Service } from '@/core/domains/services/service.types'

type ServiceFiltersProps = {
  services: Service[]
  onFiltersChange: (filters: ServiceFilters) => void
  className?: string
}

export type ServiceFilters = {
  search: string
  category: string | 'all'
  showActiveOnly: boolean
}

export function ServiceFilters({ services, onFiltersChange, className }: ServiceFiltersProps) {
  const [filters, setFilters] = useState<ServiceFilters>({
    search: '',
    category: 'all',
    showActiveOnly: false,
  })

  const handleFilterChange = (key: keyof ServiceFilters, value: string | boolean) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      category: 'all',
      showActiveOnly: false,
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const hasActiveFilters = filters.search || filters.category !== 'all' || filters.showActiveOnly

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search and Category Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Caută servicii..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Toate categoriile" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toate categoriile</SelectItem>
            {SERVICE_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {SERVICE_CATEGORY_LABELS[category]}
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

      {/* Active Services Toggle */}
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Filtre suplimentare</span>
          </div>
          <p className="text-sm text-muted-foreground">Arată doar serviciile active disponibile pentru programări</p>
        </div>
        <Switch
          checked={filters.showActiveOnly}
          onCheckedChange={(checked) => handleFilterChange('showActiveOnly', checked)}
        />
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
          {filters.category !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Categorie: {SERVICE_CATEGORY_LABELS[filters.category as keyof typeof SERVICE_CATEGORY_LABELS]}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleFilterChange('category', 'all')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {filters.showActiveOnly && (
            <Badge variant="secondary" className="gap-1">
              Doar active
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleFilterChange('showActiveOnly', false)}
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
