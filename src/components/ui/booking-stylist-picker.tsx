'use client'

import { User, Users } from 'lucide-react'

import { BookingCard } from '@/components/ui/booking-card'
import type { Stylist } from '@/core/domains/stylists/stylist.types'
import { cn } from '@/lib/utils'

interface BookingStylistPickerProps {
  stylists: Stylist[]
  selectedStylist?: Stylist
  onStylistSelect: (stylist: Stylist) => void
  className?: string
  disabled?: boolean
}

export function BookingStylistPicker({
  stylists,
  selectedStylist,
  onStylistSelect,
  className,
  disabled = false,
}: BookingStylistPickerProps) {
  if (stylists.length === 0) {
    return (
      <div className={cn('bg-white rounded-lg border shadow-sm p-6', className)}>
        <div className="flex items-center space-x-2 mb-4">
          <Users className="w-5 h-5 text-slate-600" />
          <h3 className="font-semibold text-slate-900">Selectează stilistul</h3>
        </div>

        <div className="text-center py-8">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-slate-600" />
          </div>
          <p className="text-slate-600 font-medium mb-2">Nu sunt stiliști disponibili</p>
          <p className="text-sm text-muted-foreground">pentru slotul de timp selectat</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('bg-white rounded-lg border shadow-sm p-6', className)}>
      {/* Header */}
      <div className="flex items-center space-x-2 mb-6">
        <Users className="w-5 h-5 text-slate-600" />
        <h3 className="font-semibold text-slate-900">Selectează stilistul</h3>
        <span className="text-sm text-muted-foreground ml-auto">
          ({stylists.length} {stylists.length === 1 ? 'disponibil' : 'disponibili'})
        </span>
      </div>

      {/* Stylists Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stylists.map((stylist) => (
          <BookingCard
            key={stylist.id}
            id={stylist.id}
            title={stylist.fullName}
            subtitle={stylist.email}
            description={stylist.description}
            icon={<User />}
            variant="stylist"
            isSelected={selectedStylist?.id === stylist.id}
            onClick={() => onStylistSelect(stylist)}
            disabled={disabled}
          />
        ))}
      </div>

      {/* Selected Stylist Info */}
      {selectedStylist && (
        <div className="mt-6 p-4 bg-gradient-to-r from-stone-50 to-stone-100 border border-stone-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-stone-100 to-stone-200 rounded-full text-slate-700">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Stilist selectat:</p>
              <p className="font-semibold text-slate-700">{selectedStylist.fullName}</p>
              {selectedStylist.description && (
                <p className="text-sm text-slate-500 mt-1">{selectedStylist.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
