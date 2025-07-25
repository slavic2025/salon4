// src/core/domains/appointments/appointment.utils.ts
import type { Unavailability } from '@/core/domains/unavailability/unavailability.types'
import { convertJsDayToAppDay } from '@/core/domains/work-schedule'
import type { DayOfWeek, StylistWeeklySchedule } from '@/core/domains/work-schedule/workSchedule.types'

import type { Appointment } from './appointment.types'

export interface Slot {
  start: string // ISO
  end: string // ISO
  available: boolean
  stylistId?: string // ID-ul stilistului disponibil pentru acest slot
}

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

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60000)
}

export function generateAvailableSlots({
  schedule,
  appointments,
  unavailabilities,
  serviceDuration,
  fromDate,
  days,
}: GenerateAvailableSlotsParams): Slot[] {
  const slots: Slot[] = []
  const startDate = new Date(fromDate)

  for (let d = 0; d < days; d++) {
    const currentDate = new Date(startDate)
    currentDate.setDate(startDate.getDate() + d)
    const jsDayOfWeek = currentDate.getDay()
    const appDayOfWeek = convertJsDayToAppDay(jsDayOfWeek) as DayOfWeek
    const daySchedule = schedule.schedule[appDayOfWeek] || []
    if (!daySchedule.length) continue

    for (const interval of daySchedule) {
      let slotStart = new Date(currentDate)
      slotStart.setHours(Number(interval.startTime.split(':')[0]), Number(interval.startTime.split(':')[1]), 0, 0)
      const slotEnd = new Date(currentDate)
      slotEnd.setHours(Number(interval.endTime.split(':')[0]), Number(interval.endTime.split(':')[1]), 0, 0)

      while (addMinutes(slotStart, serviceDuration) <= slotEnd) {
        const slotFinish = addMinutes(slotStart, serviceDuration)
        // Verifică suprapuneri cu programări existente
        const hasAppointmentConflict = appointments.some((app) => {
          const appStart = new Date(app.startTime)
          const appEnd = new Date(app.endTime)
          return slotStart < appEnd && slotFinish > appStart
        })
        // Verifică suprapuneri cu indisponibilități
        const hasUnavailability = unavailabilities.some((unav) => {
          if (unav.allDay && new Date(unav.date).toDateString() === currentDate.toDateString()) return true
          if (!unav.startTime || !unav.endTime) return false
          const unavStart = new Date(currentDate)
          unavStart.setHours(Number(unav.startTime.split(':')[0]), Number(unav.startTime.split(':')[1]), 0, 0)
          const unavEnd = new Date(currentDate)
          unavEnd.setHours(Number(unav.endTime.split(':')[0]), Number(unav.endTime.split(':')[1]), 0, 0)
          return slotStart < unavEnd && slotFinish > unavStart
        })
        slots.push({
          start: slotStart.toISOString(),
          end: slotFinish.toISOString(),
          available: !hasAppointmentConflict && !hasUnavailability,
        })
        slotStart = addMinutes(slotStart, serviceDuration)
      }
    }
  }
  return slots
}

export function generateAvailableSlotsForMultipleStylists({
  schedules,
  appointments,
  unavailabilities,
  serviceDuration,
  fromDate,
  days,
}: GenerateAvailableSlotsForMultipleStylistsParams): Slot[] {
  const slots: Slot[] = []
  const startDate = new Date(fromDate)

  for (let d = 0; d < days; d++) {
    const currentDate = new Date(startDate)
    currentDate.setDate(startDate.getDate() + d)
    const jsDayOfWeek = currentDate.getDay()
    const appDayOfWeek = convertJsDayToAppDay(jsDayOfWeek) as DayOfWeek

    // Pentru fiecare stilist, verificăm disponibilitatea
    for (const schedule of schedules) {
      const daySchedule = schedule.schedule[appDayOfWeek] || []
      if (!daySchedule.length) continue

      for (const interval of daySchedule) {
        let slotStart = new Date(currentDate)
        slotStart.setHours(Number(interval.startTime.split(':')[0]), Number(interval.startTime.split(':')[1]), 0, 0)
        const slotEnd = new Date(currentDate)
        slotEnd.setHours(Number(interval.endTime.split(':')[0]), Number(interval.endTime.split(':')[1]), 0, 0)

        while (addMinutes(slotStart, serviceDuration) <= slotEnd) {
          const slotFinish = addMinutes(slotStart, serviceDuration)

          // Verifică suprapuneri cu programări existente pentru acest stilist
          const stylistAppointments = appointments.filter((app) => app.stylistId === schedule.stylistId)
          const hasAppointmentConflict = stylistAppointments.some((app) => {
            const appStart = new Date(app.startTime)
            const appEnd = new Date(app.endTime)
            return slotStart < appEnd && slotFinish > appStart
          })

          // Verifică suprapuneri cu indisponibilități pentru acest stilist
          const stylistUnavailabilities = unavailabilities.filter((unav) => unav.stylistId === schedule.stylistId)
          const hasUnavailability = stylistUnavailabilities.some((unav) => {
            if (unav.allDay && new Date(unav.date).toDateString() === currentDate.toDateString()) return true
            if (!unav.startTime || !unav.endTime) return false
            const unavStart = new Date(currentDate)
            unavStart.setHours(Number(unav.startTime.split(':')[0]), Number(unav.startTime.split(':')[1]), 0, 0)
            const unavEnd = new Date(currentDate)
            unavEnd.setHours(Number(unav.endTime.split(':')[0]), Number(unav.endTime.split(':')[1]), 0, 0)
            return slotStart < unavEnd && slotFinish > unavStart
          })

          const isAvailable = !hasAppointmentConflict && !hasUnavailability

          // Verifică dacă slot-ul există deja pentru această perioadă
          const existingSlotIndex = slots.findIndex(
            (slot) => slot.start === slotStart.toISOString() && slot.end === slotFinish.toISOString(),
          )

          if (existingSlotIndex >= 0) {
            // Dacă slot-ul există și stilistul curent este disponibil, îl marcăm ca disponibil
            if (isAvailable) {
              slots[existingSlotIndex].available = true
              slots[existingSlotIndex].stylistId = schedule.stylistId
            }
          } else {
            // Adaugă un nou slot
            slots.push({
              start: slotStart.toISOString(),
              end: slotFinish.toISOString(),
              available: isAvailable,
              stylistId: isAvailable ? schedule.stylistId : undefined,
            })
          }

          slotStart = addMinutes(slotStart, serviceDuration)
        }
      }
    }
  }

  return slots
}
