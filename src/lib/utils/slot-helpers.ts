// src/lib/utils/slot-helpers.ts
import { z } from 'zod'

import type { Appointment } from '@/core/domains/appointments/appointment.types'
import type { Unavailability } from '@/core/domains/unavailability/unavailability.types'
import type { DayOfWeek, StylistWeeklySchedule } from '@/core/domains/work-schedule/workSchedule.types'

import {
  addMinutesToDate,
  extractDayFromDate,
  formatDateToISO,
  generateSlotKey,
  isDateAfter,
  isDateBefore,
  isDateEqual,
  isSameDate,
  parseTime,
} from './date'

// Schema pentru validarea parametrilor
export const generateSlotsSchema = z.object({
  schedule: z.object({
    stylistId: z.string(),
    schedule: z.record(
      z.array(
        z.object({
          startTime: z.string(),
          endTime: z.string(),
        }),
      ),
    ),
  }),
  appointments: z.array(
    z.object({
      id: z.string(),
      clientEmail: z.string(),
      clientName: z.string(),
      clientPhone: z.string(),
      clientNotes: z.string().nullable(),
      serviceId: z.string(),
      stylistId: z.string(),
      startTime: z.date(),
      endTime: z.date(),
      status: z.enum(['waiting', 'confirmed', 'refused', 'cancelled', 'completed', 'no_show']),
      createdAt: z.date(),
      updatedAt: z.date().nullable(),
    }),
  ),
  unavailabilities: z.array(
    z.object({
      id: z.string(),
      stylistId: z.string(),
      date: z.string(),
      startTime: z.string().nullable(),
      endTime: z.string().nullable(),
      cause: z.enum(['pauza', 'programare_offline', 'alta_situatie']),
      allDay: z.boolean(),
      description: z.string().nullable(),
      createdAt: z.date(),
      updatedAt: z.date().nullable(),
    }),
  ),
  serviceDuration: z.number().positive(),
  fromDate: z.string().refine(
    (val) => {
      // Acceptă atât formatul ISO datetime cât și formatul de dată simplu YYYY-MM-DD
      const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      return isoRegex.test(val) || dateRegex.test(val)
    },
    {
      message: 'fromDate trebuie să fie în format ISO datetime sau YYYY-MM-DD',
    },
  ),
  days: z.number().positive(),
})

export const generateMultipleStylistsSlotsSchema = z.object({
  schedules: z.array(
    z.object({
      stylistId: z.string(),
      schedule: z.record(
        z.array(
          z.object({
            startTime: z.string(),
            endTime: z.string(),
          }),
        ),
      ),
    }),
  ),
  appointments: z.array(
    z.object({
      id: z.string(),
      clientEmail: z.string(),
      clientName: z.string(),
      clientPhone: z.string(),
      clientNotes: z.string().nullable(),
      serviceId: z.string(),
      stylistId: z.string(),
      startTime: z.date(),
      endTime: z.date(),
      status: z.enum(['waiting', 'confirmed', 'refused', 'cancelled', 'completed', 'no_show']),
      createdAt: z.date(),
      updatedAt: z.date().nullable(),
    }),
  ),
  unavailabilities: z.array(
    z.object({
      id: z.string(),
      stylistId: z.string(),
      date: z.string(),
      startTime: z.string().nullable(),
      endTime: z.string().nullable(),
      cause: z.enum(['pauza', 'programare_offline', 'alta_situatie']),
      allDay: z.boolean(),
      description: z.string().nullable(),
      createdAt: z.date(),
      updatedAt: z.date().nullable(),
    }),
  ),
  serviceDuration: z.number().positive(),
  fromDate: z.string().refine(
    (val) => {
      // Acceptă atât formatul ISO datetime cât și formatul de dată simplu YYYY-MM-DD
      const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      return isoRegex.test(val) || dateRegex.test(val)
    },
    {
      message: 'fromDate trebuie să fie în format ISO datetime sau YYYY-MM-DD',
    },
  ),
  days: z.number().positive(),
})

export interface Slot {
  start: string // ISO
  end: string // ISO
  available: boolean
  stylistId?: string
}

/**
 * Preprocesează programările într-o structură indexată per zi pentru performanță optimă
 */
export function createAppointmentsByDateMap(appointments: Appointment[]): Map<string, Appointment[]> {
  const appointmentsByDate = new Map<string, Appointment[]>()

  appointments.forEach((appointment) => {
    const day = extractDayFromDate(appointment.startTime)
    if (!appointmentsByDate.has(day)) {
      appointmentsByDate.set(day, [])
    }
    appointmentsByDate.get(day)!.push(appointment)
  })

  return appointmentsByDate
}

/**
 * Preprocesează indisponibilitățile într-o structură indexată per zi pentru performanță optimă
 */
export function createUnavailabilitiesByDateMap(unavailabilities: Unavailability[]): Map<string, Unavailability[]> {
  const unavailabilitiesByDate = new Map<string, Unavailability[]>()

  unavailabilities.forEach((unavailability) => {
    const day = extractDayFromDate(unavailability.date)
    if (!unavailabilitiesByDate.has(day)) {
      unavailabilitiesByDate.set(day, [])
    }
    unavailabilitiesByDate.get(day)!.push(unavailability)
  })

  return unavailabilitiesByDate
}

/**
 * Verifică dacă un slot are conflicte cu programările existente
 */
