// src/features/stylists/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { createStylistRepository } from '@/core/domains/stylists/stylist.repository'
import { createStylistService } from '@/core/domains/stylists/stylist.service'
import {
  createStylistActionSchema,
  type CreateStylistPayload,
  deleteStylistActionSchema,
  type DeleteStylistPayload,
  updateStylistActionSchema,
  type UpdateStylistPayload,
} from '@/core/domains/stylists/stylist.types'
import { db } from '@/db'
import { APP_ROUTES } from '@/lib/constants'
import { UniquenessError } from '@/lib/errors'
import { createLogger } from '@/lib/logger'
import { ensureUserIsAdmin } from '@/lib/route-protection'
import { executeSafeAction } from '@/lib/safe-action'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Logger pentru domeniul stylists
 */
const logger = createLogger('stylists')

/**
 * Instanțiem serviciul o singură dată la nivel de modul.
 * Acest lucru este eficient și simplifică corpul acțiunilor.
 */
const stylistService = createStylistService(createStylistRepository(db), createAdminClient())

/**
 * Helper intern pentru a verifica dacă utilizatorul este admin.
 * Folosește noile utilitare centralizate pentru verificarea rolurilor.
 * @private
 */
async function _ensureUserIsAdmin() {
  // Folosim utilitarul centralizat pentru verificarea rolului
  await ensureUserIsAdmin()
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
      await _ensureUserIsAdmin()

      try {
        const result = await actionLogic(validatedPayload)
        revalidatePath(APP_ROUTES.ADMIN_STYLISTS_PAGE)
        logger.info('Acțiune stylist executată cu succes', { action: 'admin-stylist' })
        return { data: result }
      } catch (error) {
        if (error instanceof UniquenessError) {
          logger.warn('Eroare de unicitate în acțiunea stylist', {
            fields: error.fields.map((f) => f.field),
            action: 'admin-stylist',
          })
          return {
            validationErrors: Object.fromEntries(error.fields.map((f) => [f.field, [f.message]])),
          }
        }
        logger.error('Eroare în acțiunea stylist', { error, action: 'admin-stylist' })
        throw error
      }
    })
  }
}

// --- PUBLIC SERVER ACTIONS ---
// Definițiile sunt acum declarative, concise și ușor de citit.

export const createStylistAction = createAdminStylistAction(
  createStylistActionSchema,
  async (payload: CreateStylistPayload) => stylistService.createStylist(payload),
)

export const updateStylistAction = createAdminStylistAction(
  updateStylistActionSchema,
  async (payload: UpdateStylistPayload) => stylistService.updateStylist(payload),
)

export const deleteStylistAction = createAdminStylistAction(
  deleteStylistActionSchema,
  async (payload: DeleteStylistPayload) => stylistService.deleteStylist(payload.id),
)
