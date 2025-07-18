// src/core/domains/work-schedule/workSchedule.validators.ts

import { z } from 'zod'

import { WORK_SCHEDULE_MESSAGES } from './workSchedule.constants'

/**
 * Validatori centralizați pentru domeniul work-schedule
 * Toată logica de validare este concentrată aici pentru a evita duplicările
 */

// --- UTILITY FUNCTIONS ---

/**
 * Convertește timpul din format HH:MM în minute
 */
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

/**
 * Calculează durata între două timpuri în minute
 */
function calculateDurationMinutes(startTime: string, endTime: string): number {
  const startMinutes = timeToMinutes(startTime)
  const endMinutes = timeToMinutes(endTime)
  return endMinutes - startMinutes
}

// --- BASE VALIDATORS ---

/**
 * Validator pentru ID-uri UUID
 */
export const UuidValidator = z.string().uuid(WORK_SCHEDULE_MESSAGES.VALIDATION.STYLIST_ID_REQUIRED)

/**
 * Validator pentru ziua săptămânii
 */
export const DayOfWeekValidator = z.coerce
  .number()
  .int()
  .min(0, WORK_SCHEDULE_MESSAGES.VALIDATION.DAY_OF_WEEK_INVALID)
  .max(6, WORK_SCHEDULE_MESSAGES.VALIDATION.DAY_OF_WEEK_INVALID)

/**
 * Validator pentru timp (format HH:MM)
 */
export const TimeValidator = z
  .string()
  .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, WORK_SCHEDULE_MESSAGES.VALIDATION.TIME_FORMAT_INVALID)
  .refine((time) => {
    // Verificăm că ora este validă (00:00 - 23:59)
    const [hours, minutes] = time.split(':').map(Number)
    return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59
  }, WORK_SCHEDULE_MESSAGES.VALIDATION.TIME_FORMAT_INVALID)

// --- COMPOSITE VALIDATORS ---

/**
 * Schema de bază pentru intervalul de timp
 */
const TimeRangeSchema = z.object({
  startTime: TimeValidator,
  endTime: TimeValidator,
})

/**
 * Schema de bază pentru toate formularele de program
 */
const BaseWorkScheduleSchema = z.object({
  stylistId: UuidValidator,
  dayOfWeek: DayOfWeekValidator,
  startTime: TimeValidator,
  endTime: TimeValidator,
})

/**
 * Funcție pentru validarea ordinii timpului
 */
function validateTimeOrder(data: { startTime: string; endTime: string }): boolean {
  const [startHours, startMinutes] = data.startTime.split(':').map(Number)
  const [endHours, endMinutes] = data.endTime.split(':').map(Number)

  const startTotalMinutes = startHours * 60 + startMinutes
  const endTotalMinutes = endHours * 60 + endMinutes

  return endTotalMinutes > startTotalMinutes
}

// --- FORM VALIDATORS ---

/**
 * Validator pentru crearea unui program (Form)
 * Excludem stylistId din formular pentru că se va adăuga automat
 */
export const CreateWorkScheduleFormValidator = z
  .object({
    dayOfWeek: DayOfWeekValidator,
    startTime: TimeValidator,
    endTime: TimeValidator,
  })
  .refine(validateTimeOrder, {
    message: WORK_SCHEDULE_MESSAGES.VALIDATION.END_TIME_AFTER_START,
    path: ['endTime'],
  })

/**
 * Validator pentru actualizarea unui program (Form)
 */
export const UpdateWorkScheduleFormValidator = z
  .object({
    dayOfWeek: DayOfWeekValidator.optional(),
    startTime: TimeValidator.optional(),
    endTime: TimeValidator.optional(),
  })
  .superRefine((data, ctx) => {
    // Validare condiționată pentru update
    if (data.startTime && data.endTime && !validateTimeOrder({ startTime: data.startTime, endTime: data.endTime })) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: WORK_SCHEDULE_MESSAGES.VALIDATION.END_TIME_AFTER_START,
        path: ['endTime'],
      })
    }
  })

// --- ACTION VALIDATORS ---

/**
 * Schema pentru server actions (cu transformări)
 */
export const CreateWorkScheduleActionSchema = BaseWorkScheduleSchema.refine(validateTimeOrder, {
  message: WORK_SCHEDULE_MESSAGES.VALIDATION.END_TIME_AFTER_START,
  path: ['endTime'],
})

export const UpdateWorkScheduleActionSchema = BaseWorkScheduleSchema.extend({
  id: z.string().uuid(WORK_SCHEDULE_MESSAGES.VALIDATION.ID_REQUIRED),
}).refine(validateTimeOrder, {
  message: WORK_SCHEDULE_MESSAGES.VALIDATION.END_TIME_AFTER_START,
  path: ['endTime'],
})

export const DeleteWorkScheduleActionSchema = z.object({
  id: z.string().uuid(WORK_SCHEDULE_MESSAGES.VALIDATION.ID_REQUIRED),
})

// --- OVERLAP VALIDATORS ---

/**
 * Schema pentru validarea suprapunerilor
 */
export const CheckOverlapSchema = z
  .object({
    stylistId: z.string().uuid(),
    dayOfWeek: z.number().int().min(0).max(6),
    startTime: TimeValidator,
    endTime: TimeValidator,
    excludeId: z.string().uuid().optional(), // Pentru a exclude intervalul curent la editare
  })
  .refine(validateTimeOrder, {
    message: WORK_SCHEDULE_MESSAGES.VALIDATION.END_TIME_AFTER_START,
    path: ['endTime'],
  })

// --- FILTER VALIDATORS ---

/**
 * Validator pentru filtrul de căutare
 */
export const WorkScheduleFiltersValidator = z.object({
  stylistId: UuidValidator.optional(),
  dayOfWeek: DayOfWeekValidator.optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
})

// --- TYPE EXPORTS ---

export type CreateWorkScheduleFormData = z.infer<typeof CreateWorkScheduleFormValidator>
export type UpdateWorkScheduleFormData = z.infer<typeof UpdateWorkScheduleFormValidator>
export type WorkScheduleFiltersData = z.infer<typeof WorkScheduleFiltersValidator>
export type CheckOverlapData = z.infer<typeof CheckOverlapSchema>

// --- HELPER FUNCTIONS ---

/**
 * Validează un interval de timp
 */
export function validateTimeRange(startTime: string, endTime: string): boolean {
  if (!startTime || !endTime) return false

  const durationMinutes = calculateDurationMinutes(startTime, endTime)
  return durationMinutes > 0
}

/**
 * Formatează erorile de validare Zod într-un obiect simplu
 */
export function formatValidationErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {}

  error.errors.forEach((err) => {
    const path = err.path.join('.')
    errors[path] = err.message
  })

  return errors
}

/**
 * Validează datele pentru un program folosind validatori centralizați
 */
export function validateWorkScheduleData(
  data: unknown,
): { success: true; data: CreateWorkScheduleFormData } | { success: false; errors: Record<string, string> } {
  const result = CreateWorkScheduleFormValidator.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  return { success: false, errors: formatValidationErrors(result.error) }
}
