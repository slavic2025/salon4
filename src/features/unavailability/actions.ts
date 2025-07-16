// src/features/unavailability/actions.ts
'use server'

import { revalidatePath } from 'next/cache'

import {
  UNAVAILABILITY_ERROR_MESSAGES,
  UNAVAILABILITY_SUCCESS_MESSAGES,
} from '@/core/domains/unavailability/unavailability.constants'
import { createUnavailabilityRepository } from '@/core/domains/unavailability/unavailability.repository'
import { createUnavailabilityService } from '@/core/domains/unavailability/unavailability.service'
import {
  CreateUnavailabilityActionSchema,
  type CreateUnavailabilityPayload,
  type UnavailabilityFilters,
  UpdateUnavailabilityActionSchema,
  type UpdateUnavailabilityPayload,
} from '@/core/domains/unavailability/unavailability.types'
import { db } from '@/db'
import { ensureUserIsAdmin, ensureUserIsStylist } from '@/lib/route-protection'
import { executeSafeAction } from '@/lib/safe-action'

// Creăm serviciul unavailability cu dependențele necesare
function getUnavailabilityService() {
  return createUnavailabilityService(createUnavailabilityRepository(db))
}

// --- ACTIONS PENTRU ADMINISTRATORI ---

/**
 * Creează o indisponibilitate (Admin poate pentru orice stylist)
 */
export const createUnavailabilityAdminAction = async (payload: CreateUnavailabilityPayload) => {
  await ensureUserIsAdmin()

  return executeSafeAction(CreateUnavailabilityActionSchema, payload, async (data) => {
    const service = getUnavailabilityService()

    try {
      const unavailability = await service.createUnavailability(data)

      // Revalidare cache pentru pagini relevante
      revalidatePath('/admin/unavailability')
      revalidatePath('/admin/stylists')
      revalidatePath(`/admin/stylists/${data.stylistId}`)

      return {
        success: true,
        message: UNAVAILABILITY_SUCCESS_MESSAGES.CREATED,
        data: unavailability,
      }
    } catch (error) {
      console.error('Eroare la crearea indisponibilității (admin):', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : UNAVAILABILITY_ERROR_MESSAGES.CREATION_FAILED,
      }
    }
  })
}

/**
 * Actualizează o indisponibilitate (Admin poate pentru orice stylist)
 */
export const updateUnavailabilityAdminAction = async (id: string, payload: UpdateUnavailabilityPayload) => {
  await ensureUserIsAdmin()

  return executeSafeAction(UpdateUnavailabilityActionSchema, payload, async (data) => {
    const service = getUnavailabilityService()

    try {
      const unavailability = await service.updateUnavailability(id, data)

      if (!unavailability) {
        return {
          success: false,
          error: UNAVAILABILITY_ERROR_MESSAGES.NOT_FOUND,
        }
      }

      // Revalidare cache
      revalidatePath('/admin/unavailability')
      revalidatePath('/admin/stylists')
      revalidatePath(`/admin/stylists/${unavailability.stylistId}`)

      return {
        success: true,
        message: UNAVAILABILITY_SUCCESS_MESSAGES.UPDATED,
        data: unavailability,
      }
    } catch (error) {
      console.error('Eroare la actualizarea indisponibilității (admin):', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : UNAVAILABILITY_ERROR_MESSAGES.UPDATE_FAILED,
      }
    }
  })
}

/**
 * Șterge o indisponibilitate (Admin poate pentru orice stylist)
 */
export const deleteUnavailabilityAdminAction = async (id: string) => {
  await ensureUserIsAdmin()

  if (!id?.trim()) {
    return {
      success: false,
      error: 'ID-ul indisponibilității este obligatoriu',
    }
  }

  try {
    const service = getUnavailabilityService()

    // Obținem detaliile înainte de ștergere pentru revalidare
    const existing = await service.getUnavailabilityById(id)
    if (!existing) {
      return {
        success: false,
        error: UNAVAILABILITY_ERROR_MESSAGES.NOT_FOUND,
      }
    }

    const deleted = await service.deleteUnavailability(id)

    if (!deleted) {
      return {
        success: false,
        error: UNAVAILABILITY_ERROR_MESSAGES.DELETE_FAILED,
      }
    }

    // Revalidare cache
    revalidatePath('/admin/unavailability')
    revalidatePath('/admin/stylists')
    revalidatePath(`/admin/stylists/${existing.stylistId}`)

    return {
      success: true,
      message: UNAVAILABILITY_SUCCESS_MESSAGES.DELETED,
    }
  } catch (error) {
    console.error('Eroare la ștergerea indisponibilității (admin):', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : UNAVAILABILITY_ERROR_MESSAGES.DELETE_FAILED,
    }
  }
}

/**
 * Obține toate indisponibilitățile cu filtru (Admin)
 */
