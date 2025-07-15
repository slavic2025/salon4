import { ServicesPageContent } from '@/components/features/services/ServicesPageContent'
import { createServiceRepository } from '@/core/domains/services/service.repository'
import { createServiceService } from '@/core/domains/services/service.service'
import { db } from '@/db'
import { ROLES } from '@/lib/constants'
import { enforceRouteAccess } from '@/lib/route-protection'

/**
 * Pagina Server Component pentru afișarea serviciilor.
 * Responsabilitatea sa este să preia datele și să le delege componentei de UI.
 */
export default async function AdminServicesPage() {
  // Verificare suplimentară la nivel de pagină (Defence in Depth)
  const { role } = await enforceRouteAccess('/admin/services')

  // Double check - ar trebui să fie admin
  if (role !== ROLES.ADMIN) {
    throw new Error('Acces neautorizat la gestionarea serviciilor')
  }

  // Asamblăm dependențele: db -> repository -> service
  const serviceRepository = createServiceRepository(db)
  const serviceService = createServiceService(serviceRepository)

  // Apelăm serviciul pentru a obține datele
  const services = await serviceService.getAllServices()

  // Pasăm datele pure către componenta "dumb" de client
  return <ServicesPageContent services={services} />
}
