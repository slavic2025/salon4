// src/core/domains/services/service.validators.ts

import { z } from 'zod'

import { SERVICE_LIMITS, SERVICE_VALIDATION_MESSAGES } from './service.constants'

/**
 * Validatori centralizați pentru domeniul services
 * Toată logica de validare este concentrată aici pentru a evita duplicările
 */

// --- BASE VALIDATORS ---

/**
 * Validator pentru ID-uri UUID
 */
export const UuidValidator = z.string().uuid(SERVICE_VALIDATION_MESSAGES.ID_INVALID)

/**
 * Validator pentru numele serviciului
 */
export const NameValidator = z
  .string()
  .min(1, SERVICE_VALIDATION_MESSAGES.NAME_REQUIRED)
  .min(SERVICE_LIMITS.MIN_NAME_LENGTH, SERVICE_VALIDATION_MESSAGES.NAME_MIN_LENGTH)
  .max(SERVICE_LIMITS.MAX_NAME_LENGTH, SERVICE_VALIDATION_MESSAGES.NAME_MAX_LENGTH)
  .trim()

/**
 * Validator pentru descrierea serviciului
 */
export const DescriptionValidator = z
  .string()
  .max(SERVICE_LIMITS.MAX_DESCRIPTION_LENGTH, SERVICE_VALIDATION_MESSAGES.DESCRIPTION_MAX_LENGTH)
  .optional()

/**
 * Validator pentru prețul serviciului
 */
export const PriceValidator = z
  .number()
  .min(SERVICE_LIMITS.MIN_PRICE, SERVICE_VALIDATION_MESSAGES.PRICE_POSITIVE)
  .max(SERVICE_LIMITS.MAX_PRICE, SERVICE_VALIDATION_MESSAGES.PRICE_MAX_VALUE)
  .or(z.string().transform((val) => parseFloat(val)))

/**
 * Validator pentru durata serviciului
 */
export const DurationValidator = z
  .number()
  .int()
  .min(SERVICE_LIMITS.MIN_DURATION, SERVICE_VALIDATION_MESSAGES.DURATION_POSITIVE)
  .max(SERVICE_LIMITS.MAX_DURATION, SERVICE_VALIDATION_MESSAGES.DURATION_MAX_VALUE)
  .or(z.string().transform((val) => parseInt(val, 10)))

/**
 * Validator pentru categoria serviciului
 */
export const CategoryValidator = z.enum(['haircut', 'coloring', 'styling', 'treatment', 'other'], {
  required_error: SERVICE_VALIDATION_MESSAGES.CATEGORY_REQUIRED,
  invalid_type_error: SERVICE_VALIDATION_MESSAGES.CATEGORY_INVALID,
})

/**
 * Validator pentru statusul activ/inactiv
 */
export const IsActiveValidator = z.boolean()

// --- FORM VALIDATORS ---

/**
 * Schema de bază pentru toate formularele de serviciu
 */
const BaseServiceSchema = z.object({
  name: NameValidator,
  description: DescriptionValidator,
  price: z.coerce
    .number()
    .min(SERVICE_LIMITS.MIN_PRICE, SERVICE_VALIDATION_MESSAGES.PRICE_POSITIVE)
    .max(SERVICE_LIMITS.MAX_PRICE, SERVICE_VALIDATION_MESSAGES.PRICE_MAX_VALUE),
  duration: z.coerce
    .number()
    .int()
    .min(SERVICE_LIMITS.MIN_DURATION, SERVICE_VALIDATION_MESSAGES.DURATION_POSITIVE)
    .max(SERVICE_LIMITS.MAX_DURATION, SERVICE_VALIDATION_MESSAGES.DURATION_MAX_VALUE),
  category: CategoryValidator,
  isActive: IsActiveValidator,
})

/**
 * Validator pentru crearea unui serviciu (Form)
 */
export const CreateServiceFormValidator = BaseServiceSchema

/**
 * Validator pentru actualizarea unui serviciu (Form)
 */
export const UpdateServiceFormValidator = BaseServiceSchema.partial()

// --- ACTION VALIDATORS ---

/**
 * Schema pentru server actions (cu transformări)
 */
