// src/app/(dashboard)/admin/stylists/page.tsx
import { StylistsPageContent } from '@/components/features/stylists/StylistsPageContent'
import { createStylistRepository } from '@/core/domains/stylists/stylist.repository'
import { createStylistService } from '@/core/domains/stylists/stylist.sevice'
import { db } from '@/db'

/**
 * Pagina Server Component pentru afișarea stiliștilor.
 * Responsabilitatea sa este să preia datele și să le delege componentei de UI.
 */
export default async function AdminStylistsPage() {
  // Asamblăm dependențele: db -> repository -> service
  const stylistRepository = createStylistRepository(db)
  const stylistService = createStylistService(stylistRepository)

  // Apelăm serviciul pentru a obține datele
  const stylists = await stylistService.getAllStylists()

  // Pasăm datele pure către componenta "dumb" de client
  return <StylistsPageContent stylists={stylists} />
}
