'use client'

import { format } from 'date-fns'
import { ro } from 'date-fns/locale'
import { Clock, Coffee, Moon, Sun, Sunset } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { Slot } from '@/core/domains/appointments/appointment.utils'
import { cn } from '@/lib/utils'

interface BookingTimeSlotsProps {
  slots: Slot[]
  selectedSlot?: Slot
  onSlotSelect: (slot: Slot) => void
  date?: Date
  className?: string
  disabled?: boolean
}

// Funcție helper pentru a grupa sloturile după perioade ale zilei
const groupSlotsByPeriod = (slots: Slot[]) => {
  const periods = {
    morning: { label: 'Dimineața', icon: Sun, slots: [] as Slot[] },
    afternoon: { label: 'După-amiază', icon: Coffee, slots: [] as Slot[] },
    evening: { label: 'Seara', icon: Sunset, slots: [] as Slot[] },
    night: { label: 'Noaptea', icon: Moon, slots: [] as Slot[] },
  }

  slots.forEach((slot) => {
    const hour = new Date(slot.start).getHours()

    if (hour >= 6 && hour < 12) {
      periods.morning.slots.push(slot)
    } else if (hour >= 12 && hour < 17) {
      periods.afternoon.slots.push(slot)
    } else if (hour >= 17 && hour < 22) {
      periods.evening.slots.push(slot)
    } else {
      periods.night.slots.push(slot)
    }
  })

  return Object.entries(periods)
    .filter(([_, period]) => period.slots.length > 0)
    .map(([key, period]) => ({ key, ...period }))
}

export function BookingTimeSlots({
  slots,
  selectedSlot,
  onSlotSelect,
  date,
  className,
  disabled = false,
}: BookingTimeSlotsProps) {
  const availableSlots = slots.filter((slot) => slot.available)
  const groupedSlots = groupSlotsByPeriod(availableSlots)

  if (availableSlots.length === 0) {
    return (
      <div className={cn('bg-white rounded-lg border shadow-sm p-6', className)}>
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-gray-900">Selectează ora</h3>
        </div>

        <div className="text-center py-8">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
          <p className="text-gray-600 font-medium mb-2">Nu sunt sloturi disponibile</p>
          <p className="text-sm text-muted-foreground">
            {date ? `pentru ${format(date, 'EEEE, d MMMM', { locale: ro })}` : 'pentru data selectată'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('bg-white rounded-lg border shadow-sm p-6', className)}>
      {/* Header */}
      <div className="flex items-center space-x-2 mb-6">
        <Clock className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-gray-900">Selectează ora</h3>
        {date && (
          <span className="text-sm text-muted-foreground ml-auto">{format(date, 'EEEE, d MMMM', { locale: ro })}</span>
        )}
      </div>

      {/* Time Slots Grouped by Period */}
      <div className="space-y-6">
        {groupedSlots.map(({ key, label, icon: Icon, slots: periodSlots }) => (
          <div key={key} className="space-y-3">
            {/* Period Header */}
            <div className="flex items-center space-x-2 border-b border-gray-100 pb-2">
              <Icon className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-medium text-gray-700">{label}</h4>
              <span className="text-xs text-muted-foreground">
                ({periodSlots.length} {periodSlots.length === 1 ? 'slot' : 'sloturi'})
              </span>
            </div>

            {/* Time Slots Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {periodSlots.map((slot) => {
                const isSelected = selectedSlot?.start === slot.start
                const startTime = new Date(slot.start)
                const endTime = new Date(slot.end)

                return (
                  <Button
                    key={slot.start}
                    variant={isSelected ? 'default' : 'outline'}
                    size="sm"
                    disabled={disabled}
                    className={cn(
                      'h-auto p-3 flex flex-col items-center transition-all duration-200',
                      'hover:scale-105 hover:shadow-md',
                      isSelected && 'ring-2 ring-primary ring-offset-2 scale-105 shadow-lg',
                      disabled && 'hover:scale-100',
                    )}
                    onClick={() => onSlotSelect(slot)}
                  >
                    <div className="text-sm font-medium">{format(startTime, 'HH:mm', { locale: ro })}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      până la {format(endTime, 'HH:mm', { locale: ro })}
                    </div>
                  </Button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Slot Info */}
      {selectedSlot && (
        <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-full text-primary">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ora selectată:</p>
              <p className="font-semibold text-primary">
                {format(new Date(selectedSlot.start), 'HH:mm', { locale: ro })} -{' '}
                {format(new Date(selectedSlot.end), 'HH:mm', { locale: ro })}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
