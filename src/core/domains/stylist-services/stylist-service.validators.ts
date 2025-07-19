// src/core/domains/stylist-services/stylist-service.validators.ts

import { z } from 'zod'

import {
  STYLIST_SERVICE_FORMATS,
  STYLIST_SERVICE_LINK_MESSAGES,
  STYLIST_SERVICE_VALIDATION,
} from './stylist-service.constants'

/**
 * Validatori centralizați pentru domeniul stylist-services
 * Toată logica de validare este concentrată aici pentru a evita duplicările
 */

// --- UTILITY FUNCTIONS ---

/**
 * Validează formatul prețului
 */
function validatePriceFormat(price: string | null | undefined): boolean {
  if (!price) return true // Prețul este opțional
  return STYLIST_SERVICE_FORMATS.PRICE_PATTERN.test(price)
}

/**
 * Validează că prețul este în intervalul valid
 */
function validatePriceRange(price: string | null | undefined): boolean {
  if (!price) return true // Prețul este opțional
  const numPrice = parseFloat(price)
  return numPrice >= STYLIST_SERVICE_VALIDATION.MIN_PRICE && numPrice <= STYLIST_SERVICE_VALIDATION.MAX_PRICE
}

/**
 * Validează că durata este în intervalul valid
 */
function validateDurationRange(duration: number | null | undefined): boolean {
  if (!duration) return true // Durata este opțională
  return duration >= STYLIST_SERVICE_VALIDATION.MIN_DURATION && duration <= STYLIST_SERVICE_VALIDATION.MAX_DURATION
}

// --- BASE VALIDATORS ---

/**
 * Validator pentru ID-uri UUID
 */
export const UuidValidator = z.string().uuid()

/**
 * Validator pentru ID-ul stilistului
 */
export const StylistIdValidator = UuidValidator.min(1, STYLIST_SERVICE_LINK_MESSAGES.VALIDATION.STYLIST_ID_REQUIRED)

/**
 * Validator pentru ID-ul serviciului
 */
export const ServiceIdValidator = UuidValidator.min(1, STYLIST_SERVICE_LINK_MESSAGES.VALIDATION.SERVICE_ID_REQUIRED)

/**
 * Validator pentru prețul personalizat
 */
export const CustomPriceValidator = z
  .string()
  .optional()
  .nullable()
  .refine(validatePriceFormat, {
    message: STYLIST_SERVICE_LINK_MESSAGES.VALIDATION.CUSTOM_PRICE_FORMAT,
  })
  .refine(validatePriceRange, {
    message: STYLIST_SERVICE_LINK_MESSAGES.VALIDATION.CUSTOM_PRICE_INVALID,
  })

/**
 * Validator pentru durata personalizată
 */
export const CustomDurationValidator = z.coerce
  .number()
  .int()
  .positive(STYLIST_SERVICE_LINK_MESSAGES.VALIDATION.CUSTOM_DURATION_INVALID)
  .optional()
  .nullable()
  .refine(validateDurationRange, {
    message: STYLIST_SERVICE_LINK_MESSAGES.VALIDATION.CUSTOM_DURATION_MIN,
  })

// --- COMPOSITE VALIDATORS ---

/**
 * Schema de bază pentru toate formularele de stylist-service
 */
const BaseStylistServiceSchema = z.object({
  stylistId: StylistIdValidator,
  serviceId: ServiceIdValidator,
  customPrice: CustomPriceValidator,
  customDuration: CustomDurationValidator,
})

/**
 * Schema pentru validarea unicității
 */
const UniquenessSchema = z.object({
  stylistId: StylistIdValidator,
  serviceId: ServiceIdValidator,
})

// --- FORM VALIDATORS ---

/**
 * Validator pentru crearea unei legături stylist-service (Form)
 * Excludem stylistId din formular pentru că se va adăuga automat
 */
export const CreateStylistServiceLinkFormValidator = z.object({
  serviceId: ServiceIdValidator,
  customPrice: CustomPriceValidator,
  customDuration: CustomDurationValidator,
})

/**
 * Validator pentru actualizarea unei legături stylist-service (Form)
 */
export const UpdateStylistServiceLinkFormValidator = z.object({
  customPrice: CustomPriceValidator,
  customDuration: CustomDurationValidator,
})

// --- ACTION VALIDATORS ---

/**
 * Schema pentru server actions (cu transformări)
 */
export const CreateStylistServiceLinkActionSchema = BaseStylistServiceSchema

export const UpdateStylistServiceLinkActionSchema = BaseStylistServiceSchema

export const DeleteStylistServiceLinkActionSchema = z.object({
  stylistId: StylistIdValidator,
  serviceId: ServiceIdValidator,
})

// --- UNIQUENESS VALIDATORS ---

/**
 * Schema pentru validarea unicității
 */
export const CheckUniquenessSchema = UniquenessSchema

// --- FILTER VALIDATORS ---

/**
 * Validator pentru filtrul de căutare
 */
export const StylistServiceFiltersValidator = z.object({
  stylistId: StylistIdValidator.optional(),
  serviceId: ServiceIdValidator.optional(),
  hasCustomPrice: z.boolean().optional(),
  hasCustomDuration: z.boolean().optional(),
})

// --- TYPE EXPORTS ---

export type CreateStylistServiceLinkFormData = z.infer<typeof CreateStylistServiceLinkFormValidator>
export type UpdateStylistServiceLinkFormData = z.infer<typeof UpdateStylistServiceLinkFormValidator>
export type StylistServiceFiltersData = z.infer<typeof StylistServiceFiltersValidator>
export type CheckUniquenessData = z.infer<typeof CheckUniquenessSchema>

// --- HELPER FUNCTIONS ---

/**
 * Validează datele pentru o legătură stylist-service folosind validatori centralizați
 */
export function validateStylistServiceData(
  data: unknown,
): { success: true; data: CreateStylistServiceLinkFormData } | { success: false; errors: Record<string, string> } {
  const result = CreateStylistServiceLinkFormValidator.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  return { success: false, errors: formatValidationErrors(result.error) }
}

/**
 * Validează datele pentru actualizarea unei legături stylist-service
 */
export function validateUpdateStylistServiceData(
  data: unknown,
): { success: true; data: UpdateStylistServiceLinkFormData } | { success: false; errors: Record<string, string> } {
  const result = UpdateStylistServiceLinkFormValidator.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  return { success: false, errors: formatValidationErrors(result.error) }
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
 * Validează un preț personalizat
 */
export function validateCustomPrice(price: string | null | undefined): boolean {
  if (!price) return true // Prețul este opțional
  return validatePriceFormat(price) && validatePriceRange(price)
}

/**
 * Validează o durată personalizată
 */
export function validateCustomDuration(duration: number | null | undefined): boolean {
  if (!duration) return true // Durata este opțională
  return duration > 0 && validateDurationRange(duration)
}

/**
 * Validează o legătură stylist-service pentru unicitate
 */
export function validateStylistServiceUniqueness(
  stylistId: string,
  serviceId: string,
): { success: true } | { success: false; errors: Record<string, string> } {
  const result = CheckUniquenessSchema.safeParse({ stylistId, serviceId })

  if (result.success) {
    return { success: true }
  }

  return { success: false, errors: formatValidationErrors(result.error) }
}
