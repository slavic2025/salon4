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
import { ensureUserIsAdmin, ensureUserIsStylist } from '@/lib/route-protection'
import { executeSafeAction } from '@/lib/safe-action'

async function _ensureUserIsAdmin() {
  // Folosim utilitarul centralizat pentru verificarea rolului
  await ensureUserIsAdmin()
}

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
        return { data: result }
      } catch (error) {
        if (error instanceof UniquenessError) {
          return {
            validationErrors: Object.fromEntries(error.fields.map((f) => [f.field, [f.message]])),
          }
        }
        throw error
      }
    })
  }
}

export const createStylistServiceLinkAction = createAdminStylistServiceLinkAction(
  CreateStylistServiceLinkActionSchema,
  async (payload: CreateStylistServiceLinkPayload) => {
    const stylistServiceLinkService = createStylistServiceLinkService(createStylistServiceLinkRepository(db))
    return stylistServiceLinkService.createLink(payload)
  },
)

export const deleteStylistServiceLinkAction = createAdminStylistServiceLinkAction(
  DeleteStylistServiceLinkActionSchema,
  async (payload: DeleteStylistServiceLinkPayload) => {
    const stylistServiceLinkService = createStylistServiceLinkService(createStylistServiceLinkRepository(db))
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
  const { stylistId, serviceId, customPrice, customDuration } = schema.parse(payload)
  const priceString = typeof customPrice === 'number' ? String(customPrice) : customPrice
  return await stylistServiceLinkService.updateLink(stylistId, serviceId, {
    stylistId,
    serviceId,
    customPrice: priceString,
    customDuration,
  })
}

// --- SERVER ACTIONS PENTRU FETCH ---

const serviceService = createServiceService(createServiceRepository(db))
const stylistServiceLinkService = createStylistServiceLinkService(createStylistServiceLinkRepository(db))

export async function getAllServicesAction() {
  return await serviceService.getAllServices()
}

export async function getStylistServiceLinksAction(payload: { stylistId: string }) {
  const schema = z.object({ stylistId: z.string().uuid() })
  const { stylistId } = schema.parse(payload)
  return await stylistServiceLinkService.getLinksByStylistId(stylistId)
}

// --- SERVER ACTIONS PENTRU STYLIST ---

/**
 * Helper pentru a crea actions care permit unui stylist să-și gestioneze propriile servicii
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
        revalidatePath(APP_ROUTES.STYLIST_DASHBOARD + '/services')
        return { data: result }
      } catch (error) {
        if (error instanceof UniquenessError) {
          return {
            validationErrors: Object.fromEntries(error.fields.map((f) => [f.field, [f.message]])),
          }
        }
        throw error
      }
    })
  }
}

/**
 * Action pentru ca un stylist să-și adauge un serviciu nou
 */
export const createStylistOwnServiceAction = createStylistOwnServiceLinkAction(
  CreateStylistServiceLinkActionSchema,
  async (payload: CreateStylistServiceLinkPayload, userId: string) => {
    // Verificăm că stilistul încearcă să adauge serviciu pentru el însuși
    if (payload.stylistId !== userId) {
      throw new Error(STYLIST_SERVICE_LINK_MESSAGES.ERROR.UNAUTHORIZED_ADD)
    }

    const stylistServiceLinkService = createStylistServiceLinkService(createStylistServiceLinkRepository(db))
    return stylistServiceLinkService.createLink(payload)
  },
)

/**
 * Action pentru ca un stylist să-și șteargă un serviciu
 */
export const deleteStylistOwnServiceAction = createStylistOwnServiceLinkAction(
  DeleteStylistServiceLinkActionSchema,
  async (payload: DeleteStylistServiceLinkPayload, userId: string) => {
    // Verificăm că stilistul încearcă să șteargă serviciu de la el însuși
    if (payload.stylistId !== userId) {
      throw new Error(STYLIST_SERVICE_LINK_MESSAGES.ERROR.UNAUTHORIZED_DELETE)
    }

    const stylistServiceLinkService = createStylistServiceLinkService(createStylistServiceLinkRepository(db))
    return stylistServiceLinkService.deleteLink(payload.stylistId, payload.serviceId)
  },
)

/**
 * Action pentru ca un stylist să-și actualizeze un serviciu
 */
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
      throw new Error(STYLIST_SERVICE_LINK_MESSAGES.ERROR.UNAUTHORIZED_UPDATE)
    }

    const { stylistId, serviceId, customPrice, customDuration } = validatedPayload
    const priceString = typeof customPrice === 'number' ? String(customPrice) : customPrice

    const stylistServiceLinkService = createStylistServiceLinkService(createStylistServiceLinkRepository(db))
    const result = await stylistServiceLinkService.updateLink(stylistId, serviceId, {
      stylistId,
      serviceId,
      customPrice: priceString,
      customDuration,
    })

    revalidatePath(APP_ROUTES.STYLIST_DASHBOARD + '/services')
    return { data: result }
  })
}

/**
 * Action pentru ca un stylist să-și obțină propriile servicii
 */
export async function getStylistOwnServicesAction() {
  const user = await ensureUserIsStylist()
  const stylistServiceLinkService = createStylistServiceLinkService(createStylistServiceLinkRepository(db))
  return await stylistServiceLinkService.getLinksByStylistId(user.id)
}
