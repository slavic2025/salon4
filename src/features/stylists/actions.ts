// src/features/stylists/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

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
 * Instanțiem serviciul o singură dată la nivel de modul.
 * Acest lucru este eficient și simplifică corpul acțiunilor.
 */
const stylistService = createStylistService(createStylistRepository(db), createAdminClient())

/**
 * Helper intern pentru a verifica dacă utilizatorul este admin.
 * Aruncă o eroare dacă nu este autorizat. Numele este mai explicit.
 * @private
 */
async function _ensureUserIsAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user?.app_metadata.role !== ROLES.ADMIN) {
    throw new Error('Not authorized')
  }
}

/**
 * FACTORY FUNCTION: Piesa centrală a refactorizării.
 * Creează o acțiune sigură care necesită privilegii de admin.
 * Încorporează validarea, autorizarea, execuția, gestionarea erorilor și revalidarea.
 *
 * @param schema - Schema Zod pentru validarea datelor de intrare.
 * @param actionLogic - Funcția care conține logica de business specifică.
 * @returns O Server Action completă și sigură.
 */
function createAdminStylistAction<T extends z.ZodType<any, any, any>>(
  schema: T,
  actionLogic: (payload: z.infer<T>) => Promise<any>,
) {
  return (payload: z.infer<T>) => {
    return executeSafeAction(schema, payload, async (validatedPayload) => {
      // 1. Securitatea este aplicată automat aici.
      await _ensureUserIsAdmin()

      try {
        // 2. Execuția logicii de business specifice.
        const result = await actionLogic(validatedPayload)

        // 3. Revalidarea căii este centralizată.
        revalidatePath(APP_ROUTES.ADMIN_STYLISTS_PAGE)

        return { data: result }
      } catch (error) {
        // 4. Gestionarea erorilor specifice domeniului este centralizată.
        if (error instanceof UniquenessError) {
          return {
            validationErrors: Object.fromEntries(error.fields.map((f) => [f.field, [f.message]])),
          }
        }
        // Orice altă eroare va fi prinsă de `executeSafeAction` și va returna o eroare de server.
        throw error
      }
    })
  }
}

// --- PUBLIC SERVER ACTIONS ---
// Definițiile sunt acum declarative, concise și ușor de citit.

export const createStylistAction = createAdminStylistAction(
  createStylistActionSchema,
  (payload: CreateStylistPayload) => stylistService.createStylist(payload),
)

export const updateStylistAction = createAdminStylistAction(
  updateStylistActionSchema,
  (payload: UpdateStylistPayload) => stylistService.updateStylist(payload),
)

export const deleteStylistAction = createAdminStylistAction(
  deleteStylistActionSchema,
  (payload: DeleteStylistPayload) => stylistService.deleteStylist(payload.id),
)
