// src/features/services/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import {
  CreateServiceActionSchema,
  CreateServicePayload,
  DeleteServiceActionSchema,
  type DeleteServicePayload,
  UpdateServiceActionSchema,
  type UpdateServicePayload,
} from '@/core/domains/services'
import { createServiceRepository } from '@/core/domains/services/service.repository'
import { createServiceService } from '@/core/domains/services/service.service'
import { db } from '@/db'
import { APP_ROUTES } from '@/lib/constants'
import { UniquenessError } from '@/lib/errors'
import { createLogger } from '@/lib/logger'
import { ensureUserIsAdmin } from '@/lib/route-protection'
import { executeSafeAction } from '@/lib/safe-action'

/**
 * Logger pentru domeniul services
 */
const logger = createLogger('services')

/**
 * Instanțiem serviciul o singură dată la nivel de modul.
 * Acest lucru este eficient și simplifică corpul acțiunilor.
 */
const serviceService = createServiceService(createServiceRepository(db))

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
 * FACTORY FUNCTION: Creează o acțiune sigură care necesită privilegii de admin.
 * Încorporează validarea, autorizarea, execuția, gestionarea erorilor și revalidarea.
 *
 * @param schema - Schema Zod pentru validarea datelor de intrare.
 * @param actionLogic - Funcția care conține logica de business specifică.
 * @returns O Server Action completă și sigură.
 */
function createAdminServiceAction<T extends z.ZodType<any, any, any>>(
  schema: T,
  actionLogic: (payload: z.infer<T>) => Promise<any>,
) {
  return (payload: z.infer<T>) => {
    return executeSafeAction(schema, payload, async (validatedPayload) => {
      await _ensureUserIsAdmin()

      try {
        const result = await actionLogic(validatedPayload)
        revalidatePath(APP_ROUTES.ADMIN_SERVICES_PAGE)
        logger.info('Acțiune service executată cu succes', { action: 'admin-service' })
        return { data: result }
      } catch (error) {
        if (error instanceof UniquenessError) {
          logger.warn('Eroare de unicitate în acțiunea service', {
            fields: error.fields.map((f) => f.field),
            action: 'admin-service',
          })
          return {
            validationErrors: Object.fromEntries(error.fields.map((f) => [f.field, [f.message]])),
          }
        }
        logger.error('Eroare în acțiunea service', { error, action: 'admin-service' })
        throw error
      }
    })
  }
}

// --- PUBLIC SERVER ACTIONS ---
// Definițiile sunt acum declarative, concise și ușor de citit.

export const updateServiceAction = createAdminServiceAction(
  UpdateServiceActionSchema,
  async (payload: UpdateServicePayload) => serviceService.updateService(payload),
)

export const createServiceAction = createAdminServiceAction(
  CreateServiceActionSchema,
  async (payload: CreateServicePayload) => serviceService.createService(payload),
)

export const deleteServiceAction = createAdminServiceAction(
  DeleteServiceActionSchema,
  async (payload: DeleteServicePayload) => serviceService.deleteService(payload.id),
)
