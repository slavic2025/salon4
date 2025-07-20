// src/features/appointments/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import {
  CreateAppointmentActionSchema,
  CreateAppointmentPayload,
  DeleteAppointmentActionSchema,
  type DeleteAppointmentPayload,
  UpdateAppointmentActionSchema,
  type UpdateAppointmentPayload,
  UpdateAppointmentStatusActionSchema,
  type UpdateAppointmentStatusPayload,
} from '@/core/domains/appointments'
import { createAppointmentRepository } from '@/core/domains/appointments/appointment.repository'
import { createAppointmentService } from '@/core/domains/appointments/appointment.service'
import { db } from '@/db'
import { APP_ROUTES } from '@/lib/constants'
import { UniquenessError } from '@/lib/errors'
import { createLogger } from '@/lib/logger'
import { ensureUserIsAdmin } from '@/lib/route-protection'
import { executeSafeAction } from '@/lib/safe-action'

/**
 * Logger pentru domeniul appointments
 */
const logger = createLogger('appointments')

/**
 * Instanțiem serviciul o singură dată la nivel de modul.
 * Acest lucru este eficient și simplifică corpul acțiunilor.
 */
const appointmentService = createAppointmentService(createAppointmentRepository(db))

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
function createAdminAppointmentAction<T extends z.ZodType<any, any, any>>(
  schema: T,
  actionLogic: (payload: z.infer<T>) => Promise<any>,
) {
  return (payload: z.infer<T>) => {
    return executeSafeAction(schema, payload, async (validatedPayload) => {
      await _ensureUserIsAdmin()

      try {
        const result = await actionLogic(validatedPayload)
        revalidatePath(APP_ROUTES.ADMIN_APPOINTMENTS_PAGE)
        logger.info('Acțiune appointment executată cu succes', { action: 'admin-appointment' })
        return { data: result }
      } catch (error) {
        if (error instanceof UniquenessError) {
          logger.warn('Eroare de unicitate în acțiunea appointment', {
            fields: error.fields.map((f) => f.field),
            action: 'admin-appointment',
          })
          return {
            validationErrors: Object.fromEntries(error.fields.map((f) => [f.field, [f.message]])),
          }
        }
        logger.error('Eroare în acțiunea appointment', { error, action: 'admin-appointment' })
        throw error
      }
    })
  }
}

// --- PUBLIC SERVER ACTIONS ---
// Definițiile sunt acum declarative, concise și ușor de citit.

export const updateAppointmentAction = createAdminAppointmentAction(
  UpdateAppointmentActionSchema,
  async (payload: UpdateAppointmentPayload) => appointmentService.updateAppointment(payload),
)

export const createAppointmentAction = createAdminAppointmentAction(
  CreateAppointmentActionSchema,
  async (payload: CreateAppointmentPayload) => appointmentService.createAppointment(payload),
)

export const deleteAppointmentAction = createAdminAppointmentAction(
  DeleteAppointmentActionSchema,
  async (payload: DeleteAppointmentPayload) => appointmentService.deleteAppointment(payload.id),
)

export const updateAppointmentStatusAction = createAdminAppointmentAction(
  UpdateAppointmentStatusActionSchema,
  async (payload: UpdateAppointmentStatusPayload) =>
    appointmentService.updateAppointmentStatus(payload.id, payload.status),
)
