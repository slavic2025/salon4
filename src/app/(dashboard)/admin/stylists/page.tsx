// src/app/(dashboard)/admin/stylists/page.tsx
import { StylistsPageContent } from '@/components/features/stylists/StylistsPageContent'
import { createStylistRepository } from '@/core/domains/stylists/stylist.repository'
import { createStylistService } from '@/core/domains/stylists/stylist.service'
import { db } from '@/db'
import { ROLES } from '@/lib/constants'
import { enforceRouteAccess } from '@/lib/route-protection'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Pagina Server Component pentru afișarea stiliștilor.
 * Responsabilitatea sa este să preia datele și să le delege componentei de UI.
 */
export default async function AdminStylistsPage() {
  // Verificare suplimentară la nivel de pagină (Defence in Depth)
  const { role } = await enforceRouteAccess('/admin/stylists')

  // Double check - ar trebui să fie admin
  if (role !== ROLES.ADMIN) {
    throw new Error('Acces neautorizat la gestionarea stiliștilor')
  }

  // Asamblăm dependențele: db -> repository -> service
  const stylistRepository = createStylistRepository(db)
  const supabaseAdmin = createAdminClient()
  const stylistService = createStylistService(stylistRepository, supabaseAdmin)

  // Apelăm serviciul pentru a obține datele
  const stylists = await stylistService.getAllStylists()

  // Pasăm datele pure către componenta "dumb" de client
  return <StylistsPageContent stylists={stylists} />
}
