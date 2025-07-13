import { ServicesPageContent } from '@/components/features/services/ServicesPageContent'
import { createServiceRepository } from '@/core/domains/services/service.repository'
import { createServiceService } from '@/core/domains/services/service.service'
import { db } from '@/db'

/**
 * Pagina Server Component pentru afișarea serviciilor.
 * Responsabilitatea sa este să preia datele și să le delege componentei de UI.
 */
export default async function AdminServicesPage() {
  // Asamblăm dependențele: db -> repository -> service
  const serviceRepository = createServiceRepository(db)
  const serviceService = createServiceService(serviceRepository)

  // Apelăm serviciul pentru a obține datele
  const services = await serviceService.getAllServices()

  // Pasăm datele pure către componenta "dumb" de client
  return <ServicesPageContent services={services} />
}
