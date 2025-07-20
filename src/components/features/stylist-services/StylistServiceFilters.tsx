'use client'

import { Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { StylistServiceLinkWithService } from '@/core/domains/stylist-services/stylist-service.types'

type StylistServiceFiltersProps = {
  services: StylistServiceLinkWithService[]
  onFiltersChange: (filters: StylistServiceFilters) => void
  className?: string
}

export type StylistServiceFilters = {
  search: string
  category: string | 'all'
  hasCustomizations: boolean
}

export function StylistServiceFilters({ services: _services, onFiltersChange, className }: StylistServiceFiltersProps) {
  const [filters, setFilters] = useState<StylistServiceFilters>({
    search: '',
    category: 'all',
    hasCustomizations: false,
  })

  // Obținem categoriile unice din servicii
  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      _services
        .map((link) => link.service.category)
        .filter((category): category is NonNullable<typeof category> => category !== null),
    )
    return Array.from(uniqueCategories).sort()
  }, [_services])

  const handleFilterChange = (key: keyof StylistServiceFilters, value: string | boolean) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      category: 'all',
      hasCustomizations: false,
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const hasActiveFilters = filters.search || filters.category !== 'all' || filters.hasCustomizations

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Căutare */}
        <div className="space-y-2">
          <Label htmlFor="search">Căutare</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Caută după nume serviciu..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Categorie */}
        <div className="space-y-2">
          <Label htmlFor="category">Categorie</Label>
          <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Toate categoriile" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toate categoriile</SelectItem>
              {categories.map((category: string) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Personalizări */}
        <div className="space-y-2">
          <Label htmlFor="customizations">Personalizări</Label>
          <Select
            value={filters.hasCustomizations ? 'customized' : 'all'}
            onValueChange={(value) => handleFilterChange('hasCustomizations', value === 'customized')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Toate serviciile" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toate serviciile</SelectItem>
              <SelectItem value="customized">Cu personalizări</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Buton șterge filtre */}
        <div className="space-y-2">
          <Label>&nbsp;</Label>
          <Button variant="outline" onClick={clearFilters} disabled={!hasActiveFilters} className="w-full">
            <X className="mr-2 h-4 w-4" />
            Șterge filtrele
          </Button>
        </div>
      </div>
    </div>
  )
}
