'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { createServiceRepository } from '@/core/domains/services/service.repository'
import { createServiceService } from '@/core/domains/services/service.service'
import { STYLIST_SERVICE_LINK_MESSAGES } from '@/core/domains/stylist-services/stylist-service.constants'
import { createStylistServiceLinkRepository } from '@/core/domains/stylist-services/stylist-service.repository'
import { createStylistServiceLinkService } from '@/core/domains/stylist-services/stylist-service.service'
import type {
  CreateStylistServiceLinkPayload,
  DeleteStylistServiceLinkPayload,
} from '@/core/domains/stylist-services/stylist-service.types'
import {
  CreateStylistServiceLinkActionSchema,
  DeleteStylistServiceLinkActionSchema,
} from '@/core/domains/stylist-services/stylist-service.validators'
import { db } from '@/db'
import { APP_ROUTES } from '@/lib/constants'
import { UniquenessError } from '@/lib/errors'
import { createLogger } from '@/lib/logger'
import { ensureUserIsAdmin, ensureUserIsStylist } from '@/lib/route-protection'
import { executeSafeAction } from '@/lib/safe-action'

/**
 * Logger pentru domeniul stylist-services
 */
const logger = createLogger('stylist-services')

/**
 * Instanțiem serviciile o singură dată la nivel de modul.
 * Acest lucru este eficient și simplifică corpul acțiunilor.
 */
const serviceService = createServiceService(createServiceRepository(db))
const stylistServiceLinkService = createStylistServiceLinkService(createStylistServiceLinkRepository(db))

/**
 * Helper intern pentru a verifica dacă utilizatorul este admin.
 * @private
 */
