import { notFound } from 'next/navigation'

import { StylistOwnServicesPageContent } from '@/components/features/stylist-services/StylistOwnServicesPageContent'
import { createServiceRepository } from '@/core/domains/services/service.repository'
import { createServiceService } from '@/core/domains/services/service.service'
import { STYLIST_SERVICE_LINK_MESSAGES } from '@/core/domains/stylist-services/stylist-service.constants'
import { createStylistServiceLinkRepository } from '@/core/domains/stylist-services/stylist-service.repository'
import { createStylistServiceLinkService } from '@/core/domains/stylist-services/stylist-service.service'
import { db } from '@/db'
import { ROLES } from '@/lib/constants'
import { enforceRouteAccess } from '@/lib/route-protection'

export default async function StylistServicesPage() {
  // Verificare suplimentară la nivel de pagină (Defence in Depth)
  const { user, role } = await enforceRouteAccess('/stylist/services')

  // Double check - ar trebui să fie stylist
  if (role !== ROLES.STYLIST) {
    throw new Error(STYLIST_SERVICE_LINK_MESSAGES.ERROR.UNAUTHORIZED_ACCESS)
  }

  const stylistId = user.id

  // Asamblăm dependențele: db -> repository -> service
  const serviceRepository = createServiceRepository(db)
  const serviceService = createServiceService(serviceRepository)
  const stylistServiceLinkRepository = createStylistServiceLinkRepository(db)
  const stylistServiceLinkService = createStylistServiceLinkService(stylistServiceLinkRepository)

  // Obținem toate serviciile disponibile
  const allServices = await serviceService.getAllServices()
  // Obținem legăturile pentru stilistul curent
  const stylistLinks = await stylistServiceLinkService.getLinksByStylistId(stylistId)

  if (!allServices) return notFound()

  // Combinăm datele pentru a obține un array de StylistServiceLinkWithService
  const servicesWithDetails = stylistLinks
    .map((link) => ({
      ...link,
      service: allServices.find((s) => s.id === link.serviceId)!,
    }))
    .filter((link) => link.service)

  return <StylistOwnServicesPageContent services={servicesWithDetails} stylistId={stylistId} />
}
