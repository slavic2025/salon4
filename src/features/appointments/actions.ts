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
import {
  generateAvailableSlots,
  generateAvailableSlotsForMultipleStylists,
} from '@/core/domains/appointments/appointment.utils'
import { createServiceRepository } from '@/core/domains/services/service.repository'
import { createServiceService } from '@/core/domains/services/service.service'
import { createStylistServiceLinkRepository } from '@/core/domains/stylist-services/stylist-service.repository'
import { createStylistServiceLinkService } from '@/core/domains/stylist-services/stylist-service.service'
import { createStylistRepository } from '@/core/domains/stylists/stylist.repository'
import { createStylistService } from '@/core/domains/stylists/stylist.service'
import { createUnavailabilityRepository } from '@/core/domains/unavailability/unavailability.repository'
import { createUnavailabilityService } from '@/core/domains/unavailability/unavailability.service'
import { createWorkScheduleRepository } from '@/core/domains/work-schedule/workSchedule.repository'
import { createWorkScheduleService } from '@/core/domains/work-schedule/workSchedule.service'
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
const serviceService = createServiceService(createServiceRepository(db))
const stylistService = createStylistService(createStylistRepository(db), null as any)
const workScheduleService = createWorkScheduleService(createWorkScheduleRepository(db))
const unavailabilityService = createUnavailabilityService(createUnavailabilityRepository(db))
const stylistServiceLinkService = createStylistServiceLinkService(createStylistServiceLinkRepository(db))

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

export async function getActiveServicesPublicAction() {
  return await serviceService.getActiveServices()
}

export async function getAllStylistsPublicAction() {
  return await stylistService.getAllStylists()
}

export async function getStylistsForServicePublicAction(serviceId: string) {
  // Obține toate legăturile pentru serviciul dat
  const links = await stylistServiceLinkService.getLinksByServiceId(serviceId)
  if (!links.length) return []
  // Extrage id-urile stiliștilor
  const stylistIds = links.map((link) => link.stylistId)
  // Obține toți stiliștii activi cu aceste id-uri
  const allStylists = await stylistService.getAllStylists()
  return allStylists.filter((stylist) => stylistIds.includes(stylist.id) && stylist.isActive)
}

export const getAvailableSlotsPublicAction = async (payload: {
  stylistId: string
  serviceId: string
  fromDate: string // ISO date
  days: number
}) => {
  // Dacă nu avem un stilist specific, obținem toți stiliștii care oferă serviciul
  if (!payload.stylistId) {
    const stylistsForService = await getStylistsForServicePublicAction(payload.serviceId)
    if (!stylistsForService.length) {
      return [] // Nu există stiliști pentru acest serviciu
    }

    const stylistIds = stylistsForService.map((stylist) => stylist.id)

    // Obținem programele pentru toți stiliștii
    const schedules = await workScheduleService.getMultipleStylists(stylistIds)

    const from = new Date(payload.fromDate)
    const to = new Date(from)
    to.setDate(from.getDate() + payload.days)

    // Obținem programările pentru toți stiliștii
    const appointments = await appointmentService.getAppointmentsByStylistIds(stylistIds, from, to)

    // Obținem indisponibilitățile pentru toți stiliștii
    const unavailabilities = await unavailabilityService.getUnavailabilitiesByStylistIds(
      stylistIds,
      payload.fromDate,
      to.toISOString().slice(0, 10),
    )

    const service = await serviceService.getServiceById(payload.serviceId)
    if (!service) throw new Error('Serviciul nu a fost găsit')

    // Generăm sloturile disponibile pentru toți stiliștii
    return generateAvailableSlotsForMultipleStylists({
      schedules,
      appointments,
      unavailabilities,
      serviceDuration: service.duration,
      fromDate: payload.fromDate,
      days: payload.days,
    })
  }

  // Cazul când avem un stilist specific (logica existentă)
  const schedule = await workScheduleService.getStylistSchedule(payload.stylistId)
  const from = new Date(payload.fromDate)
  const to = new Date(from)
  to.setDate(from.getDate() + payload.days)
  const appointments = await appointmentService.getAppointmentsByStylist(payload.stylistId)
  const unavailabilities = await unavailabilityService.getUnavailabilitiesByStylist(
    payload.stylistId,
    payload.fromDate,
    to.toISOString().slice(0, 10),
  )
  const service = await serviceService.getServiceById(payload.serviceId)
  if (!service) throw new Error('Serviciul nu a fost găsit')
  return generateAvailableSlots({
    schedule,
    appointments,
    unavailabilities,
    serviceDuration: service.duration,
    fromDate: payload.fromDate,
    days: payload.days,
  })
}

export async function createPublicAppointmentAction(payload: CreateAppointmentPayload) {
  return executeSafeAction(CreateAppointmentActionSchema, payload, async (validatedPayload) => {
    logger.info('Creare programare publică', validatedPayload)
    const result = await appointmentService.createAppointment(validatedPayload)

    // Returnează formatul corect pentru executeSafeAction
    if (result.success) {
      return { data: result }
    } else {
      return { serverError: result.message }
    }
  })
}

// --- STYLIST APPOINTMENT ACTIONS ---

/**
 * Obține programările pentru un stilist specific
 */
export async function getStylistAppointmentsAction(stylistId: string) {
  try {
    logger.info('Obținere programări pentru stilist', { stylistId })
    const appointments = await appointmentService.getAppointmentsByStylist(stylistId)
    return { data: appointments }
  } catch (error) {
    logger.error('Eroare la obținerea programărilor stilistului', { error, stylistId })
    return { serverError: 'Eroare la încărcarea programărilor' }
  }
}

/**
 * Obține programările cu detalii pentru un stilist specific
 */
export async function getStylistAppointmentsWithDetailsAction(stylistId: string) {
  try {
    logger.info('Obținere programări cu detalii pentru stilist', { stylistId })
    const appointments = await appointmentService.getAppointmentsWithDetails({ stylistId })
    return { data: appointments }
  } catch (error) {
    logger.error('Eroare la obținerea programărilor cu detalii pentru stilist', { error, stylistId })
    return { serverError: 'Eroare la încărcarea programărilor' }
  }
}

/**
 * Actualizează statusul unei programări (pentru stilist)
 */
export async function updateStylistAppointmentStatusAction(payload: UpdateAppointmentStatusPayload) {
  return executeSafeAction(UpdateAppointmentStatusActionSchema, payload, async (validatedPayload) => {
    try {
      logger.info('Actualizare status programare pentru stilist', validatedPayload)
      const result = await appointmentService.updateAppointmentStatus(validatedPayload.id, validatedPayload.status)

      if (result.success) {
        revalidatePath('/stylist/appointments')
        logger.info('Status programare actualizat cu succes', {
          appointmentId: validatedPayload.id,
          status: validatedPayload.status,
        })
        return { data: result.data }
      } else {
        return { serverError: result.message }
      }
    } catch (error) {
      logger.error('Eroare la actualizarea statusului programării', { error, payload: validatedPayload })
      return { serverError: 'Eroare la actualizarea statusului programării' }
    }
  })
}
