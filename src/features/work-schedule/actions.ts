// src/features/work-schedule/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { WORK_SCHEDULE_MESSAGES } from '@/core/domains/work-schedule/workSchedule.constants'
import { createWorkScheduleRepository } from '@/core/domains/work-schedule/workSchedule.repository'
import { createWorkScheduleService } from '@/core/domains/work-schedule/workSchedule.service'
import {
  CreateWorkScheduleActionSchema,
  type CreateWorkSchedulePayload,
  DeleteWorkScheduleActionSchema,
  type DeleteWorkSchedulePayload,
  UpdateWorkScheduleActionSchema,
  type UpdateWorkSchedulePayload,
} from '@/core/domains/work-schedule/workSchedule.types'
import { db } from '@/db'
import { APP_ROUTES, ROLES } from '@/lib/constants'
import { UniquenessError } from '@/lib/errors'
import { createLogger } from '@/lib/logger'
import { ensureUserIsAdmin, ensureUserIsStylist } from '@/lib/route-protection'
import { executeSafeAction } from '@/lib/safe-action'

/**
 * Logger pentru domeniul work-schedule
 */
const logger = createLogger('work-schedule')

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
  revalidatePaths: string[] = [APP_ROUTES.ADMIN],
) {
  return (payload: z.infer<T>) => {
    return executeSafeAction(schema, payload, async (validatedPayload) => {
      await _ensureUserIsAdmin()

      try {
        const result = await actionLogic(validatedPayload)
        revalidatePaths.forEach((path) => revalidatePath(path))
        logger.info('Acțiune admin work-schedule executată cu succes', { action: 'admin-work-schedule' })
        return { data: result }
      } catch (error) {
        if (error instanceof UniquenessError) {
          logger.warn('Eroare de unicitate în acțiunea admin work-schedule', {
            fields: error.fields.map((f) => f.field),
            action: 'admin-work-schedule',
          })
          return {
            validationErrors: Object.fromEntries(error.fields.map((f) => [f.field, [f.message]])),
          }
        }
        logger.error('Eroare în acțiunea admin work-schedule', { error, action: 'admin-work-schedule' })
        throw error
      }
    })
  }
}