export function hasAppointmentConflict(slotStart: Date, slotEnd: Date, appointments: Appointment[]): boolean {
  return appointments.some((appointment) => {
    const appStart = new Date(appointment.startTime)
    const appEnd = new Date(appointment.endTime)
    return isDateBefore(slotStart, appEnd) && isDateAfter(slotEnd, appStart)
  })
}

/**
 * Verifică dacă un slot se suprapune cu indisponibilități
 */
export function hasUnavailabilityConflict(
  slotStart: Date,
  slotEnd: Date,
  currentDate: Date,
  unavailabilities: Unavailability[],
): boolean {
  return unavailabilities.some((unavailability) => {
    // Verifică indisponibilități pentru întreaga zi
    if (unavailability.allDay && isSameDate(new Date(unavailability.date), currentDate)) {
      return true
    }

    // Verifică indisponibilități cu ore specifice
    if (!unavailability.startTime || !unavailability.endTime) {
      return false
    }

    const unavStart = parseTime(unavailability.startTime, currentDate)
    const unavEnd = parseTime(unavailability.endTime, currentDate)

    return isDateBefore(slotStart, unavEnd) && isDateAfter(slotEnd, unavStart)
  })
}

/**
 * Generează slot-uri pentru o zi specifică
 */
export function generateSlotsForDay(
  currentDate: Date,
  daySchedule: Array<{ startTime: string; endTime: string }>,
  appointments: Appointment[],
  unavailabilities: Unavailability[],
  serviceDuration: number,
): Slot[] {
  const slots: Slot[] = []

  for (const interval of daySchedule) {
    let slotStart = parseTime(interval.startTime, currentDate)
    const slotEnd = parseTime(interval.endTime, currentDate)

    while (
      isDateBefore(addMinutesToDate(slotStart, serviceDuration), slotEnd) ||
      isDateEqual(addMinutesToDate(slotStart, serviceDuration), slotEnd)
    ) {
      const slotFinish = addMinutesToDate(slotStart, serviceDuration)

      const hasConflict =
        hasAppointmentConflict(slotStart, slotFinish, appointments) ||
        hasUnavailabilityConflict(slotStart, slotFinish, currentDate, unavailabilities)

      slots.push({
        start: formatDateToISO(slotStart),
        end: formatDateToISO(slotFinish),
        available: !hasConflict,
      })

      slotStart = addMinutesToDate(slotStart, serviceDuration)
    }
  }

  return slots
}

/**
 * Generează slot-uri pentru mai mulți stiliști cu deduplicare eficientă
 */
export function generateSlotsForMultipleStylists(
  currentDate: Date,
  schedules: StylistWeeklySchedule[],
  appointmentsByStylist: Map<string, Appointment[]>,
  unavailabilitiesByStylist: Map<string, Unavailability[]>,
  serviceDuration: number,
): Slot[] {
  const slotMap = new Map<string, Slot>()

  for (const schedule of schedules) {
    const stylistId = schedule.stylistId
    const dayOfWeek = getDayOfWeek(currentDate)
    const daySchedule = schedule.schedule[dayOfWeek] || []

    if (!daySchedule.length) {
      continue
    }

    const stylistAppointments = appointmentsByStylist.get(stylistId) || []
    const stylistUnavailabilities = unavailabilitiesByStylist.get(stylistId) || []

    for (const interval of daySchedule) {
      let slotStart = parseTime(interval.startTime, currentDate)
      const slotEnd = parseTime(interval.endTime, currentDate)

      while (
        isDateBefore(addMinutesToDate(slotStart, serviceDuration), slotEnd) ||
        isDateEqual(addMinutesToDate(slotStart, serviceDuration), slotEnd)
      ) {
        const slotFinish = addMinutesToDate(slotStart, serviceDuration)

        const hasConflict =
          hasAppointmentConflict(slotStart, slotFinish, stylistAppointments) ||
          hasUnavailabilityConflict(slotStart, slotFinish, currentDate, stylistUnavailabilities)

        const slotKey = generateSlotKey(slotStart, slotFinish)
        const isAvailable = !hasConflict

        if (slotMap.has(slotKey)) {
          // Dacă slot-ul există și stilistul curent este disponibil, îl marcăm ca disponibil
          const existingSlot = slotMap.get(slotKey)!
          if (isAvailable) {
            existingSlot.available = true
            existingSlot.stylistId = stylistId
          }
        } else {
          // Adaugă un nou slot
          slotMap.set(slotKey, {
            start: formatDateToISO(slotStart),
            end: formatDateToISO(slotFinish),
            available: isAvailable,
            stylistId: isAvailable ? stylistId : undefined,
          })
        }

        slotStart = addMinutesToDate(slotStart, serviceDuration)
      }
    }
  }

  return Array.from(slotMap.values())
}

/**
 * Helper pentru a obține ziua săptămânii în formatul aplicației
 */
function getDayOfWeek(date: Date): DayOfWeek {
  const jsDay = date.getDay()
  // Mapare: JS day -> App day (0=luni, 1=marți, 2=miercuri, 3=joi, 4=vineri, 5=sâmbătă, 6=duminică)
  const conversionMap: Record<number, DayOfWeek> = {
    0: 6, // JS duminică -> App duminică
    1: 0, // JS luni -> App luni
    2: 1, // JS marți -> App marți
    3: 2, // JS miercuri -> App miercuri
    4: 3, // JS joi -> App joi
    5: 4, // JS vineri -> App vineri
    6: 5, // JS sâmbătă -> App sâmbătă
  }
  return conversionMap[jsDay] ?? 0
}
