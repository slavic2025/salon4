// src/features/stylists/actions.ts
'use server'

import { revalidatePath } from 'next/cache'

import { createStylistRepository } from '@/core/domains/stylists/stylist.repository'
import { createStylistService } from '@/core/domains/stylists/stylist.sevice'
import {
  createStylistActionSchema,
  type CreateStylistPayload,
  deleteStylistActionSchema,
  type DeleteStylistPayload,
  updateStylistActionSchema,
  type UpdateStylistPayload,
} from '@/core/domains/stylists/stylist.types'
import { db } from '@/db'
import { APP_ROUTES, ROLES } from '@/lib/constants'
import { UniquenessError } from '@/lib/errors'
import { executeSafeAction } from '@/lib/safe-action'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

/**
 * Funcție ajutătoare care asamblează serviciul de stiliști.
 * Nu mai face verificarea de securitate aici; aceasta va fi delegată.
 */
function getStylistService() {
  const stylistRepository = createStylistRepository(db)
  const supabaseAdmin = createAdminClient()
  return createStylistService(stylistRepository, supabaseAdmin)
}

/**
 * Helper intern pentru a verifica dacă utilizatorul este admin.
 * Aruncă o eroare dacă nu este autorizat.
 */
async function ensureAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user?.app_metadata.role !== ROLES.ADMIN) {
    throw new Error('Not authorized')
  }
}

// --- Acțiunile Noastre, Acum Funcții Standard ---

export async function createStylistAction(payload: CreateStylistPayload) {
  // Apelăm helper-ul cu schema, datele primite și logica de business
  return executeSafeAction(createStylistActionSchema, payload, async (validatedPayload) => {
    await ensureAdmin() // Verificarea de securitate se face aici, în interior.
    const stylistService = getStylistService()

    try {
      const result = await stylistService.createStylist(validatedPayload)
      revalidatePath(APP_ROUTES.ADMIN_STYLISTS_PAGE)
      return { data: result }
    } catch (error) {
      if (error instanceof UniquenessError) {
        return { validationErrors: Object.fromEntries(error.fields.map((f) => [f.field, [f.message]])) }
      }
      // Orice altă eroare va fi prinsă de wrapper-ul `executeSafeAction`
      throw error
    }
  })
}

export async function updateStylistAction(payload: UpdateStylistPayload) {
  return executeSafeAction(updateStylistActionSchema, payload, async (validatedPayload) => {
    await ensureAdmin()
    const stylistService = getStylistService()

    try {
      const result = await stylistService.updateStylist(validatedPayload)
      revalidatePath(APP_ROUTES.ADMIN_STYLISTS_PAGE)
      return { data: result }
    } catch (error) {
      if (error instanceof UniquenessError) {
        return { validationErrors: Object.fromEntries(error.fields.map((f) => [f.field, [f.message]])) }
      }
      throw error
    }
  })
}

export async function deleteStylistAction(payload: DeleteStylistPayload) {
  return executeSafeAction(deleteStylistActionSchema, payload, async ({ id }) => {
    await ensureAdmin()
    const stylistService = getStylistService()

    const result = await stylistService.deleteStylist(id)
    revalidatePath(APP_ROUTES.ADMIN_STYLISTS_PAGE)

    return { data: result }
  })
}
