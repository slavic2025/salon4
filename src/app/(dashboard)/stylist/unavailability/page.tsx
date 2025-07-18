// src/app/(dashboard)/stylist/unavailability/page.tsx

import { UnavailabilityPageContent } from '@/components/features/unavailability/UnavailabilityPageContent'
import { createUnavailabilityRepository } from '@/core/domains/unavailability/unavailability.repository'
import { createUnavailabilityService } from '@/core/domains/unavailability/unavailability.service'
import { db } from '@/db'
import { ROLES } from '@/lib/constants'
import { enforceRouteAccess } from '@/lib/route-protection'

/**
 * Pagina Server Component pentru gestionarea indisponibilităților stilistului.
 * Permite stilistului să-și adauge, editeze și șteargă intervalele de indisponibilitate.
 */
export default async function StylistUnavailabilityPage() {
  // Verificare suplimentară la nivel de pagină (Defence in Depth)
  const { user, role } = await enforceRouteAccess('/stylist/unavailability')

  // Double check - ar trebui să fie stylist
  if (role !== ROLES.STYLIST) {
    throw new Error('Acces neautorizat la gestionarea indisponibilităților')
  }

  // Asamblăm dependențele: db -> repository -> service
  const unavailabilityRepository = createUnavailabilityRepository(db)
  const unavailabilityService = createUnavailabilityService(unavailabilityRepository)

  // Obținem indisponibilitățile stilistului pentru următoarele 3 luni
  const today = new Date().toISOString().split('T')[0]
  const threeMonthsLater = new Date()
  threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3)
  const endDate = threeMonthsLater.toISOString().split('T')[0]

  const unavailabilities = await unavailabilityService.getUnavailabilitiesByStylist(user.id, today, endDate)

  // Pasăm datele pure către componenta "dumb" de client
  return <UnavailabilityPageContent unavailabilities={unavailabilities} stylistId={user.id} />
}
