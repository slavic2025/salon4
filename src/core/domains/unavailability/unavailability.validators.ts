// src/core/domains/unavailability/unavailability.validators.ts

import { z } from 'zod'

import { UNAVAILABILITY_LIMITS, UNAVAILABILITY_VALIDATION_MESSAGES } from './unavailability.constants'

/**
 * Validatori pentru domeniul unavailability
 * Centralizează toată logica de validare cu Zod
 */

/**
 * Validator pentru ID-uri UUID
 */
export const UuidValidator = z.string().uuid(UNAVAILABILITY_VALIDATION_MESSAGES.STYLIST_ID_INVALID)

/**
 * Validator pentru dată (format ISO YYYY-MM-DD)
 */
export const DateValidator = z
  .string()
  .min(1, UNAVAILABILITY_VALIDATION_MESSAGES.DATE_REQUIRED)
  .regex(/^\d{4}-\d{2}-\d{2}$/, UNAVAILABILITY_VALIDATION_MESSAGES.DATE_INVALID)
  .refine(
    (date) => {
      // Verificare că data nu este în trecut
      const today = new Date().toISOString().split('T')[0]
      return date >= today
    },
    {
      message: UNAVAILABILITY_VALIDATION_MESSAGES.DATE_IN_PAST,
    },
  )

/**
 * Validator pentru timp (format HH:MM)
 */
export const TimeValidator = z
  .string()
  .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formatul timpului este invalid (HH:MM)')
  .optional()

/**
 * Validator pentru cauza indisponibilității
 */
export const CauseValidator = z.enum(['pauza', 'programare_offline', 'alta_situatie'], {
  required_error: UNAVAILABILITY_VALIDATION_MESSAGES.CAUSE_REQUIRED,
  invalid_type_error: UNAVAILABILITY_VALIDATION_MESSAGES.CAUSE_INVALID,
})

/**
 * Validator pentru descriere
 */
export const DescriptionValidator = z
  .string()
  .max(
    UNAVAILABILITY_LIMITS.MAX_DESCRIPTION_LENGTH,
    `Descrierea nu poate depăși ${UNAVAILABILITY_LIMITS.MAX_DESCRIPTION_LENGTH} caractere`,
  )
  .optional()

/**
 * Validator pentru crearea unei indisponibilități (Form)
 */
