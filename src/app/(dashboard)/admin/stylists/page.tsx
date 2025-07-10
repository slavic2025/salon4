// src/app/(dashboard)/admin/stylists/page.tsx
import { StylistsPageContent } from '@/components/features/stylists/StylistsPageContent'
import { createStylistRepository } from '@/core/domains/stylists/stylist.repository'
import { createStylistService } from '@/core/domains/stylists/stylist.service'
import { db } from '@/db'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Pagina Server Component pentru afișarea stiliștilor.
 * Responsabilitatea sa este să preia datele și să le delege componentei de UI.
 */
export default async function AdminStylistsPage() {
  // Asamblăm dependențele: db -> repository -> service
  const stylistRepository = createStylistRepository(db)
  const supabaseAdmin = createAdminClient()
  const stylistService = createStylistService(stylistRepository, supabaseAdmin)

  // Apelăm serviciul pentru a obține datele
  const stylists = await stylistService.getAllStylists()

  // Pasăm datele pure către componenta "dumb" de client
  return <StylistsPageContent stylists={stylists} />
}