export const CreateServiceActionSchema = BaseServiceSchema.extend({
  price: z.coerce
    .number()
    .min(SERVICE_LIMITS.MIN_PRICE, SERVICE_VALIDATION_MESSAGES.PRICE_POSITIVE)
    .max(SERVICE_LIMITS.MAX_PRICE, SERVICE_VALIDATION_MESSAGES.PRICE_MAX_VALUE),
  duration: z.coerce
    .number()
    .int()
    .min(SERVICE_LIMITS.MIN_DURATION, SERVICE_VALIDATION_MESSAGES.DURATION_POSITIVE)
    .max(SERVICE_LIMITS.MAX_DURATION, SERVICE_VALIDATION_MESSAGES.DURATION_MAX_VALUE),
})

export const UpdateServiceActionSchema = BaseServiceSchema.partial().extend({
  id: UuidValidator,
  price: z.coerce
    .number()
    .min(SERVICE_LIMITS.MIN_PRICE, SERVICE_VALIDATION_MESSAGES.PRICE_POSITIVE)
    .max(SERVICE_LIMITS.MAX_PRICE, SERVICE_VALIDATION_MESSAGES.PRICE_MAX_VALUE)
    .optional(),
  duration: z.coerce
    .number()
    .int()
    .min(SERVICE_LIMITS.MIN_DURATION, SERVICE_VALIDATION_MESSAGES.DURATION_POSITIVE)
    .max(SERVICE_LIMITS.MAX_DURATION, SERVICE_VALIDATION_MESSAGES.DURATION_MAX_VALUE)
    .optional(),
})

/**
 * Schema pentru acțiunea de ștergere
 */
export const DeleteServiceActionSchema = z.object({
  id: UuidValidator,
})

// --- FILTER VALIDATORS ---

/**
 * Validator pentru filtrul de căutare
 */
export const ServiceFiltersValidator = z
  .object({
    category: CategoryValidator.optional(),
    isActive: z.boolean().optional(),
    search: z.string().optional(),
    limit: z.number().min(1).max(SERVICE_LIMITS.MAX_PER_PAGE).optional(),
    offset: z.number().min(0).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.limit && data.limit > SERVICE_LIMITS.MAX_PER_PAGE) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Numărul maxim de servicii pe pagină este ${SERVICE_LIMITS.MAX_PER_PAGE}`,
        path: ['limit'],
      })
    }
  })

// --- BULK OPERATIONS VALIDATORS ---

/**
 * Validator pentru operațiuni bulk
 */
export const BulkServiceValidator = z
  .object({
    operations: z
      .array(
        z.object({
          action: z.enum(['create', 'update', 'delete']),
          id: UuidValidator.optional(),
          data: CreateServiceFormValidator.optional(),
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

// --- TYPE EXPORTS ---

export type CreateServiceFormData = z.infer<typeof CreateServiceFormValidator>
export type UpdateServiceFormData = z.infer<typeof UpdateServiceFormValidator>
export type ServiceFiltersData = z.infer<typeof ServiceFiltersValidator>
export type BulkServiceData = z.infer<typeof BulkServiceValidator>

// --- HELPER FUNCTIONS ---

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
 * Validează datele pentru un serviciu folosind validatori centralizați
 */
export function validateServiceData(
  data: unknown,
): { success: true; data: CreateServiceFormData } | { success: false; errors: Record<string, string> } {
  const result = CreateServiceFormValidator.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  return { success: false, errors: formatValidationErrors(result.error) }
}

/**
 * Validează datele pentru actualizarea unui serviciu
 */
export function validateUpdateServiceData(
  data: unknown,
): { success: true; data: UpdateServiceFormData } | { success: false; errors: Record<string, string> } {
  const result = UpdateServiceFormValidator.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  return { success: false, errors: formatValidationErrors(result.error) }
}

/**
 * Validează un preț
 */
export function validatePrice(price: number): boolean {
  return price >= SERVICE_LIMITS.MIN_PRICE && price <= SERVICE_LIMITS.MAX_PRICE
}

/**
 * Validează o durată
 */
export function validateDuration(duration: number): boolean {
  return duration >= SERVICE_LIMITS.MIN_DURATION && duration <= SERVICE_LIMITS.MAX_DURATION
}

/**
 * Validează un nume de serviciu
 */
export function validateServiceName(name: string): boolean {
  return name.length >= SERVICE_LIMITS.MIN_NAME_LENGTH && name.length <= SERVICE_LIMITS.MAX_NAME_LENGTH
}