export const CreateUnavailabilityFormValidator = z
  .object({
    stylistId: UuidValidator,
    date: DateValidator,
    startTime: TimeValidator,
    endTime: TimeValidator,
    cause: CauseValidator,
    allDay: z.boolean().default(false),
    description: DescriptionValidator,
  })
  .superRefine((data, ctx) => {
    // Validare condiționată: dacă nu este all_day, start_time și end_time sunt obligatorii
    if (!data.allDay) {
      if (!data.startTime?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: UNAVAILABILITY_VALIDATION_MESSAGES.START_TIME_REQUIRED,
          path: ['startTime'],
        })
      }

      if (!data.endTime?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: UNAVAILABILITY_VALIDATION_MESSAGES.END_TIME_REQUIRED,
          path: ['endTime'],
        })
      }

      // Validare că end_time > start_time
      if (data.startTime && data.endTime && data.endTime <= data.startTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: UNAVAILABILITY_VALIDATION_MESSAGES.END_TIME_AFTER_START,
          path: ['endTime'],
        })
      }

      // Validare durata minimă
      if (data.startTime && data.endTime) {
        const startMinutes = timeToMinutes(data.startTime)
        const endMinutes = timeToMinutes(data.endTime)
        const durationMinutes = endMinutes - startMinutes

        if (durationMinutes < UNAVAILABILITY_LIMITS.MIN_DURATION_MINUTES) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Durata minimă este ${UNAVAILABILITY_LIMITS.MIN_DURATION_MINUTES} minute`,
            path: ['endTime'],
          })
        }
      }
    }
  })

/**
 * Validator pentru actualizarea unei indisponibilității (Form)
 */
export const UpdateUnavailabilityFormValidator = z
  .object({
    stylistId: UuidValidator.optional(),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, UNAVAILABILITY_VALIDATION_MESSAGES.DATE_INVALID)
      .optional(),
    startTime: TimeValidator,
    endTime: TimeValidator,
    cause: CauseValidator.optional(),
    allDay: z.boolean().optional(),
    description: DescriptionValidator,
  })
  .superRefine((data, ctx) => {
    // Doar dacă sunt provide date de timp și nu este all_day
    if (data.allDay === false || (data.allDay === undefined && (data.startTime || data.endTime))) {
      // Dacă nu este all_day explicit, aplicăm validările de timp
      if (data.startTime !== undefined && !data.startTime?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: UNAVAILABILITY_VALIDATION_MESSAGES.START_TIME_REQUIRED,
          path: ['startTime'],
        })
      }

      if (data.endTime !== undefined && !data.endTime?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: UNAVAILABILITY_VALIDATION_MESSAGES.END_TIME_REQUIRED,
          path: ['endTime'],
        })
      }

      if (data.startTime && data.endTime && data.endTime <= data.startTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: UNAVAILABILITY_VALIDATION_MESSAGES.END_TIME_AFTER_START,
          path: ['endTime'],
        })
      }
    }
  })

/**
 * Validator pentru filtrul de căutare
 */
export const UnavailabilityFiltersValidator = z
  .object({
    stylistId: UuidValidator.optional(),
    dateFrom: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, UNAVAILABILITY_VALIDATION_MESSAGES.DATE_INVALID)
      .optional(),
    dateTo: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, UNAVAILABILITY_VALIDATION_MESSAGES.DATE_INVALID)
      .optional(),
    cause: CauseValidator.optional(),
    allDay: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    // Validare că dateFrom <= dateTo
    if (data.dateFrom && data.dateTo && data.dateFrom > data.dateTo) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Data de început nu poate fi după data de sfârșit',
        path: ['dateTo'],
      })
    }
  })

/**
 * Validator pentru verificarea conflictelor
 */
export const ConflictCheckValidator = z
  .object({
    stylistId: UuidValidator,
    date: DateValidator,
    startTime: TimeValidator,
    endTime: TimeValidator,
    excludeId: UuidValidator.optional(),
  })
  .superRefine((data, ctx) => {
    // Validare că end_time > start_time pentru verificarea conflictelor
    if (data.startTime && data.endTime && data.endTime <= data.startTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: UNAVAILABILITY_VALIDATION_MESSAGES.END_TIME_AFTER_START,
        path: ['endTime'],
      })
    }
  })

/**
 * Validator pentru bulk operations
 */
export const BulkUnavailabilityValidator = z
  .object({
    operations: z
      .array(
        z.object({
          action: z.enum(['create', 'update', 'delete']),
          id: UuidValidator.optional(), // Obligatoriu pentru update/delete
          data: CreateUnavailabilityFormValidator.optional(), // Obligatoriu pentru create/update
        }),
      )
      .min(1, 'Cel puțin o operațiune este necesară'),
  })
  .superRefine((data, ctx) => {
    // Validare că fiecare operațiune are datele necesare
    data.operations.forEach((operation, index) => {
      if ((operation.action === 'update' || operation.action === 'delete') && !operation.id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'ID-ul este obligatoriu pentru operațiunile de actualizare și ștergere',
          path: ['operations', index, 'id'],
        })
      }

      if ((operation.action === 'create' || operation.action === 'update') && !operation.data) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Datele sunt obligatorii pentru operațiunile de creare și actualizare',
          path: ['operations', index, 'data'],
        })
      }
    })
  })

/**
 * Tipuri TypeScript derivate din validatori
 */
export type CreateUnavailabilityFormData = z.infer<typeof CreateUnavailabilityFormValidator>
export type UpdateUnavailabilityFormData = z.infer<typeof UpdateUnavailabilityFormValidator>
export type UnavailabilityFiltersData = z.infer<typeof UnavailabilityFiltersValidator>
export type ConflictCheckData = z.infer<typeof ConflictCheckValidator>
export type BulkUnavailabilityData = z.infer<typeof BulkUnavailabilityValidator>

// --- HELPER FUNCTIONS ---

/**
 * Funcție helper pentru conversia timpului în minute
 */
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

/**
 * Funcție helper pentru validarea unui interval de timp
 */
export function validateTimeRange(startTime: string, endTime: string): boolean {
  if (!startTime || !endTime) return false

  const start = timeToMinutes(startTime)
  const end = timeToMinutes(endTime)

  return end > start && end - start >= UNAVAILABILITY_LIMITS.MIN_DURATION_MINUTES
}

/**
 * Funcție helper pentru validarea că o dată este în viitor
 */
export function validateFutureDate(date: string): boolean {
  const today = new Date().toISOString().split('T')[0]
  return date >= today
}

/**
 * Funcție helper pentru formatarea erorilor de validare Zod
 */
export function formatValidationErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {}

  error.errors.forEach((err) => {
    const path = err.path.join('.')
    errors[path] = err.message
  })

  return errors
}