export const getUnavailabilitiesAdminAction = async (filters: UnavailabilityFilters = {}) => {
  await ensureUserIsAdmin()

  try {
    const service = getUnavailabilityService()
    const unavailabilities = await service.getUnavailabilitiesWithStylistDetails(filters)

    return {
      success: true,
      data: unavailabilities,
    }
  } catch (error) {
    console.error('Eroare la obținerea indisponibilităților (admin):', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : UNAVAILABILITY_ERROR_MESSAGES.DATABASE_ERROR,
    }
  }
}

// --- ACTIONS PENTRU STYLISTS ---

/**
 * Creează o indisponibilitate (Stylist doar pentru sine)
 */
export const createUnavailabilityStylistAction = async (payload: CreateUnavailabilityPayload) => {
  const user = await ensureUserIsStylist()

  // Enforțăm că stylistul poate crea doar pentru el însuși
  const actionPayload = { ...payload, stylistId: user.id }

  return executeSafeAction(CreateUnavailabilityActionSchema, actionPayload, async (data) => {
    const service = getUnavailabilityService()

    try {
      const unavailability = await service.createUnavailability(data)

      // Revalidare cache pentru pagini stylist
      revalidatePath('/stylist')
      revalidatePath('/stylist/unavailability')
      revalidatePath('/stylist/schedule')

      return {
        success: true,
        message: UNAVAILABILITY_SUCCESS_MESSAGES.CREATED,
        data: unavailability,
      }
    } catch (error) {
      console.error('Eroare la crearea indisponibilității (stylist):', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : UNAVAILABILITY_ERROR_MESSAGES.CREATION_FAILED,
      }
    }
  })
}

/**
 * Actualizează o indisponibilitate (Stylist doar pentru sine)
 */
export const updateUnavailabilityStylistAction = async (id: string, payload: UpdateUnavailabilityPayload) => {
  const user = await ensureUserIsStylist()

  return executeSafeAction(UpdateUnavailabilityActionSchema, payload, async (data) => {
    const service = getUnavailabilityService()

    try {
      // Verificăm că indisponibilitatea aparține stylistului
      const existing = await service.getUnavailabilityById(id)
      if (!existing) {
        return {
          success: false,
          error: UNAVAILABILITY_ERROR_MESSAGES.NOT_FOUND,
        }
      }

      if (existing.stylistId !== user.id) {
        return {
          success: false,
          error: UNAVAILABILITY_ERROR_MESSAGES.UNAUTHORIZED,
        }
      }

      const unavailability = await service.updateUnavailability(id, data)

      // Revalidare cache
      revalidatePath('/stylist')
      revalidatePath('/stylist/unavailability')
      revalidatePath('/stylist/schedule')

      return {
        success: true,
        message: UNAVAILABILITY_SUCCESS_MESSAGES.UPDATED,
        data: unavailability,
      }
    } catch (error) {
      console.error('Eroare la actualizarea indisponibilității (stylist):', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : UNAVAILABILITY_ERROR_MESSAGES.UPDATE_FAILED,
      }
    }
  })
}

/**
 * Șterge o indisponibilitate (Stylist doar pentru sine)
 */
export const deleteUnavailabilityStylistAction = async (id: string) => {
  const user = await ensureUserIsStylist()

  if (!id?.trim()) {
    return {
      success: false,
      error: 'ID-ul indisponibilității este obligatoriu',
    }
  }

  try {
    const service = getUnavailabilityService()

    // Verificăm că indisponibilitatea aparține stylistului
    const existing = await service.getUnavailabilityById(id)
    if (!existing) {
      return {
        success: false,
        error: UNAVAILABILITY_ERROR_MESSAGES.NOT_FOUND,
      }
    }

    if (existing.stylistId !== user.id) {
      return {
        success: false,
        error: UNAVAILABILITY_ERROR_MESSAGES.UNAUTHORIZED,
      }
    }

    const deleted = await service.deleteUnavailability(id)

    if (!deleted) {
      return {
        success: false,
        error: UNAVAILABILITY_ERROR_MESSAGES.DELETE_FAILED,
      }
    }

    // Revalidare cache
    revalidatePath('/stylist')
    revalidatePath('/stylist/unavailability')
    revalidatePath('/stylist/schedule')

    return {
      success: true,
      message: UNAVAILABILITY_SUCCESS_MESSAGES.DELETED,
    }
  } catch (error) {
    console.error('Eroare la ștergerea indisponibilității (stylist):', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : UNAVAILABILITY_ERROR_MESSAGES.DELETE_FAILED,
    }
  }
}

/**
 * Obține indisponibilitățile stylistului curent
 */
export const getUnavailabilitiesStylistAction = async (dateFrom?: string, dateTo?: string) => {
  const user = await ensureUserIsStylist()

  try {
    const service = getUnavailabilityService()
    const unavailabilities = await service.getUnavailabilitiesByStylist(user.id, dateFrom, dateTo)

    return {
      success: true,
      data: unavailabilities,
    }
  } catch (error) {
    console.error('Eroare la obținerea indisponibilităților (stylist):', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : UNAVAILABILITY_ERROR_MESSAGES.DATABASE_ERROR,
    }
  }
}
