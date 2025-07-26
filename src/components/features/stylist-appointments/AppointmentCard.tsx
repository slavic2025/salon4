// src/components/features/stylist-appointments/AppointmentCard.tsx

import { Calendar, Clock, Mail, Phone, User } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { AppointmentWithDetails } from '@/core/domains/appointments/appointment.types'

type AppointmentCardProps = {
  appointment: AppointmentWithDetails
  onStatusUpdate: (
    appointmentId: string,
    status: 'confirmed' | 'refused' | 'cancelled' | 'completed' | 'no_show',
  ) => void
  showActions: boolean
  isUpdating?: boolean
}

export function AppointmentCard({
  appointment,
  onStatusUpdate,
  showActions,
  isUpdating = false,
}: AppointmentCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ro-RO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('ro-RO', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'refused':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'no_show':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'În așteptare'
      case 'confirmed':
        return 'Confirmată'
      case 'completed':
        return 'Finalizată'
      case 'refused':
        return 'Refuzată'
      case 'cancelled':
        return 'Anulată'
      case 'no_show':
        return 'No-show'
      default:
        return status
    }
  }

  const isToday = () => {
    const appointmentDate = new Date(appointment.startTime)
    const today = new Date()
    return appointmentDate.toDateString() === today.toDateString()
  }

  const isPast = () => {
    const appointmentDate = new Date(appointment.startTime)
    const now = new Date()
    return appointmentDate < now
  }

  return (
    <Card
      className={`transition-all duration-200 hover:shadow-md ${
        isToday() ? 'ring-2 ring-blue-200 bg-blue-50/50' : ''
      } ${isPast() && appointment.status === 'confirmed' ? 'ring-2 ring-orange-200 bg-orange-50/50' : ''}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              {appointment.clientName}
            </CardTitle>
            <CardDescription className="mt-1">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-3 w-3" />
                {appointment.clientEmail}
              </div>
              <div className="flex items-center gap-2 text-sm mt-1">
                <Phone className="h-3 w-3" />
                {appointment.clientPhone}
              </div>
            </CardDescription>
          </div>
          <Badge className={`${getStatusColor(appointment.status)}`}>{getStatusLabel(appointment.status)}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Serviciu */}
        {appointment.service && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Serviciu:</span>
            <span className="text-sm text-muted-foreground">{appointment.service.name}</span>
          </div>
        )}

        {/* Preț */}
        {appointment.service && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Preț:</span>
            <span className="text-sm font-semibold text-green-600">{appointment.service.price} lei</span>
          </div>
        )}

        <hr className="border-t border-gray-200" />

        {/* Data și ora */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Data:</span>
            <span>{formatDate(appointment.startTime)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Ora:</span>
            <span>
              {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
            </span>
          </div>
        </div>

        {/* Note client */}
        {appointment.clientNotes && (
          <>
            <hr className="border-t border-gray-200" />
            <div>
              <span className="text-sm font-medium">Note:</span>
              <p className="text-sm text-muted-foreground mt-1">{appointment.clientNotes}</p>
            </div>
          </>
        )}

        {/* Acțiuni */}
        {showActions && (
          <>
            <hr className="border-t border-gray-200" />
            <div className="flex gap-2 pt-2">
              {appointment.status === 'waiting' && (
                <>
                  <Button
                    size="sm"
                    onClick={() => onStatusUpdate(appointment.id, 'confirmed')}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Se procesează...' : 'Acceptă'}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onStatusUpdate(appointment.id, 'refused')}
                    className="flex-1"
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Se procesează...' : 'Refuză'}
                  </Button>
                </>
              )}

              {appointment.status === 'confirmed' && (
                <>
                  <Button
                    size="sm"
                    onClick={() => onStatusUpdate(appointment.id, 'completed')}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Se procesează...' : 'Finalizează'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onStatusUpdate(appointment.id, 'cancelled')}
                    className="flex-1"
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Se procesează...' : 'Anulează'}
                  </Button>
                </>
              )}

              {appointment.status === 'confirmed' && isPast() && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onStatusUpdate(appointment.id, 'no_show')}
                  className="flex-1"
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Se procesează...' : 'No-show'}
                </Button>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
