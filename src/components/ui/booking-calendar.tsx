'use client'

import 'react-day-picker/style.css'

import { format, isAfter, isBefore, startOfDay } from 'date-fns'
import { ro } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'
import { DayPicker } from 'react-day-picker'

import { cn } from '@/lib/utils'

interface BookingCalendarProps {
  selectedDate?: Date
  availableDates?: Date[]
  onDateSelect: (date: Date) => void
  className?: string
  disabled?: boolean
  maxDate?: Date
}

export function BookingCalendar({
  selectedDate,
  availableDates = [],
  onDateSelect,
  className,
  disabled = false,
  maxDate,
}: BookingCalendarProps) {
  const today = startOfDay(new Date())

  // Determină datele care sunt dezactivate
  const disabledDays = (date: Date) => {
    const dayStart = startOfDay(date)

    // Dezactivează zilele din trecut
    if (isBefore(dayStart, today)) return true

    // Dezactivează zilele după maxDate
    if (maxDate && isAfter(dayStart, maxDate)) return true

    // Dezactivează zilele care nu sunt în availableDates (dacă sunt specificate)
    if (availableDates.length > 0) {
      return !availableDates.some((availableDate) => startOfDay(availableDate).getTime() === dayStart.getTime())
    }

    return false
  }

  // Stiluri pentru zilele disponibile
  const modifiers = {
    selected: selectedDate ? [selectedDate] : [],
    available: availableDates,
    today: [today],
  }

  const modifiersStyles = {
    selected: {
      backgroundColor: 'hsl(45, 93%, 47%)', // slate-600
      color: 'white',
      fontWeight: 'bold',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(217, 119, 6, 0.3)',
    },
    available: {
      backgroundColor: 'hsl(45, 93%, 95%)', // slate-50
      color: 'hsl(45, 93%, 47%)', // slate-600
      fontWeight: '600',
      borderRadius: '8px',
    },
    today: {
      fontWeight: 'bold',
      backgroundColor: 'hsl(45, 93%, 90%)', // slate-100
      color: 'hsl(45, 93%, 47%)', // slate-600
      borderRadius: '8px',
      border: '2px solid hsl(45, 93%, 47%)', // slate-600
    },
  }

  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-stone-200 shadow-lg p-6 hover:shadow-xl transition-all duration-300',
        className,
      )}
    >
      {/* Header îmbunătățit */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-stone-100 to-stone-200 rounded-lg">
          <CalendarIcon className="w-5 h-5 text-slate-600" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-lg">Selectează data</h3>
          <p className="text-sm text-slate-500">Alege ziua potrivită pentru programare</p>
        </div>
      </div>

      {/* Calendar cu stilizare îmbunătățită */}
      <div className="relative">
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && onDateSelect(date)}
          disabled={disabled ? true : disabledDays}
          locale={ro}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          showOutsideDays={false}
          className="rdp-custom"
          classNames={{
            months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
            month: 'space-y-4',
            caption: 'flex justify-center pt-1 relative items-center mb-6',
            caption_label: 'text-lg font-bold text-slate-900',
            nav: 'space-x-1 flex items-center',
            nav_button: cn(
              'inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200',
              'h-10 w-10 bg-stone-100 hover:bg-slate-100 p-0 opacity-70 hover:opacity-100',
              'hover:scale-105 hover:shadow-md',
            ),
            nav_button_previous: 'absolute left-1',
            nav_button_next: 'absolute right-1',
            table: 'w-full border-collapse space-y-2',
            head_row: 'flex mb-2',
            head_cell: 'text-slate-500 font-semibold text-sm w-10 h-10 flex items-center justify-center',
            row: 'flex w-full mt-2',
            cell: 'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 w-10 h-10',
            day: cn(
              'h-10 w-10 p-0 font-normal aria-selected:opacity-100',
              'hover:bg-slate-100 hover:text-slate-700 hover:scale-110 transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2',
            ),
            day_selected: 'bg-slate-600 text-white hover:bg-slate-700 hover:text-white',
            day_today: 'bg-slate-100 text-slate-700 font-bold',
            day_outside: 'text-slate-400 opacity-50',
            day_disabled: 'text-slate-300 opacity-30 cursor-not-allowed hover:bg-transparent hover:scale-100',
            day_range_middle: 'aria-selected:bg-slate-100 aria-selected:text-slate-700',
            day_hidden: 'invisible',
          }}
        />
      </div>

      {/* Info Section îmbunătățită */}
      <div className="mt-6 p-4 bg-gradient-to-r from-stone-50 to-stone-100 rounded-xl border border-stone-200">
        <div className="space-y-3">
          {selectedDate && (
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-stone-200">
              <span className="text-slate-600 font-medium">Data selectată:</span>
              <span className="font-bold text-slate-700">
                {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: ro })}
              </span>
            </div>
          )}

          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
              <span className="text-slate-700">Data selectată</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-slate-200 rounded-full"></div>
              <span className="text-slate-700">Disponibil</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
              <span className="text-slate-700">Indisponibil</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
