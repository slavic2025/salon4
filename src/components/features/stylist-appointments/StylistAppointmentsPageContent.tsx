// src/components/features/stylist-appointments/StylistAppointmentsPageContent.tsx
'use client'

import { AlertCircle, Calendar, CalendarX, CheckCircle, XCircle } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { AppointmentWithDetails } from '@/core/domains/appointments/appointment.types'
import { updateStylistAppointmentStatusAction } from '@/features/appointments/actions'

import { AppointmentCard } from './AppointmentCard'
import { AppointmentFilters } from './AppointmentFilters'
import { AppointmentStats } from './AppointmentStats'

type StylistAppointmentsPageContentProps = {
  appointments: AppointmentWithDetails[]
  stylistId: string
  pageTitle: string
  pageDescription: string
}

export function StylistAppointmentsPageContent({
  appointments,
  stylistId,
  pageTitle,
  pageDescription,
}: StylistAppointmentsPageContentProps) {
  const [filters, setFilters] = useState({
    status: 'all' as 'all' | 'waiting' | 'confirmed' | 'refused' | 'cancelled' | 'completed' | 'no_show',
    dateRange: 'all' as 'all' | 'today' | 'week' | 'month',
    search: '',
  })

  // Grupăm programările după status și dată
  const groupedAppointments = useMemo(() => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const weekFromNow = new Date(today)
    weekFromNow.setDate(weekFromNow.getDate() + 7)
    const monthFromNow = new Date(today)
    monthFromNow.setMonth(monthFromNow.getMonth() + 1)

    // Filtrare după date range
    let filteredByDate = appointments
    if (filters.dateRange === 'today') {
      filteredByDate = appointments.filter((apt) => {
        const aptDate = new Date(apt.startTime)
        return aptDate >= today && aptDate < tomorrow
      })
    } else if (filters.dateRange === 'week') {
      filteredByDate = appointments.filter((apt) => {
        const aptDate = new Date(apt.startTime)
        return aptDate >= today && aptDate < weekFromNow
      })
    } else if (filters.dateRange === 'month') {
      filteredByDate = appointments.filter((apt) => {
        const aptDate = new Date(apt.startTime)
        return aptDate >= today && aptDate < monthFromNow
      })
    }

    // Filtrare după status
    let filteredByStatus = filteredByDate
    if (filters.status !== 'all') {
      filteredByStatus = filteredByDate.filter((apt) => apt.status === filters.status)
    }

    // Filtrare după căutare
    let filteredBySearch = filteredByStatus
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filteredBySearch = filteredByStatus.filter(
        (apt) =>
          apt.clientName.toLowerCase().includes(searchLower) ||
          apt.clientEmail.toLowerCase().includes(searchLower) ||
          apt.service?.name.toLowerCase().includes(searchLower) ||
          apt.clientPhone.includes(searchLower),
      )
    }

    // Grupăm programările
    const waiting = filteredBySearch.filter((apt) => apt.status === 'waiting')
    const confirmed = filteredBySearch.filter((apt) => apt.status === 'confirmed')
    const completed = filteredBySearch.filter((apt) => apt.status === 'completed')
    const refused = filteredBySearch.filter((apt) => apt.status === 'refused')
    const cancelled = filteredBySearch.filter((apt) => apt.status === 'cancelled')
    const noShow = filteredBySearch.filter((apt) => apt.status === 'no_show')

    // Sortăm programările după dată (cele mai apropiate primele)
    const sortByDate = (a: AppointmentWithDetails, b: AppointmentWithDetails) =>
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()

    return {
      waiting: waiting.sort(sortByDate),
      confirmed: confirmed.sort(sortByDate),
      completed: completed.sort(sortByDate),
      refused: refused.sort(sortByDate),
      cancelled: cancelled.sort(sortByDate),
      noShow: noShow.sort(sortByDate),
    }
  }, [appointments, filters])

  // Handler pentru actualizarea statusului
  const handleStatusUpdate = async (
    appointmentId: string,
    newStatus: 'confirmed' | 'refused' | 'cancelled' | 'completed' | 'no_show',
  ) => {
    try {
      const result = await updateStylistAppointmentStatusAction({
        id: appointmentId,
        status: newStatus,
      })

      if (result.data) {
        toast.success('Statusul programării a fost actualizat cu succes')
        // Reîncărcăm pagina pentru a reflecta schimbările
        window.location.reload()
      } else {
        toast.error(result.serverError || 'Eroare la actualizarea statusului')
      }
    } catch (error) {
      toast.error('Eroare la actualizarea statusului programării')
      console.error('Error updating appointment status:', error)
    }
  }

  // Calculăm statisticile
  const stats = useMemo(() => {
    const total = appointments.length
    const waiting = appointments.filter((apt) => apt.status === 'waiting').length
    const confirmed = appointments.filter((apt) => apt.status === 'confirmed').length
    const completed = appointments.filter((apt) => apt.status === 'completed').length
    const today = appointments.filter((apt) => {
      const aptDate = new Date(apt.startTime)
      const today = new Date()
      return aptDate.toDateString() === today.toDateString()
    }).length

    return { total, waiting, confirmed, completed, today }
  }, [appointments])

  return (
    <div className="space-y-6">
      {/* Header cu statistici */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{pageTitle}</h1>
          <p className="text-muted-foreground">{pageDescription}</p>
        </div>
      </div>

      {/* Statistici */}
      <AppointmentStats stats={stats} />

      {/* Filtre */}
      <AppointmentFilters filters={filters} onFiltersChange={setFilters} />

      {/* Programări care așteaptă acțiuni */}
      {groupedAppointments.waiting.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            <h2 className="text-lg font-semibold">Programări care așteaptă acțiuni</h2>
            <Badge variant="secondary" className="ml-2">
              {groupedAppointments.waiting.length}
            </Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {groupedAppointments.waiting.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onStatusUpdate={handleStatusUpdate}
                showActions={true}
              />
            ))}
          </div>
          <hr className="border-t border-gray-200 my-6" />
        </div>
      )}

      {/* Programările de astăzi */}
      {groupedAppointments.confirmed.filter((apt) => {
        const aptDate = new Date(apt.startTime)
        const today = new Date()
        return aptDate.toDateString() === today.toDateString()
      }).length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold">Programările de astăzi</h2>
            <Badge variant="secondary" className="ml-2">
              {
                groupedAppointments.confirmed.filter((apt) => {
                  const aptDate = new Date(apt.startTime)
                  const today = new Date()
                  return aptDate.toDateString() === today.toDateString()
                }).length
              }
            </Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {groupedAppointments.confirmed
              .filter((apt) => {
                const aptDate = new Date(apt.startTime)
                const today = new Date()
                return aptDate.toDateString() === today.toDateString()
              })
              .map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onStatusUpdate={handleStatusUpdate}
                  showActions={true}
                />
              ))}
          </div>
          <hr className="border-t border-gray-200 my-6" />
        </div>
      )}

      {/* Programările confirmate (viitoare) */}
      {groupedAppointments.confirmed.filter((apt) => {
        const aptDate = new Date(apt.startTime)
        const today = new Date()
        return aptDate.toDateString() !== today.toDateString()
      }).length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <h2 className="text-lg font-semibold">Programări confirmate</h2>
            <Badge variant="secondary" className="ml-2">
              {
                groupedAppointments.confirmed.filter((apt) => {
                  const aptDate = new Date(apt.startTime)
                  const today = new Date()
                  return aptDate.toDateString() !== today.toDateString()
                }).length
              }
            </Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {groupedAppointments.confirmed
              .filter((apt) => {
                const aptDate = new Date(apt.startTime)
                const today = new Date()
                return aptDate.toDateString() !== today.toDateString()
              })
              .map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onStatusUpdate={handleStatusUpdate}
                  showActions={true}
                />
              ))}
          </div>
          <hr className="border-t border-gray-200 my-6" />
        </div>
      )}

      {/* Programări finalizate */}
      {groupedAppointments.completed.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-semibold">Programări finalizate</h2>
            <Badge variant="secondary" className="ml-2">
              {groupedAppointments.completed.length}
            </Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {groupedAppointments.completed.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onStatusUpdate={handleStatusUpdate}
                showActions={false}
              />
            ))}
          </div>
          <hr className="border-t border-gray-200 my-6" />
        </div>
      )}

      {/* Programări anulate/refuzate */}
      {(groupedAppointments.refused.length > 0 ||
        groupedAppointments.cancelled.length > 0 ||
        groupedAppointments.noShow.length > 0) && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-500" />
            <h2 className="text-lg font-semibold">Programări anulate/refuzate</h2>
            <Badge variant="secondary" className="ml-2">
              {groupedAppointments.refused.length +
                groupedAppointments.cancelled.length +
                groupedAppointments.noShow.length}
            </Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...groupedAppointments.refused, ...groupedAppointments.cancelled, ...groupedAppointments.noShow].map(
              (appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onStatusUpdate={handleStatusUpdate}
                  showActions={false}
                />
              ),
            )}
          </div>
        </div>
      )}

      {/* Mesaj când nu sunt programări */}
      {Object.values(groupedAppointments).every((group) => group.length === 0) && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CalendarX className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nu sunt programări</h3>
            <p className="text-muted-foreground text-center">
              Nu există programări care să corespundă filtrelor selectate.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
