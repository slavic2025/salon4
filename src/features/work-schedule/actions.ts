// src/features/work-schedule/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { createWorkScheduleRepository } from '@/core/domains/work-schedule/workSchedule.repository'
import { createWorkScheduleService } from '@/core/domains/work-schedule/workSchedule.service'
import {
  createWorkScheduleActionSchema,
  type CreateWorkSchedulePayload,
  deleteWorkScheduleActionSchema,
  type DeleteWorkSchedulePayload,
  updateWorkScheduleActionSchema,
  type UpdateWorkSchedulePayload,
} from '@/core/domains/work-schedule/workSchedule.types'
import { db } from '@/db'
import { APP_ROUTES } from '@/lib/constants'
import { UniquenessError } from '@/lib/errors'
import { ensureUserIsAdmin, ensureUserIsStylist } from '@/lib/route-protection'
import { executeSafeAction } from '@/lib/safe-action'

/**
 * Instanțiem serviciul o singură dată la nivel de modul.
 * Acest lucru este eficient și simplifică corpul acțiunilor.
 */
const workScheduleService = createWorkScheduleService(createWorkScheduleRepository(db))

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
 * @param revalidatePaths - Căile care trebuie revalidate după acțiune.
 * @returns O Server Action completă și sigură.
 */
function createAdminWorkScheduleAction<T extends z.ZodType<any, any, any>>(
  schema: T,
  actionLogic: (payload: z.infer<T>) => Promise<any>,
  revalidatePaths: string[] = [APP_ROUTES.ADMIN_STYLISTS_PAGE],
) {
  return (payload: z.infer<T>) => {
    return executeSafeAction(schema, payload, async (validatedPayload) => {
      // 1. Securitatea este aplicată automat aici.
      await _ensureUserIsAdmin()

      try {
        // 2. Execuția logicii de business specifice.
        const result = await actionLogic(validatedPayload)

        // 3. Revalidarea căilor este centralizată.
        revalidatePaths.forEach((path) => revalidatePath(path))

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

/**
 * FACTORY FUNCTION: Creează o acțiune sigură care permite unui stylist să-și gestioneze propriul program.
 * @param schema - Schema Zod pentru validarea datelor de intrare.
 * @param actionLogic - Funcția care conține logica de business specifică.
 * @returns O Server Action completă și sigură.
 */
function createStylistOwnScheduleActionFactory<T extends z.ZodType<any, any, any>>(
  schema: T,
  actionLogic: (payload: z.infer<T>, userId: string) => Promise<any>,
) {
  return (payload: z.infer<T>) => {
    return executeSafeAction(schema, payload, async (validatedPayload) => {
      const user = await ensureUserIsStylist()

      try {
        const result = await actionLogic(validatedPayload, user.id)
        revalidatePath(APP_ROUTES.STYLIST_DASHBOARD + '/schedule')
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

// --- ADMIN SERVER ACTIONS ---

export const createWorkScheduleAction = createAdminWorkScheduleAction(
  createWorkScheduleActionSchema,
  async (payload: CreateWorkSchedulePayload) => workScheduleService.createSchedule(payload),
)

export const updateWorkScheduleAction = createAdminWorkScheduleAction(
  updateWorkScheduleActionSchema,
  async (payload: UpdateWorkSchedulePayload) => workScheduleService.updateSchedule(payload),
)

export const deleteWorkScheduleAction = createAdminWorkScheduleAction(
  deleteWorkScheduleActionSchema,
  async (payload: DeleteWorkSchedulePayload) => workScheduleService.deleteSchedule(payload.id),
)

// --- STYLIST OWN SCHEDULE SERVER ACTIONS ---

/**
 * Action pentru ca un stylist să-și adauge un interval nou la program
 */
export const createStylistOwnScheduleAction = createStylistOwnScheduleActionFactory(
  createWorkScheduleActionSchema,
  async (payload: CreateWorkSchedulePayload, userId: string) => {
    // Verificăm că stilistul încearcă să adauge interval pentru el însuși
    if (payload.stylistId !== userId) {
      throw new Error('Nu poți adăuga intervale pentru alți stiliști')
    }

    return workScheduleService.createSchedule(payload)
  },
)

/**
 * Action pentru ca un stylist să-și actualizeze un interval din program
 */
export const updateStylistOwnScheduleAction = createStylistOwnScheduleActionFactory(
  updateWorkScheduleActionSchema,
  async (payload: UpdateWorkSchedulePayload, userId: string) => {
    // Verificăm că stilistul încearcă să actualizeze interval pentru el însuși
    if (payload.stylistId !== userId) {
      throw new Error('Nu poți actualiza intervale pentru alți stiliști')
    }

    return workScheduleService.updateSchedule(payload)
  },
)

/**
 * Action pentru ca un stylist să-și șteargă un interval din program
 */
export const deleteStylistOwnScheduleAction = createStylistOwnScheduleActionFactory(
  deleteWorkScheduleActionSchema,
  async (payload: DeleteWorkSchedulePayload, userId: string) => {
    // Verificăm că intervalul aparține stilistului
    const schedule = await workScheduleService.getScheduleById(payload.id)
    if (schedule.stylistId !== userId) {
      throw new Error('Nu poți șterge intervale de la alți stiliști')
    }

    return workScheduleService.deleteSchedule(payload.id)
  },
)

// --- FETCH SERVER ACTIONS ---

/**
 * Obține toate programele (pentru admin)
 */
export async function getAllWorkSchedulesAction() {
  await ensureUserIsAdmin()
  return await workScheduleService.getAllSchedules()
}

/**
 * Obține programul unui stilist (pentru admin și stylist)
 */
export async function getStylistScheduleAction(payload: { stylistId: string }) {
  const schema = z.object({ stylistId: z.string().uuid() })
  const { stylistId } = schema.parse(payload)

  const user = await ensureUserIsStylist()

  // Stilistul poate vedea doar propriul program, adminul poate vedea pe toți
  if (user.role !== 'ADMIN' && stylistId !== user.id) {
    throw new Error('Nu poți accesa programul altor stiliști')
  }

  return await workScheduleService.getStylistSchedule(stylistId)
}

/**
 * Obține propriul program al stilistului
 */
export async function getStylistOwnScheduleAction() {
  const user = await ensureUserIsStylist()
  return await workScheduleService.getStylistSchedule(user.id)
}

/**
 * Verifică disponibilitatea unui stilist (pentru programări)
 */
export async function checkStylistAvailabilityAction(payload: {
  stylistId: string
  dayOfWeek: number
  startTime: string
  endTime: string
}) {
  const schema = z.object({
    stylistId: z.string().uuid(),
    dayOfWeek: z.number().int().min(0).max(6),
    startTime: z.string(),
    endTime: z.string(),
  })

  const validatedPayload = schema.parse(payload)

  return await workScheduleService.isStylistAvailable(
    validatedPayload.stylistId,
    validatedPayload.dayOfWeek as any, // Type assertion temporară
    validatedPayload.startTime,
    validatedPayload.endTime,
  )
}
