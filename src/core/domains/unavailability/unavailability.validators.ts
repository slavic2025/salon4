// src/core/domains/unavailability/unavailability.validators.ts

import { z } from 'zod'

import { UNAVAILABILITY_LIMITS, UNAVAILABILITY_VALIDATION_MESSAGES } from './unavailability.constants'

/**
 * Validatori centralizați pentru domeniul unavailability
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

/**
 * Verifică dacă o dată este în viitor
 */
function isFutureDate(date: string): boolean {
  const today = new Date().toISOString().split('T')[0]
  return date >= today
}

// --- BASE VALIDATORS ---

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
  .refine(isFutureDate, {
    message: UNAVAILABILITY_VALIDATION_MESSAGES.DATE_IN_PAST,
  })

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

// --- COMPOSITE VALIDATORS ---

/**
 * Schema de bază pentru intervalul de timp
 */
const TimeRangeSchema = z.object({
  startTime: TimeValidator,
  endTime: TimeValidator,
  allDay: z.boolean().default(false),
})

/**
 * Schema de bază pentru toate formularele de indisponibilitate
 */
const BaseUnavailabilitySchema = z.object({
  stylistId: UuidValidator,
  date: DateValidator,
  cause: CauseValidator,
  description: DescriptionValidator,
})

// --- FORM VALIDATORS ---

/**
 * Validator pentru crearea unei indisponibilități (Form)
 */
export const CreateUnavailabilityFormValidator = BaseUnavailabilitySchema.merge(TimeRangeSchema).superRefine(
  (data, ctx) => {
    if (data.allDay) return

    // Validare că timpul este obligatoriu când nu este toată ziua
    if (!data.startTime?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: UNAVAILABILITY_VALIDATION_MESSAGES.START_TIME_REQUIRED,
        path: ['startTime'],
      })
      return
    }

    if (!data.endTime?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: UNAVAILABILITY_VALIDATION_MESSAGES.END_TIME_REQUIRED,
        path: ['endTime'],
      })
      return
    }

    // Validare că endTime > startTime
    if (data.endTime <= data.startTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: UNAVAILABILITY_VALIDATION_MESSAGES.END_TIME_AFTER_START,
        path: ['endTime'],
      })
      return
    }

    // Validare durata minimă
    const durationMinutes = calculateDurationMinutes(data.startTime, data.endTime)
    if (durationMinutes < UNAVAILABILITY_LIMITS.MIN_DURATION_MINUTES) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Durata minimă este ${UNAVAILABILITY_LIMITS.MIN_DURATION_MINUTES} minute`,
        path: ['endTime'],
      })
    }
  },
)

/**
 * Validator pentru actualizarea unei indisponibilității (Form)
 */
export const UpdateUnavailabilityFormValidator = BaseUnavailabilitySchema.partial()
  .merge(TimeRangeSchema.partial())
  .superRefine((data, ctx) => {
    // Validare condiționată pentru update
    if (data.allDay === false || (data.allDay === undefined && (data.startTime || data.endTime))) {
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

// --- ACTION VALIDATORS ---

/**
 * Schema pentru server actions (cu transformări)
 */
export const CreateUnavailabilityActionSchema = BaseUnavailabilitySchema.merge(
  z.object({
    date: z.string().transform((val) => val.trim()),
    startTime: z.string().nullable().optional(),
    endTime: z.string().nullable().optional(),
    allDay: z.boolean().default(false),
  }),
).superRefine((data, ctx) => {
  if (data.allDay) return

  if (!data.startTime || !data.endTime) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Ora de început și sfârșitul sunt obligatorii când nu este toată ziua',
    })
    return
  }

  if (data.endTime <= data.startTime) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Ora de sfârșit trebuie să fie după ora de început',
    })
  }
})

export const UpdateUnavailabilityActionSchema = BaseUnavailabilitySchema.partial().merge(
  z.object({
    date: z
      .string()
      .transform((val) => val.trim())
      .optional(),
    startTime: z.string().nullable().optional(),
    endTime: z.string().nullable().optional(),
    allDay: z.boolean().optional(),
  }),
)

// --- FILTER VALIDATORS ---

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
    if (data.startTime && data.endTime && data.endTime <= data.startTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: UNAVAILABILITY_VALIDATION_MESSAGES.END_TIME_AFTER_START,
        path: ['endTime'],
      })
    }
  })

/**
 * Validator pentru bulk operations complexe
 */
export const BulkUnavailabilityValidator = z
  .object({
    operations: z
      .array(
        z.object({
          action: z.enum(['create', 'update', 'delete']),
          id: UuidValidator.optional(),
          data: CreateUnavailabilityFormValidator.optional(),
        }),
      )
      .min(1, 'Cel puțin o operațiune este necesară'),
  })
  .superRefine((data, ctx) => {
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
 * Schema pentru server action bulk create (simplificată)
 */
export const CreateBulkUnavailabilityActionSchema = z.object({
  stylistId: UuidValidator,
  dates: z.array(z.string()).min(1, 'Cel puțin o dată este obligatorie'),
  startTime: z.string().nullable().optional(),
  endTime: z.string().nullable().optional(),
  cause: CauseValidator,
  allDay: z.boolean(),
  description: DescriptionValidator,
})

// --- TYPE EXPORTS ---

export type CreateUnavailabilityFormData = z.infer<typeof CreateUnavailabilityFormValidator>
export type UpdateUnavailabilityFormData = z.infer<typeof UpdateUnavailabilityFormValidator>
export type UnavailabilityFiltersData = z.infer<typeof UnavailabilityFiltersValidator>
export type ConflictCheckData = z.infer<typeof ConflictCheckValidator>
export type BulkUnavailabilityData = z.infer<typeof BulkUnavailabilityValidator>

// --- HELPER FUNCTIONS ---

/**
 * Validează un interval de timp
 */
export function validateTimeRange(startTime: string, endTime: string): boolean {
  if (!startTime || !endTime) return false

  const durationMinutes = calculateDurationMinutes(startTime, endTime)
  return durationMinutes > 0 && durationMinutes >= UNAVAILABILITY_LIMITS.MIN_DURATION_MINUTES
}

/**
 * Validează că o dată este în viitor
 */
export function validateFutureDate(date: string): boolean {
  return isFutureDate(date)
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
 * Validează datele pentru o indisponibilitate folosind validatori centralizați
 */
export function validateUnavailabilityData(
  data: unknown,
): { success: true; data: CreateUnavailabilityFormData } | { success: false; errors: Record<string, string> } {
  const result = CreateUnavailabilityFormValidator.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  return { success: false, errors: formatValidationErrors(result.error) }
}
