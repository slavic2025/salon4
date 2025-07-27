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
    morning: { label: 'Dimineața', icon: Sun, slots: [] as Slot[], color: 'from-yellow-400 to-orange-400' },
    afternoon: { label: 'După-amiază', icon: Coffee, slots: [] as Slot[], color: 'from-blue-400 to-purple-400' },
    evening: { label: 'Seara', icon: Sunset, slots: [] as Slot[], color: 'from-pink-400 to-red-400' },
    night: { label: 'Noaptea', icon: Moon, slots: [] as Slot[], color: 'from-indigo-400 to-purple-600' },
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
      <div className={cn('bg-white rounded-2xl border border-stone-200 shadow-lg p-8', className)}>
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-stone-100 to-stone-200 rounded-lg">
            <Clock className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Selectează ora</h3>
            <p className="text-sm text-slate-500">Alege momentul potrivit pentru programare</p>
          </div>
        </div>

        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-yellow-600" />
          </div>
          <h4 className="text-xl font-bold text-slate-900 mb-2">Nu sunt sloturi disponibile</h4>
          <p className="text-slate-600">
            {date ? `pentru ${format(date, 'EEEE, d MMMM', { locale: ro })}` : 'pentru data selectată'}
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Încearcă o altă dată sau contactează-ne pentru programări speciale
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-stone-200 shadow-lg p-6 hover:shadow-xl transition-all duration-300',
        className,
      )}
    >
      {/* Header îmbunătățit */}
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-2 bg-gradient-to-r from-stone-100 to-stone-200 rounded-lg">
          <Clock className="w-5 h-5 text-slate-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-slate-900 text-lg">Selectează ora</h3>
          <p className="text-sm text-slate-500">Alege momentul potrivit pentru programare</p>
        </div>
        {date && (
          <div className="text-right">
            <div className="px-3 py-1 bg-gradient-to-r from-stone-100 to-stone-200 rounded-full">
              <span className="text-sm font-semibold text-slate-700">
                {format(date, 'EEEE, d MMMM', { locale: ro })}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Time Slots Grouped by Period */}
      <div className="space-y-8">
        {groupedSlots.map(({ key, label, icon: Icon, slots: periodSlots, color }) => (
          <div key={key} className="space-y-4">
            {/* Period Header îmbunătățit */}
            <div className="flex items-center space-x-3 border-b border-stone-100 pb-3">
              <div className={`p-2 bg-gradient-to-r ${color} rounded-lg text-white`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-slate-900">{label}</h4>
                <p className="text-sm text-slate-500">
                  {periodSlots.length} {periodSlots.length === 1 ? 'slot disponibil' : 'sloturi disponibile'}
                </p>
              </div>
            </div>

            {/* Time Slots Grid îmbunătățit */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
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
                      'h-auto p-4 flex flex-col items-center transition-all duration-300',
                      'hover:scale-105 hover:shadow-lg border-2',
                      'focus:ring-2 focus:ring-slate-500 focus:ring-offset-2',
                      isSelected
                        ? 'bg-gradient-to-r from-slate-600 to-slate-700 text-white border-slate-600 shadow-lg scale-105'
                        : 'hover:border-slate-300 hover:bg-stone-50',
                      disabled && 'hover:scale-100 opacity-50 cursor-not-allowed',
                    )}
                    onClick={() => onSlotSelect(slot)}
                  >
                    <div className="text-lg font-bold mb-1">{format(startTime, 'HH:mm', { locale: ro })}</div>
                    <div className="text-xs opacity-80">până la {format(endTime, 'HH:mm', { locale: ro })}</div>
                    {isSelected && <div className="mt-2 w-2 h-2 bg-white rounded-full"></div>}
                  </Button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Slot Info îmbunătățit */}
      {selectedSlot && (
        <div className="mt-8 p-6 bg-gradient-to-r from-stone-50 to-stone-100 rounded-xl border border-stone-200">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full text-white">
              <Clock className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-600 font-medium">Ora selectată:</p>
              <p className="text-xl font-bold text-slate-700">
                {format(new Date(selectedSlot.start), 'HH:mm', { locale: ro })} -{' '}
                {format(new Date(selectedSlot.end), 'HH:mm', { locale: ro })}
              </p>
              {date && (
                <p className="text-sm text-slate-500 mt-1">{format(date, 'EEEE, d MMMM yyyy', { locale: ro })}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-slate-600 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-slate-700">Confirmat</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
