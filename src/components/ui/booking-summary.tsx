'use client'

import { format } from 'date-fns'
import { ro } from 'date-fns/locale'
import { Calendar, Clock, Scissors, User } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getServiceIcon } from '@/lib/service-icons'
import { cn } from '@/lib/utils'
import { useBookingStore } from '@/stores/booking-store'

interface BookingSummaryProps {
  className?: string
  showTitle?: boolean
}

export function BookingSummary({ className, showTitle = true }: BookingSummaryProps) {
  const { service, stylist, slot, clientData } = useBookingStore()
  const [isHydrated, setIsHydrated] = useState(false)

  // Detectăm când componenta este hidratată
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Nu afișa componenta dacă nu avem date să afișăm sau dacă nu suntem hidratați
  if (!service || !isHydrated) {
    return null
  }

  return (
    <Card className={cn('sticky top-6', className)}>
      {showTitle && (
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold flex items-center space-x-2">
            <Scissors className="w-5 h-5 text-primary" />
            <span>Rezumatul programării</span>
          </CardTitle>
        </CardHeader>
      )}

      <CardContent className="space-y-4">
        {/* Serviciu */}
        <div className="flex items-start space-x-3 p-3 bg-primary/5 rounded-lg">
          <div className="p-2 bg-primary/10 rounded-full text-primary">{getServiceIcon(service.name)}</div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">{service.name}</p>
            {service.description && <p className="text-sm text-muted-foreground mt-1">{service.description}</p>}
            <div className="flex items-center justify-between mt-2 text-sm">
              <span className="text-muted-foreground">Durată: {service.duration} min</span>
              <span className="font-semibold text-primary">{service.price} lei</span>
            </div>
          </div>
        </div>

        {/* Data și ora */}
        {slot && (
          <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
            <div className="p-2 bg-blue-100 rounded-full text-blue-600">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Data și ora</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(slot.start), 'EEEE, d MMMM yyyy', { locale: ro })}
              </p>
              <div className="flex items-center space-x-1 mt-1">
                <Clock className="w-3 h-3 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">
                  {format(new Date(slot.start), 'HH:mm', { locale: ro })} -{' '}
                  {format(new Date(slot.end), 'HH:mm', { locale: ro })}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Stilist */}
        {stylist && (
          <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
            <div className="p-2 bg-green-100 rounded-full text-green-600">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Stilist</p>
              <p className="text-sm font-semibold text-green-700">{stylist.fullName}</p>
              {stylist.description && <p className="text-xs text-muted-foreground mt-1">{stylist.description}</p>}
            </div>
          </div>
        )}

        {/* Datele clientului */}
        {clientData && (
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-3">Datele dvs.</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nume:</span>
                <span className="font-medium">{clientData.clientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Telefon:</span>
                <span className="font-medium">{clientData.clientPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{clientData.clientEmail}</span>
              </div>
              {clientData.clientNotes && (
                <div className="pt-2 border-t">
                  <span className="text-muted-foreground text-xs">Note:</span>
                  <p className="text-sm mt-1">{clientData.clientNotes}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Total */}
        {service && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900">Total:</span>
              <span className="text-xl font-bold text-primary">{service.price} lei</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">* Plata se efectuează la salon</p>
          </div>
        )}

        {/* Progress indicator simplu */}
        <div className="border-t pt-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${service ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span className="text-sm text-muted-foreground">Serviciu selectat</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${slot ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span className="text-sm text-muted-foreground">Data și ora alese</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${stylist ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span className="text-sm text-muted-foreground">Stilist selectat</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${clientData ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span className="text-sm text-muted-foreground">Date personale</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
