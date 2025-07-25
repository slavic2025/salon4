// src/core/domains/appointments/appointment.utils.ts
import type { Unavailability } from '@/core/domains/unavailability/unavailability.types'
import { convertJsDayToAppDay } from '@/core/domains/work-schedule'
import type { DayOfWeek, StylistWeeklySchedule } from '@/core/domains/work-schedule/workSchedule.types'
import { addDaysToDate, formatDateToISO, toSalonTimezone } from '@/lib/utils/date'
import type { Slot } from '@/lib/utils/slot-helpers'
import {
  createAppointmentsByDateMap,
  createUnavailabilitiesByDateMap,
  generateMultipleStylistsSlotsSchema,
  generateSlotsForDay,
  generateSlotsForMultipleStylists,
  generateSlotsSchema,
} from '@/lib/utils/slot-helpers'

// Re-export tipul Slot pentru compatibilitate
export type { Slot }

import type { Appointment } from './appointment.types'

export interface GenerateAvailableSlotsParams {
  schedule: StylistWeeklySchedule
  appointments: Appointment[]
  unavailabilities: Unavailability[]
  serviceDuration: number // minute
  fromDate: string // ISO date
  days: number
}

export interface GenerateAvailableSlotsForMultipleStylistsParams {
  schedules: StylistWeeklySchedule[]
  appointments: Appointment[]
  unavailabilities: Unavailability[]
  serviceDuration: number // minute
  fromDate: string // ISO date
  days: number
}

/**
 * Generează slot-uri disponibile pentru un stilist cu optimizări de performanță
 */
export function generateAvailableSlots({
  schedule,
  appointments,
  unavailabilities,
  serviceDuration,
  fromDate,
  days,
}: GenerateAvailableSlotsParams): Slot[] {
  // Validare input cu Zod
  const validatedParams = generateSlotsSchema.parse({
    schedule,
    appointments,
    unavailabilities,
    serviceDuration,
    fromDate,
    days,
  })

  const slots: Slot[] = []
  const startDate = toSalonTimezone(validatedParams.fromDate)

  // Preprocesează datele pentru performanță optimă
  const appointmentsByDate = createAppointmentsByDateMap(validatedParams.appointments)
  const unavailabilitiesByDate = createUnavailabilitiesByDateMap(validatedParams.unavailabilities)

  for (let d = 0; d < validatedParams.days; d++) {
    const currentDate = addDaysToDate(startDate, d)
    const jsDayOfWeek = currentDate.getDay()
    const appDayOfWeek = convertJsDayToAppDay(jsDayOfWeek) as DayOfWeek
    const daySchedule = validatedParams.schedule.schedule[appDayOfWeek] || []

    if (!daySchedule.length) continue

    // Obține programările și indisponibilitățile pentru această zi
    const dayKey = formatDateToISO(currentDate).slice(0, 10) // YYYY-MM-DD
    const dayAppointments = appointmentsByDate.get(dayKey) || []
    const dayUnavailabilities = unavailabilitiesByDate.get(dayKey) || []

    // Generează slot-uri pentru această zi
    const daySlots = generateSlotsForDay(
      currentDate,
      daySchedule,
      dayAppointments,
      dayUnavailabilities,
      validatedParams.serviceDuration,
    )

    slots.push(...daySlots)
  }

  return slots
}

/**
 * Generează slot-uri disponibile pentru mai mulți stiliștii cu optimizări de performanță
 */
export function generateAvailableSlotsForMultipleStylists({
  schedules,
  appointments,
  unavailabilities,
  serviceDuration,
  fromDate,
  days,
}: GenerateAvailableSlotsForMultipleStylistsParams): Slot[] {
  // Validare input cu Zod
  const validatedParams = generateMultipleStylistsSlotsSchema.parse({
    schedules,
    appointments,
    unavailabilities,
    serviceDuration,
    fromDate,
    days,
  })

  const slots: Slot[] = []
  const startDate = toSalonTimezone(validatedParams.fromDate)

  // Preprocesează datele pentru performanță optimă
  const appointmentsByStylist = new Map<string, Appointment[]>()
  const unavailabilitiesByStylist = new Map<string, Unavailability[]>()

  // Grupează programările și indisponibilitățile pe stiliști
  validatedParams.appointments.forEach((appointment) => {
    if (appointment.stylistId) {
      if (!appointmentsByStylist.has(appointment.stylistId)) {
        appointmentsByStylist.set(appointment.stylistId, [])
      }
      appointmentsByStylist.get(appointment.stylistId)!.push(appointment)
    }
  })

  validatedParams.unavailabilities.forEach((unavailability) => {
    if (unavailability.stylistId) {
      if (!unavailabilitiesByStylist.has(unavailability.stylistId)) {
        unavailabilitiesByStylist.set(unavailability.stylistId, [])
      }
      unavailabilitiesByStylist.get(unavailability.stylistId)!.push(unavailability)
    }
  })

  for (let d = 0; d < validatedParams.days; d++) {
    const currentDate = addDaysToDate(startDate, d)

    // Generează slot-uri pentru toți stiliștii în această zi
    const daySlots = generateSlotsForMultipleStylists(
      currentDate,
      validatedParams.schedules,
      appointmentsByStylist,
      unavailabilitiesByStylist,
      validatedParams.serviceDuration,
    )

    slots.push(...daySlots)
  }

  return slots
}
