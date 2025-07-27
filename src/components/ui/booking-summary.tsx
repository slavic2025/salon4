'use client'

import { format } from 'date-fns'
import { ro } from 'date-fns/locale'
import { Calendar, Clock, Scissors, User } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useBookingStore } from '@/stores/booking-store'

interface BookingSummaryProps {
  className?: string
  showTitle?: boolean
}

export function BookingSummary({ className, showTitle = true }: BookingSummaryProps) {
  const { service, stylist, slot, clientData } = useBookingStore()
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  if (!service || !isHydrated) {
    return null
  }

  return (
    <Card className={cn('sticky top-4 lg:top-6', className)}>
      {showTitle && (
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-medium text-slate-900 flex items-center space-x-2">
            <Scissors className="w-4 h-4 text-slate-500" />
            <span>Rezumatul programării</span>
          </CardTitle>
        </CardHeader>
      )}

      <CardContent className="space-y-6">
        {/* Serviciu */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-slate-900">{service.name}</h3>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">{service.duration} minute</span>
            <span className="font-semibold text-slate-900">{service.price} lei</span>
          </div>
        </div>

        {/* Data și ora */}
        {slot && (
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <h3 className="text-sm font-medium text-slate-900 flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>Data și ora</span>
            </h3>
            <div className="space-y-1">
              <p className="text-sm text-slate-600">
                {format(new Date(slot.start), 'EEEE, d MMMM yyyy', { locale: ro })}
              </p>
              <p className="text-sm font-medium text-slate-900 flex items-center space-x-1">
                <Clock className="w-3 h-3 text-slate-500" />
                <span>
                  {format(new Date(slot.start), 'HH:mm', { locale: ro })} -{' '}
                  {format(new Date(slot.end), 'HH:mm', { locale: ro })}
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Stilist */}
        {stylist && (
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <h3 className="text-sm font-medium text-slate-900 flex items-center space-x-2">
              <User className="w-4 h-4 text-slate-500" />
              <span>Stilist</span>
            </h3>
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-900">{stylist.fullName}</p>
            </div>
          </div>
        )}

        {/* Datele clientului */}
        {clientData && (
          <div className="space-y-3 border-t border-slate-100 pt-4">
            <h3 className="text-sm font-medium text-slate-900">Datele dvs.</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Nume</span>
                <span className="font-medium text-slate-900">{clientData.clientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Telefon</span>
                <span className="font-medium text-slate-900">{clientData.clientPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Email</span>
                <span className="font-medium text-slate-900 break-all">{clientData.clientEmail}</span>
              </div>
              {clientData.clientNotes && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-600 text-sm">Note</span>
                  <p className="text-sm mt-1 text-slate-900">{clientData.clientNotes}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Total */}
        <div className="border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-900">Total</span>
            <span className="text-lg font-bold text-slate-900">{service.price} lei</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Plata se efectuează la salon</p>
        </div>
      </CardContent>
    </Card>
  )
}