/**
 * FACTORY FUNCTION: Creează o acțiune sigură care permite unui stylist să-și gestioneze propriul program.
 * Încorporează validarea, autorizarea, execuția, gestionarea erorilor și revalidarea.
 *
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
        revalidatePath(APP_ROUTES.STYLIST_SCHEDULE)
        logger.info('Acțiune stylist work-schedule executată cu succes', {
          userId: user.id,
          action: 'stylist-work-schedule',
        })
        return { data: result }
      } catch (error) {
        if (error instanceof UniquenessError) {
          logger.warn('Eroare de unicitate în acțiunea stylist work-schedule', {
            fields: error.fields.map((f) => f.field),
            userId: user.id,
            action: 'stylist-work-schedule',
          })
          return {
            validationErrors: Object.fromEntries(error.fields.map((f) => [f.field, [f.message]])),
          }
        }
        logger.error('Eroare în acțiunea stylist work-schedule', {
          error,
          userId: user.id,
          action: 'stylist-work-schedule',
        })
        throw error
      }
    })
  }
}

// --- ADMIN SERVER ACTIONS ---

export const createWorkScheduleAction = createAdminWorkScheduleAction(
  CreateWorkScheduleActionSchema,
  async (payload: CreateWorkSchedulePayload) => workScheduleService.createSchedule(payload),
)

export const updateWorkScheduleAction = createAdminWorkScheduleAction(
  UpdateWorkScheduleActionSchema,
  async (payload: UpdateWorkSchedulePayload) => workScheduleService.updateSchedule(payload),
)

export const deleteWorkScheduleAction = createAdminWorkScheduleAction(
  DeleteWorkScheduleActionSchema,
  async (payload: DeleteWorkSchedulePayload) => workScheduleService.deleteSchedule(payload.id),
)

// --- STYLIST OWN SCHEDULE SERVER ACTIONS ---

export const createStylistOwnScheduleAction = createStylistOwnScheduleActionFactory(
  CreateWorkScheduleActionSchema,
  async (payload: CreateWorkSchedulePayload, userId: string) => {
    // Verificăm că stilistul încearcă să adauge interval pentru el însuși
    if (payload.stylistId !== userId) {
      logger.warn('Încercare de adăugare interval pentru alt stilist', {
        requestedStylistId: payload.stylistId,
        userId,
        action: 'stylist-add-schedule',
      })
      throw new Error(WORK_SCHEDULE_MESSAGES.ERROR.UNAUTHORIZED_MODIFY)
    }

    logger.info('Adăugare interval pentru stilist', {
      stylistId: payload.stylistId,
      dayOfWeek: payload.dayOfWeek,
      action: 'stylist-add-schedule',
    })
    return workScheduleService.createSchedule(payload)
  },
)

export const updateStylistOwnScheduleAction = createStylistOwnScheduleActionFactory(
  UpdateWorkScheduleActionSchema,
  async (payload: UpdateWorkSchedulePayload, userId: string) => {
    // Verificăm că stilistul încearcă să actualizeze interval pentru el însuși
    if (payload.stylistId !== userId) {
      logger.warn('Încercare de actualizare interval pentru alt stilist', {
        requestedStylistId: payload.stylistId,
        userId,
        action: 'stylist-update-schedule',
      })
      throw new Error(WORK_SCHEDULE_MESSAGES.ERROR.UNAUTHORIZED_MODIFY)
    }

    logger.info('Actualizare interval pentru stilist', {
      stylistId: payload.stylistId,
      scheduleId: payload.id,
      action: 'stylist-update-schedule',
    })
    return workScheduleService.updateSchedule(payload)
  },
)

export const deleteStylistOwnScheduleAction = createStylistOwnScheduleActionFactory(
  DeleteWorkScheduleActionSchema,
  async (payload: DeleteWorkSchedulePayload, userId: string) => {
    // Verificăm că intervalul aparține stilistului
    const schedule = await workScheduleService.getScheduleById(payload.id)
    if (schedule.stylistId !== userId) {
      logger.warn('Încercare de ștergere interval pentru alt stilist', {
        scheduleStylistId: schedule.stylistId,
        userId,
        scheduleId: payload.id,
        action: 'stylist-delete-schedule',
      })
      throw new Error(WORK_SCHEDULE_MESSAGES.ERROR.UNAUTHORIZED_MODIFY)
    }

    logger.info('Ștergere interval pentru stilist', {
      stylistId: schedule.stylistId,
      scheduleId: payload.id,
      action: 'stylist-delete-schedule',
    })
    return workScheduleService.deleteSchedule(payload.id)
  },
)

// --- FETCH SERVER ACTIONS ---

export async function getAllWorkSchedulesAction() {
  await ensureUserIsAdmin()
  return await workScheduleService.getAllSchedules()
}

export async function getStylistScheduleAction(payload: { stylistId: string }) {
  const schema = z.object({ stylistId: z.string().uuid() })
  const { stylistId } = schema.parse(payload)

  const user = await ensureUserIsStylist()

  // Stilistul poate vedea doar propriul program, adminul poate vedea pe toți
  if (user.role !== ROLES.ADMIN && stylistId !== user.id) {
    logger.warn('Încercare de acces la programul altui stilist', {
      requestedStylistId: stylistId,
      userId: user.id,
      userRole: user.role,
      action: 'get-stylist-schedule',
    })
    throw new Error(WORK_SCHEDULE_MESSAGES.ERROR.UNAUTHORIZED_ACCESS)
  }

  logger.info('Acces la programul stilistului', {
    stylistId,
    userId: user.id,
    userRole: user.role,
    action: 'get-stylist-schedule',
  })
  return await workScheduleService.getStylistSchedule(stylistId)
}

export async function getStylistOwnScheduleAction() {
  const user = await ensureUserIsStylist()
  return await workScheduleService.getStylistSchedule(user.id)
}

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
