// src/features/unavailability/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { UNAVAILABILITY_ERROR_MESSAGES } from '@/core/domains/unavailability/unavailability.constants'
import { createUnavailabilityRepository } from '@/core/domains/unavailability/unavailability.repository'
import { createUnavailabilityService } from '@/core/domains/unavailability/unavailability.service'
import {
  CreateBulkUnavailabilityActionSchema,
  CreateUnavailabilityActionSchema,
  UpdateUnavailabilityActionSchema,
} from '@/core/domains/unavailability/unavailability.types'
import { db } from '@/db'
import { APP_ROUTES } from '@/lib/constants'
import { createLogger } from '@/lib/logger'
import { ensureUserIsStylist } from '@/lib/route-protection'
import { executeSafeAction } from '@/lib/safe-action'

/**
 * Logger pentru domeniul unavailability
 */
const logger = createLogger('unavailability')

/**
 * Instanțiem serviciul o singură dată la nivel de modul.
 * Acest lucru este eficient și simplifică corpul acțiunilor.
 */
const unavailabilityService = createUnavailabilityService(createUnavailabilityRepository(db))

/**
 * FACTORY FUNCTION: Creează o acțiune sigură care permite unui stylist să-și gestioneze propriile indisponibilități.
 * Încorporează validarea, autorizarea, execuția, gestionarea erorilor și revalidarea.
 *
 * @param schema - Schema Zod pentru validarea datelor de intrare.
 * @param actionLogic - Funcția care conține logica de business specifică.
 * @returns O Server Action completă și sigură.
 */
function createStylistUnavailabilityAction<T extends z.ZodType<any, any, any>>(
  schema: T,
  actionLogic: (payload: z.infer<T>, userId: string) => Promise<any>,
) {
  return (payload: z.infer<T>) => {
    return executeSafeAction(schema, payload, async (validatedPayload) => {
      const user = await ensureUserIsStylist()

      try {
        const result = await actionLogic(validatedPayload, user.id)
        revalidatePath(APP_ROUTES.STYLIST_UNAVAILABILITY)
        logger.info('Acțiune unavailability executată cu succes', {
          userId: user.id,
          action: 'stylist-unavailability',
        })
        return { data: result }
      } catch (error) {
        logger.error('Eroare în acțiunea unavailability', {
          error,
          userId: user.id,
          action: 'stylist-unavailability',
        })
        return { serverError: UNAVAILABILITY_ERROR_MESSAGES.CREATION_FAILED }
      }
    })
  }
}

/**
 * FACTORY FUNCTION: Creează o acțiune sigură pentru actualizarea indisponibilităților cu ID.
 * Încorporează validarea, autorizarea, execuția, gestionarea erorilor și revalidarea.
 *
 * @param schema - Schema Zod pentru validarea datelor de intrare.
 * @param actionLogic - Funcția care conține logica de business specifică.
 * @returns O Server Action completă și sigură.
 */
function createUpdateUnavailabilityAction<T extends z.ZodType<any, any, any>>(
  schema: T,
  actionLogic: (id: string, data: z.infer<T>, userId: string) => Promise<any>,
) {
  return (id: string, payload: unknown) => {
    return executeSafeAction(schema, payload as any, async (data) => {
      const user = await ensureUserIsStylist()

      try {
        const result = await actionLogic(id, data, user.id)
        revalidatePath(APP_ROUTES.STYLIST_UNAVAILABILITY)
        logger.info('Actualizare unavailability cu succes', {
          unavailabilityId: id,
          userId: user.id,
          action: 'update-unavailability',
        })
        return { data: result }
      } catch (error) {
        logger.error('Eroare la actualizarea unavailability', {
          error,
          unavailabilityId: id,
          userId: user.id,
          action: 'update-unavailability',
        })
        return { serverError: UNAVAILABILITY_ERROR_MESSAGES.UPDATE_FAILED }
      }
    })
  }
}

/**
 * FACTORY FUNCTION: Creează o acțiune sigură pentru ștergerea indisponibilităților cu ID.
 * Încorporează validarea, autorizarea, execuția, gestionarea erorilor și revalidarea.
 *
 * @param actionLogic - Funcția care conține logica de business specifică.
 * @returns O Server Action completă și sigură.
 */
