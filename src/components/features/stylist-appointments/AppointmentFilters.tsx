// src/components/features/stylist-appointments/AppointmentFilters.tsx

import { Search, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type AppointmentFiltersProps = {
  filters: {
    status: 'all' | 'waiting' | 'confirmed' | 'refused' | 'cancelled' | 'completed' | 'no_show'
    dateRange: 'all' | 'today' | 'week' | 'month'
    search: string
  }
  onFiltersChange: (filters: {
    status: 'all' | 'waiting' | 'confirmed' | 'refused' | 'cancelled' | 'completed' | 'no_show'
    dateRange: 'all' | 'today' | 'week' | 'month'
    search: string
  }) => void
}

export function AppointmentFilters({ filters, onFiltersChange }: AppointmentFiltersProps) {
  const statusOptions = [
    { value: 'all', label: 'Toate statusurile' },
    { value: 'waiting', label: 'În așteptare' },
    { value: 'confirmed', label: 'Confirmate' },
    { value: 'completed', label: 'Finalizate' },
    { value: 'refused', label: 'Refuzate' },
    { value: 'cancelled', label: 'Anulate' },
    { value: 'no_show', label: 'No-show' },
  ]

  const dateRangeOptions = [
    { value: 'all', label: 'Toate datele' },
    { value: 'today', label: 'Astăzi' },
    { value: 'week', label: 'Următoarea săptămână' },
    { value: 'month', label: 'Următoarea lună' },
  ]

  const handleStatusChange = (status: string) => {
    onFiltersChange({
      ...filters,
      status: status as typeof filters.status,
    })
  }

  const handleDateRangeChange = (dateRange: string) => {
    onFiltersChange({
      ...filters,
      dateRange: dateRange as typeof filters.dateRange,
    })
  }

  const handleSearchChange = (search: string) => {
    onFiltersChange({
      ...filters,
      search,
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      status: 'all',
      dateRange: 'all',
      search: '',
    })
  }

  const hasActiveFilters = filters.status !== 'all' || filters.dateRange !== 'all' || filters.search !== ''

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          {/* Căutare */}
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Căutare</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Caută după nume, email, telefon sau serviciu..."
                value={filters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Status */}
          <div className="w-full md:w-48">
            <label className="text-sm font-medium mb-2 block">Status</label>
            <Select value={filters.status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selectează status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="w-full md:w-48">
            <label className="text-sm font-medium mb-2 block">Perioada</label>
            <Select value={filters.dateRange} onValueChange={handleDateRangeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selectează perioada" />
              </SelectTrigger>
              <SelectContent>
                {dateRangeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="w-full md:w-auto">
              <Button variant="outline" onClick={clearFilters} className="w-full md:w-auto">
                <X className="h-4 w-4 mr-2" />
                Șterge filtrele
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
