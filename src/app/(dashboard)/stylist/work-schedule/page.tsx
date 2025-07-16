// src/app/(dashboard)/stylist/work-schedule/page.tsx

import { WorkSchedulePageContent } from '@/components/features/work-schedule/WorkSchedulePageContent'
import { createWorkScheduleRepository } from '@/core/domains/work-schedule/workSchedule.repository'
import { createWorkScheduleService } from '@/core/domains/work-schedule/workSchedule.service'
import { db } from '@/db'
import { ROLES } from '@/lib/constants'
import { enforceRouteAccess } from '@/lib/route-protection'

/**
 * Pagina Server Component pentru gestionarea programului de lucru al stilistului.
 * Permite stilistului să-și adauge, editeze și șteargă intervalele de lucru.
 */
export default async function StylistWorkSchedulePage() {
  // Verificare suplimentară la nivel de pagină (Defence in Depth)
  const { user, role } = await enforceRouteAccess('/stylist/work-schedule')

  // Double check - ar trebui să fie stylist
  if (role !== ROLES.STYLIST) {
    throw new Error('Acces neautorizat la gestionarea programului de lucru')
  }

  // Asamblăm dependențele: db -> repository -> service
  const workScheduleRepository = createWorkScheduleRepository(db)
  const workScheduleService = createWorkScheduleService(workScheduleRepository)

  // Apelăm serviciul pentru a obține programul stilistului
  const stylistSchedule = await workScheduleService.getStylistSchedule(user.id)

  // Pasăm datele pure către componenta "dumb" de client
  return <WorkSchedulePageContent stylistSchedule={stylistSchedule} />
}
