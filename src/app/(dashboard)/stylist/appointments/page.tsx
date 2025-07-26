// src/app/(dashboard)/stylist/appointments/page.tsx

import { notFound } from 'next/navigation'

import { StylistAppointmentsPageContent } from '@/components/features/stylist-appointments/StylistAppointmentsPageContent'
import { STYLIST_DASHBOARD_MESSAGES } from '@/core/domains/stylists/stylist.constants'
import { getStylistAppointmentsWithDetailsAction } from '@/features/appointments/actions'
import { ROLES } from '@/lib/constants'
import { enforceRouteAccess } from '@/lib/route-protection'

/**
 * Pagina Server Component pentru gestionarea programărilor stilistului.
 * Permite stilistului să-și vadă programările și să gestioneze statusul lor.
 */
export default async function StylistAppointmentsPage() {
  // Verificare suplimentară la nivel de pagină (Defence in Depth)
  const { user, role } = await enforceRouteAccess('/stylist/appointments')

  // Double check - ar trebui să fie stylist
  if (role !== ROLES.STYLIST) {
    throw new Error('Acces neautorizat la gestionarea programărilor')
  }

  const stylistId = user.id

  // Obținem programările cu detalii pentru stilistul curent
  const appointmentsResponse = await getStylistAppointmentsWithDetailsAction(stylistId)

  if (!appointmentsResponse.data) {
    // Dacă nu putem încărca programările, afișăm pagina de not found
    return notFound()
  }

  const appointments = appointmentsResponse.data

  // Pasăm datele pure către componenta "dumb" de client
  return (
    <StylistAppointmentsPageContent
      appointments={appointments}
      stylistId={stylistId}
      pageTitle={STYLIST_DASHBOARD_MESSAGES.APPOINTMENTS.TITLE}
      pageDescription={STYLIST_DASHBOARD_MESSAGES.APPOINTMENTS.DESCRIPTION}
    />
  )
}
