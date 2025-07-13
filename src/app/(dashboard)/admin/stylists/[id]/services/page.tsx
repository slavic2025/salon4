import { notFound } from 'next/navigation'

import { StylistServicesPageContent } from '@/components/features/stylist-services/StylistServicesPageContent'
import { createServiceRepository } from '@/core/domains/services/service.repository'
import { createServiceService } from '@/core/domains/services/service.service'
import { createStylistServiceLinkRepository } from '@/core/domains/stylist-services/stylist-service.repository'
import { createStylistServiceLinkService } from '@/core/domains/stylist-services/stylist-service.service'
import { db } from '@/db'

interface PageProps {
  params: { id: string }
}

export default async function StylistServicesPage({ params }: PageProps) {
  const stylistId = params.id

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

  // TODO: Poți obține numele stilistului dacă vrei să-l afișezi în header
  const stylistName = ''

  return <StylistServicesPageContent services={servicesWithDetails} stylistId={stylistId} stylistName={stylistName} />
}