function createDeleteUnavailabilityAction(actionLogic: (id: string, userId: string) => Promise<boolean>) {
  return async (id: string) => {
    const user = await ensureUserIsStylist()

    try {
      const success = await actionLogic(id, user.id)
      if (success) {
        revalidatePath(APP_ROUTES.STYLIST_UNAVAILABILITY)
        logger.info('Ștergere unavailability cu succes', {
          unavailabilityId: id,
          userId: user.id,
          action: 'delete-unavailability',
        })
        return { data: { success: true } }
      } else {
        logger.warn('Ștergere unavailability eșuată', {
          unavailabilityId: id,
          userId: user.id,
          action: 'delete-unavailability',
        })
        return { serverError: UNAVAILABILITY_ERROR_MESSAGES.DELETE_FAILED }
      }
    } catch (error) {
      logger.error('Eroare la ștergerea unavailability', {
        error,
        unavailabilityId: id,
        userId: user.id,
        action: 'delete-unavailability',
      })
      return {
        serverError: error instanceof Error ? error.message : UNAVAILABILITY_ERROR_MESSAGES.DELETE_FAILED,
      }
    }
  }
}

/**
 * FACTORY FUNCTION: Creează o acțiune sigură pentru crearea în masă a indisponibilităților.
 * Încorporează validarea, autorizarea, execuția, gestionarea erorilor și revalidarea.
 *
 * @param schema - Schema Zod pentru validarea datelor de intrare.
 * @param actionLogic - Funcția care conține logica de business specifică.
 * @returns O Server Action completă și sigură.
 */
function createBulkUnavailabilityAction<T extends z.ZodType<any, any, any>>(
  schema: T,
  actionLogic: (data: z.infer<T>, userId: string) => Promise<any[]>,
) {
  return (payload: unknown) => {
    return executeSafeAction(schema, payload as any, async (data) => {
      const user = await ensureUserIsStylist()

      try {
        // Enforțăm că stylistul poate crea doar pentru el însuși
        if (data.stylistId !== user.id) {
          return { serverError: UNAVAILABILITY_ERROR_MESSAGES.UNAUTHORIZED }
        }

        const results = await actionLogic(data, user.id)

        // Revalidare cache pentru pagini relevante
        revalidatePath(APP_ROUTES.STYLIST_UNAVAILABILITY)

        logger.info('Creare în masă unavailability cu succes', {
          userId: user.id,
          created: results.length,
          action: 'bulk-create-unavailability',
        })

        return {
          data: {
            created: results.length,
            total: data.dates.length,
            results,
          },
        }
      } catch (error) {
        logger.error('Eroare la crearea în masă a indisponibilităților', {
          error,
          userId: user.id,
          action: 'bulk-create-unavailability',
        })
        return {
          serverError: error instanceof Error ? error.message : UNAVAILABILITY_ERROR_MESSAGES.CREATION_FAILED,
        }
      }
    })
  }
}

// --- STYLIST UNAVAILABILITY SERVER ACTIONS ---

export const createUnavailabilityStylistAction = createStylistUnavailabilityAction(
  CreateUnavailabilityActionSchema,
  async (data, userId: string) => {
    // Enforțăm că stylistul poate crea doar pentru el însuși
    const actionData = { ...data, stylistId: userId }
    return await unavailabilityService.createUnavailability(actionData)
  },
)

export const updateUnavailabilityStylistAction = createUpdateUnavailabilityAction(
  UpdateUnavailabilityActionSchema,
  async (id: string, data: any, userId: string) => {
    // Verificăm că indisponibilitatea există și aparține stylistului
    await unavailabilityService.ensureStylistOwns(id, userId)
    return await unavailabilityService.updateUnavailability(id, data)
  },
)

export const deleteUnavailabilityStylistAction = createDeleteUnavailabilityAction(
  async (id: string, userId: string) => {
    // Verificăm că indisponibilitatea există și aparține stylistului
    await unavailabilityService.ensureStylistOwns(id, userId)
    return await unavailabilityService.deleteUnavailability(id)
  },
)

export const createBulkUnavailabilityStylistAction = createBulkUnavailabilityAction(
  CreateBulkUnavailabilityActionSchema,
  async (data: any, userId: string) => {
    return await unavailabilityService.createBulkUnavailability(data)
  },
)