async function _ensureUserIsAdmin() {
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
function createAdminStylistServiceLinkAction<T extends z.ZodType<any, any, any>>(
  schema: T,
  actionLogic: (payload: z.infer<T>) => Promise<any>,
) {
  return (payload: z.infer<T>) => {
    return executeSafeAction(schema, payload, async (validatedPayload) => {
      await _ensureUserIsAdmin()

      try {
        const result = await actionLogic(validatedPayload)
        revalidatePath(APP_ROUTES.ADMIN_STYLISTS_PAGE)
        logger.info('Acțiune admin stylist-service executată cu succes', { action: 'admin-stylist-service' })
        return { data: result }
      } catch (error) {
        if (error instanceof UniquenessError) {
          logger.warn('Eroare de unicitate în acțiunea admin stylist-service', {
            fields: error.fields.map((f) => f.field),
            action: 'admin-stylist-service',
          })
          return {
            validationErrors: Object.fromEntries(error.fields.map((f) => [f.field, [f.message]])),
          }
        }
        logger.error('Eroare în acțiunea admin stylist-service', { error, action: 'admin-stylist-service' })
        throw error
      }
    })
  }
}

/**
 * FACTORY FUNCTION: Creează o acțiune sigură care permite unui stylist să-și gestioneze propriile servicii.
 * Încorporează validarea, autorizarea, execuția, gestionarea erorilor și revalidarea.
 *
 * @param schema - Schema Zod pentru validarea datelor de intrare.
 * @param actionLogic - Funcția care conține logica de business specifică.
 * @returns O Server Action completă și sigură.
 */
function createStylistOwnServiceLinkAction<T extends z.ZodType<any, any, any>>(
  schema: T,
  actionLogic: (payload: z.infer<T>, userId: string) => Promise<any>,
) {
  return (payload: z.infer<T>) => {
    return executeSafeAction(schema, payload, async (validatedPayload) => {
      const user = await ensureUserIsStylist()

      try {
        const result = await actionLogic(validatedPayload, user.id)
        revalidatePath(APP_ROUTES.STYLIST_SERVICES)
        logger.info('Acțiune stylist own service executată cu succes', {
          userId: user.id,
          action: 'stylist-own-service',
        })
        return { data: result }
      } catch (error) {
        if (error instanceof UniquenessError) {
          logger.warn('Eroare de unicitate în acțiunea stylist own service', {
            fields: error.fields.map((f) => f.field),
            userId: user.id,
            action: 'stylist-own-service',
          })
          return {
            validationErrors: Object.fromEntries(error.fields.map((f) => [f.field, [f.message]])),
          }
        }
        logger.error('Eroare în acțiunea stylist own service', {
          error,
          userId: user.id,
          action: 'stylist-own-service',
        })
        throw error
      }
    })
  }
}

// --- ADMIN SERVER ACTIONS ---

export const createStylistServiceLinkAction = createAdminStylistServiceLinkAction(
  CreateStylistServiceLinkActionSchema,
  async (payload: CreateStylistServiceLinkPayload) => {
    return stylistServiceLinkService.createLink(payload)
  },
)

export const deleteStylistServiceLinkAction = createAdminStylistServiceLinkAction(
  DeleteStylistServiceLinkActionSchema,
  async (payload: DeleteStylistServiceLinkPayload) => {
    return stylistServiceLinkService.deleteLink(payload.stylistId, payload.serviceId)
  },
)

export const updateStylistServiceLinkAction = async (payload: {
  stylistId: string
  serviceId: string
  customPrice?: string | number | null
  customDuration?: number | null
}) => {
  const schema = z.object({
    stylistId: z.string().uuid(),
    serviceId: z.string().uuid(),
    customPrice: z.union([z.string(), z.number()]).optional().nullable(),
    customDuration: z.number().int().positive().optional().nullable(),
  })

  return executeSafeAction(schema, payload, async (validatedPayload) => {
    await _ensureUserIsAdmin()

    try {
      const { stylistId, serviceId, customPrice, customDuration } = validatedPayload
      const priceString = typeof customPrice === 'number' ? String(customPrice) : customPrice

      const result = await stylistServiceLinkService.updateLink(stylistId, serviceId, {
        stylistId,
        serviceId,
        customPrice: priceString,
        customDuration,
      })

      revalidatePath(APP_ROUTES.ADMIN_STYLISTS_PAGE)
      logger.info('Actualizare stylist service link cu succes', {
        stylistId,
        serviceId,
        action: 'admin-update-stylist-service',
      })
      return { data: result }
    } catch (error) {
      if (error instanceof UniquenessError) {
        logger.warn('Eroare de unicitate la actualizarea stylist service link', {
          fields: error.fields.map((f) => f.field),
          stylistId: validatedPayload.stylistId,
          serviceId: validatedPayload.serviceId,
          action: 'admin-update-stylist-service',
        })
        return {
          validationErrors: Object.fromEntries(error.fields.map((f) => [f.field, [f.message]])),
        }
      }
      logger.error('Eroare la actualizarea stylist service link', {
        error,
        stylistId: validatedPayload.stylistId,
        serviceId: validatedPayload.serviceId,
        action: 'admin-update-stylist-service',
      })
      throw error
    }
  })
}

// --- STYLIST OWN SERVICE SERVER ACTIONS ---

export const createStylistOwnServiceAction = createStylistOwnServiceLinkAction(
  CreateStylistServiceLinkActionSchema,
  async (payload: CreateStylistServiceLinkPayload, userId: string) => {
    // Verificăm că stilistul încearcă să adauge serviciu pentru el însuși
    if (payload.stylistId !== userId) {
      logger.warn('Încercare de adăugare serviciu pentru alt stilist', {
        requestedStylistId: payload.stylistId,
        userId,
        action: 'stylist-add-service',
      })
      throw new Error(STYLIST_SERVICE_LINK_MESSAGES.ERROR.UNAUTHORIZED_ADD)
    }

    logger.info('Adăugare serviciu pentru stilist', {
      stylistId: payload.stylistId,
      serviceId: payload.serviceId,
      action: 'stylist-add-service',
    })
    return stylistServiceLinkService.createLink(payload)
  },
)

export const deleteStylistOwnServiceAction = createStylistOwnServiceLinkAction(
  DeleteStylistServiceLinkActionSchema,
  async (payload: DeleteStylistServiceLinkPayload, userId: string) => {
    // Verificăm că stilistul încearcă să șteargă serviciu de la el însuși
    if (payload.stylistId !== userId) {
      logger.warn('Încercare de ștergere serviciu pentru alt stilist', {
        requestedStylistId: payload.stylistId,
        userId,
        action: 'stylist-delete-service',
      })
      throw new Error(STYLIST_SERVICE_LINK_MESSAGES.ERROR.UNAUTHORIZED_DELETE)
    }

    logger.info('Ștergere serviciu pentru stilist', {
      stylistId: payload.stylistId,
      serviceId: payload.serviceId,
      action: 'stylist-delete-service',
    })
    return stylistServiceLinkService.deleteLink(payload.stylistId, payload.serviceId)
  },
)

export const updateStylistOwnServiceAction = async (payload: {
  stylistId: string
  serviceId: string
  customPrice?: string | number | null
  customDuration?: number | null
}) => {
  const schema = z.object({
    stylistId: z.string().uuid(),
    serviceId: z.string().uuid(),
    customPrice: z.union([z.string(), z.number()]).optional().nullable(),
    customDuration: z.number().int().positive().optional().nullable(),
  })

  return executeSafeAction(schema, payload, async (validatedPayload) => {
    const user = await ensureUserIsStylist()

    // Verificăm că stilistul încearcă să actualizeze serviciu pentru el însuși
    if (validatedPayload.stylistId !== user.id) {
      logger.warn('Încercare de actualizare serviciu pentru alt stilist', {
        requestedStylistId: validatedPayload.stylistId,
        userId: user.id,
        action: 'stylist-update-service',
      })
      throw new Error(STYLIST_SERVICE_LINK_MESSAGES.ERROR.UNAUTHORIZED_UPDATE)
    }

    const { stylistId, serviceId, customPrice, customDuration } = validatedPayload
    const priceString = typeof customPrice === 'number' ? String(customPrice) : customPrice

    const result = await stylistServiceLinkService.updateLink(stylistId, serviceId, {
      stylistId,
      serviceId,
      customPrice: priceString,
      customDuration,
    })

    revalidatePath(APP_ROUTES.STYLIST_SERVICES)
    logger.info('Actualizare serviciu pentru stilist cu succes', {
      stylistId,
      serviceId,
      userId: user.id,
      action: 'stylist-update-service',
    })
    return { data: result }
  })
}

// --- FETCH SERVER ACTIONS ---

export async function getAllServicesAction() {
  return await serviceService.getAllServices()
}

export async function getStylistServiceLinksAction(payload: { stylistId: string }) {
  const schema = z.object({ stylistId: z.string().uuid() })
  const { stylistId } = schema.parse(payload)
  return await stylistServiceLinkService.getLinksByStylistId(stylistId)
}

export async function getStylistOwnServicesAction() {
  const user = await ensureUserIsStylist()
  return await stylistServiceLinkService.getLinksByStylistId(user.id)
}
