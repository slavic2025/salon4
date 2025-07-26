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
      backgroundColor: 'hsl(var(--primary))',
      color: 'white',
      fontWeight: 'bold',
    },
    available: {
      backgroundColor: 'hsl(var(--primary) / 0.1)',
      color: 'hsl(var(--primary))',
      fontWeight: '500',
    },
    today: {
      fontWeight: 'bold',
      textDecoration: 'underline',
    },
  }

  return (
    <div className={cn('bg-white rounded-lg border shadow-sm p-4', className)}>
      {/* Header */}
      <div className="flex items-center space-x-2 mb-4">
        <CalendarIcon className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-gray-900">Selectează data</h3>
      </div>

      {/* Calendar */}
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
            caption: 'flex justify-center pt-1 relative items-center mb-4',
            caption_label: 'text-sm font-medium',
            nav: 'space-x-1 flex items-center',
            nav_button: cn(
              'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
              'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
            ),
            nav_button_previous: 'absolute left-1',
            nav_button_next: 'absolute right-1',
            table: 'w-full border-collapse space-y-1',
            head_row: '',
            head_cell: '',
            row: '',
            cell: '',
            day: '',
            day_selected: '',
            day_today: '',
            day_outside: '',
            day_disabled: '',
            day_range_middle: '',
            day_hidden: '',
          }}
          // Custom navigation icons removed due to type issues
        />
      </div>

      {/* Info Section */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="space-y-2 text-sm">
          {selectedDate && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Data selectată:</span>
              <span className="font-medium text-primary">
                {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: ro })}
              </span>
            </div>
          )}

          {availableDates.length > 0 && (
            <div className="text-xs text-muted-foreground">
              <span className="inline-block w-3 h-3 bg-primary/10 rounded mr-2"></span>
              Zilele evidențiate au sloturi disponibile
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
