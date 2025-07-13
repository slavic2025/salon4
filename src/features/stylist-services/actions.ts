'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { createServiceRepository } from '@/core/domains/services/service.repository'
import { createServiceService } from '@/core/domains/services/service.service'
import { createStylistServiceLinkRepository } from '@/core/domains/stylist-services/stylist-service.repository'
import { createStylistServiceLinkService } from '@/core/domains/stylist-services/stylist-service.service'
import {
  createStylistServiceLinkActionSchema,
  type CreateStylistServiceLinkPayload,
  deleteStylistServiceLinkActionSchema,
  type DeleteStylistServiceLinkPayload,
} from '@/core/domains/stylist-services/stylist-service.types'
import { db } from '@/db'
import { APP_ROUTES, ROLES } from '@/lib/constants'
import { UniquenessError } from '@/lib/errors'
import { executeSafeAction } from '@/lib/safe-action'
import { createClient } from '@/lib/supabase/server'

async function _ensureUserIsAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user?.app_metadata.role !== ROLES.ADMIN) {
    throw new Error('Not authorized')
  }
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
  createStylistServiceLinkActionSchema,
  async (payload: CreateStylistServiceLinkPayload) => {
    const stylistServiceLinkService = createStylistServiceLinkService(createStylistServiceLinkRepository(db))
    return stylistServiceLinkService.createLink(payload)
  },
)

export const deleteStylistServiceLinkAction = createAdminStylistServiceLinkAction(
  deleteStylistServiceLinkActionSchema,
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
  return await stylistServiceLinkService.updateLink(stylistId, serviceId, { customPrice: priceString, customDuration })
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
