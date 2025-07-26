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
    <Card className={cn('sticky top-4 lg:top-6', className)}>
      {showTitle && (
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center space-x-2">
            <Scissors className="w-4 h-4 text-purple-600" />
            <span>Rezumatul programării</span>
          </CardTitle>
        </CardHeader>
      )}

      <CardContent className="space-y-3">
        {/* Serviciu */}
        <div className="flex items-start space-x-2 p-2.5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
          <div className="p-1.5 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg text-purple-600 flex-shrink-0">
            {getServiceIcon(service.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 text-sm">{service.name}</p>
            <div className="flex items-center justify-between mt-1.5 text-xs">
              <span className="text-muted-foreground">Durată: {service.duration} min</span>
              <span className="font-semibold text-purple-600">{service.price} lei</span>
            </div>
          </div>
        </div>

        {/* Data și ora */}
        {slot && (
          <div className="flex items-start space-x-2 p-2.5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <div className="p-1.5 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg text-blue-600 flex-shrink-0">
              <Calendar className="w-3 h-3" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-sm">Data și ora</p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(slot.start), 'EEEE, d MMMM yyyy', { locale: ro })}
              </p>
              <div className="flex items-center space-x-1 mt-1">
                <Clock className="w-3 h-3 text-blue-600" />
                <span className="text-xs font-medium text-blue-700">
                  {format(new Date(slot.start), 'HH:mm', { locale: ro })} -{' '}
                  {format(new Date(slot.end), 'HH:mm', { locale: ro })}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Stilist */}
        {stylist && (
          <div className="flex items-start space-x-2 p-2.5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
            <div className="p-1.5 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg text-green-600 flex-shrink-0">
              <User className="w-3 h-3" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-sm">Stilist</p>
              <p className="text-sm font-semibold text-green-700">{stylist.fullName}</p>
              {stylist.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{stylist.description}</p>
              )}
            </div>
          </div>
        )}

        {/* Datele clientului */}
        {clientData && (
          <div className="border-t pt-3">
            <h4 className="font-medium text-gray-900 mb-2 text-sm">Datele dvs.</h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex flex-col sm:flex-row sm:justify-between space-y-0.5 sm:space-y-0">
                <span className="text-muted-foreground">Nume:</span>
                <span className="font-medium break-words">{clientData.clientName}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between space-y-0.5 sm:space-y-0">
                <span className="text-muted-foreground">Telefon:</span>
                <span className="font-medium">{clientData.clientPhone}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between space-y-0.5 sm:space-y-0">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium break-all">{clientData.clientEmail}</span>
              </div>
              {clientData.clientNotes && (
                <div className="pt-1.5 border-t">
                  <span className="text-muted-foreground text-xs">Note:</span>
                  <p className="text-xs mt-1 break-words">{clientData.clientNotes}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Total */}
        {service && (
          <div className="border-t pt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">Total:</span>
              <span className="text-lg font-bold text-purple-600">{service.price} lei</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">* Plata se efectuează la salon</p>
          </div>
        )}

        {/* Progress indicator simplu și compact */}
        <div className="border-t pt-3">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <div className={`w-1.5 h-1.5 rounded-full ${service ? 'bg-purple-500' : 'bg-gray-300'}`} />
              <span className="text-xs text-muted-foreground">Serviciu selectat</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-1.5 h-1.5 rounded-full ${slot ? 'bg-purple-500' : 'bg-gray-300'}`} />
              <span className="text-xs text-muted-foreground">Data și ora alese</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-1.5 h-1.5 rounded-full ${stylist ? 'bg-purple-500' : 'bg-gray-300'}`} />
              <span className="text-xs text-muted-foreground">Stilist selectat</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-1.5 h-1.5 rounded-full ${clientData ? 'bg-purple-500' : 'bg-gray-300'}`} />
              <span className="text-xs text-muted-foreground">Date personale</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
