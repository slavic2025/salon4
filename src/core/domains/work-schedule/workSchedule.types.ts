// src/core/domains/work-schedule/workSchedule.types.ts

import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

import { workSchedules } from '@/db/schema/work-schedules'

import { WORK_SCHEDULE_MESSAGES } from './workSchedule.constants'

// --- Tipuri de Bază generate din Schema Drizzle ---
export const selectWorkScheduleSchema = createSelectSchema(workSchedules)
export const insertWorkScheduleSchema = createInsertSchema(workSchedules)

export type WorkSchedule = typeof workSchedules.$inferSelect
export type NewWorkSchedule = typeof workSchedules.$inferInsert

// --- Tipuri pentru ziua săptămânii ---
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6

// Validare customă pentru formatul timpului HH:MM
const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/

const timeSchema = z
  .string()
  .regex(timeRegex, WORK_SCHEDULE_MESSAGES.VALIDATION.TIME_FORMAT_INVALID)
  .refine((time) => {
    // Verificăm că ora este validă (00:00 - 23:59)
    const [hours, minutes] = time.split(':').map(Number)
    return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59
  }, WORK_SCHEDULE_MESSAGES.VALIDATION.TIME_FORMAT_INVALID)

// --- Schema de bază pentru interval de program ---
const baseWorkScheduleSchema = z.object({
  stylistId: z.string().uuid(WORK_SCHEDULE_MESSAGES.VALIDATION.STYLIST_ID_REQUIRED),
  dayOfWeek: z.coerce
    .number()
    .int()
    .min(0, WORK_SCHEDULE_MESSAGES.VALIDATION.DAY_OF_WEEK_INVALID)
    .max(6, WORK_SCHEDULE_MESSAGES.VALIDATION.DAY_OF_WEEK_INVALID),
  startTime: timeSchema,
  endTime: timeSchema,
})

// Funcție pentru validarea timpului
const validateTimeOrder = (data: { startTime: string; endTime: string }) => {
  const [startHours, startMinutes] = data.startTime.split(':').map(Number)
  const [endHours, endMinutes] = data.endTime.split(':').map(Number)

  const startTotalMinutes = startHours * 60 + startMinutes
  const endTotalMinutes = endHours * 60 + endMinutes

  return endTotalMinutes > startTotalMinutes
}

// --- Schema pentru Formularul din UI (Adăugare / Editare) ---
export const workScheduleFormSchema = baseWorkScheduleSchema.refine(validateTimeOrder, {
  message: WORK_SCHEDULE_MESSAGES.VALIDATION.END_TIME_AFTER_START,
  path: ['endTime'],
})

export type WorkScheduleFormValues = z.infer<typeof workScheduleFormSchema>

// --- Scheme pentru Acțiunile de pe Server ---

// Schema pentru acțiunea de ADĂUGARE
export const createWorkScheduleActionSchema = baseWorkScheduleSchema.refine(validateTimeOrder, {
  message: WORK_SCHEDULE_MESSAGES.VALIDATION.END_TIME_AFTER_START,
  path: ['endTime'],
})
export type CreateWorkSchedulePayload = z.infer<typeof createWorkScheduleActionSchema>

// Schema pentru acțiunea de EDITARE
export const updateWorkScheduleActionSchema = baseWorkScheduleSchema
  .extend({
    id: z.string().uuid(WORK_SCHEDULE_MESSAGES.VALIDATION.ID_REQUIRED),
  })
  .refine(validateTimeOrder, {
    message: WORK_SCHEDULE_MESSAGES.VALIDATION.END_TIME_AFTER_START,
    path: ['endTime'],
  })
export type UpdateWorkSchedulePayload = z.infer<typeof updateWorkScheduleActionSchema>

// Schema pentru acțiunea de ȘTERGERE
export const deleteWorkScheduleActionSchema = z.object({
  id: z.string().uuid(WORK_SCHEDULE_MESSAGES.VALIDATION.ID_REQUIRED),
})
export type DeleteWorkSchedulePayload = z.infer<typeof deleteWorkScheduleActionSchema>

// --- Tipuri pentru afișare și filtrare ---

// Tip pentru programul grupat pe zile
export type WorkSchedulesByDay = {
  [key in DayOfWeek]?: WorkSchedule[]
}

// Tip pentru intervalul de timp
export type TimeInterval = {
  start: string
  end: string
}

// Tip pentru programul unui stilist organizat pe zile
export type StylistWeeklySchedule = {
  stylistId: string
  stylistName?: string
  schedule: WorkSchedulesByDay
}

// --- Schema pentru validarea suprapunerilor ---
export const checkOverlapSchema = z.object({
  stylistId: z.string().uuid(),
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: timeSchema,
  endTime: timeSchema,
  excludeId: z.string().uuid().optional(), // Pentru a exclude intervalul curent la editare
})

export type CheckOverlapPayload = z.infer<typeof checkOverlapSchema>
