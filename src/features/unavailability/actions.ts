// src/features/unavailability/actions.ts
'use server'

import { revalidatePath } from 'next/cache'

import { createUnavailabilityRepository } from '@/core/domains/unavailability/unavailability.repository'
import { createUnavailabilityService } from '@/core/domains/unavailability/unavailability.service'
import {
  CreateUnavailabilityActionSchema,
  UpdateUnavailabilityActionSchema,
} from '@/core/domains/unavailability/unavailability.types'
import { db } from '@/db'
import { ensureUserIsStylist } from '@/lib/route-protection'
import { executeSafeAction } from '@/lib/safe-action'

export async function createUnavailabilityStylistAction(payload: unknown) {
  const user = await ensureUserIsStylist()

  return executeSafeAction(CreateUnavailabilityActionSchema, payload as any, async (data) => {
    // Enforțăm că stylistul poate crea doar pentru el însuși
    const actionData = { ...data, stylistId: user.id }

    const repository = createUnavailabilityRepository(db)
    const service = createUnavailabilityService(repository)

    try {
      const result = await service.createUnavailability(actionData)
      revalidatePath('/stylist/unavailability')
      return { data: result }
    } catch (error) {
      console.error('Error creating unavailability:', error)
      return { serverError: 'Eroare la crearea indisponibilității' }
    }
  })
}

export async function updateUnavailabilityStylistAction(id: string, payload: unknown) {
  const user = await ensureUserIsStylist()

  return executeSafeAction(UpdateUnavailabilityActionSchema, payload as any, async (data) => {
    const repository = createUnavailabilityRepository(db)
    const service = createUnavailabilityService(repository)

    try {
      // Verificăm că indisponibilitatea există și aparține stylistului
      const existing = await service.getUnavailabilityById(id)
      if (!existing || existing.stylistId !== user.id) {
        return { serverError: 'Indisponibilitatea nu a fost găsită sau nu aveți permisiunea să o modificați' }
      }

      const result = await service.updateUnavailability(id, data)
      revalidatePath('/stylist/unavailability')
      return { data: result }
    } catch (error) {
      console.error('Error updating unavailability:', error)
      return { serverError: 'Eroare la actualizarea indisponibilității' }
    }
  })
}

export async function createBulkUnavailabilityStylistAction(payload: {
  stylistId: string
  dates: string[]
  startTime?: string | null
  endTime?: string | null
  cause: 'pauza' | 'programare_offline' | 'alta_situatie'
  allDay: boolean
  description?: string | null
}) {
  try {
    const user = await ensureUserIsStylist()

    // Enforțăm că stylistul poate crea doar pentru el însuși
    if (payload.stylistId !== user.id) {
      return {
        success: false,
        error: 'Nu aveți permisiunea să creați indisponibilități pentru acest stylist',
      }
    }

    if (!payload.dates?.length) {
      return {
        success: false,
        error: 'Nu au fost furnizate date pentru crearea indisponibilităților',
      }
    }

    const repository = createUnavailabilityRepository(db)
    const service = createUnavailabilityService(repository)
    const results = []
    const errors = []

    // Creăm fiecare indisponibilitate individual
    for (const date of payload.dates) {
      try {
        const unavailabilityData = {
          stylistId: payload.stylistId,
          date,
          startTime: payload.allDay ? null : payload.startTime,
          endTime: payload.allDay ? null : payload.endTime,
          cause: payload.cause,
          allDay: payload.allDay,
          description: payload.description,
        }

        const unavailability = await service.createUnavailability(unavailabilityData)
        results.push(unavailability)
      } catch (error) {
        console.error(`Eroare la crearea indisponibilității pentru ${date}:`, error)
        errors.push({
          date,
          error: error instanceof Error ? error.message : 'Eroare necunoscută',
        })
      }
    }

    // Revalidare cache pentru pagini relevante
    revalidatePath('/stylist/unavailability')

    if (errors.length === 0) {
      return {
        success: true,
        message: `${results.length} indisponibilități au fost create cu succes`,
        data: {
          created: results.length,
          total: payload.dates.length,
          results,
        },
      }
    } else if (results.length > 0) {
      return {
        success: true,
        message: `${results.length} din ${payload.dates.length} indisponibilități au fost create cu succes`,
        data: {
          created: results.length,
          total: payload.dates.length,
          results,
          errors,
        },
      }
    } else {
      return {
        success: false,
        error: 'Nu s-a putut crea nicio indisponibilitate',
        data: { errors },
      }
    }
  } catch (error) {
    console.error('Eroare la crearea în masă a indisponibilităților (stylist):', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Eroare la crearea indisponibilităților',
    }
  }
}

export async function deleteUnavailabilityStylistAction(id: string) {
  try {
    const user = await ensureUserIsStylist()
    const repository = createUnavailabilityRepository(db)
    const service = createUnavailabilityService(repository)

    // Verificăm că indisponibilitatea există și aparține stylistului
    const existing = await service.getUnavailabilityById(id)
    if (!existing || existing.stylistId !== user.id) {
      return {
        success: false,
        error: 'Indisponibilitatea nu a fost găsită sau nu aveți permisiunea să o ștergeți',
      }
    }

    const success = await service.deleteUnavailability(id)
    if (success) {
      revalidatePath('/stylist/unavailability')
      return { success: true }
    } else {
      return { success: false, error: 'Eroare la ștergerea indisponibilității' }
    }
  } catch (error) {
    console.error('Eroare la ștergerea indisponibilității:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Eroare la ștergerea indisponibilității',
    }
  }
}
