// src/core/domains/stylists/stylist.validators.ts

import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

import { stylists } from '@/db/schema/stylists'

import { STYLIST_MESSAGES } from './stylist.constants'

// --- DATABASE SCHEMAS ---

/**
 * Scheme generate automat din schema Drizzle
 */
export const selectStylistSchema = createSelectSchema(stylists)
export const insertStylistSchema = createInsertSchema(stylists)

// --- BASE VALIDATORS ---

/**
 * Validator pentru numele complet
 */
export const FullNameValidator = z
  .string()
  .min(1, STYLIST_MESSAGES.VALIDATION.FULL_NAME_REQUIRED)
  .min(3, STYLIST_MESSAGES.VALIDATION.FULL_NAME_MIN_LENGTH)
  .trim()

/**
 * Validator pentru email
 */
export const EmailValidator = z.string().email(STYLIST_MESSAGES.VALIDATION.INVALID_EMAIL).trim().toLowerCase()

/**
 * Validator pentru telefon
 */
export const PhoneValidator = z.string().min(9, STYLIST_MESSAGES.VALIDATION.PHONE_TOO_SHORT).trim()

/**
 * Validator pentru descriere
 */
export const DescriptionValidator = z.string().trim().min(1, 'Descrierea este obligatorie')

/**
 * Validator pentru ID UUID
 */
export const IdValidator = z.string().uuid(STYLIST_MESSAGES.VALIDATION.ID_REQUIRED)

// --- FORM VALIDATORS ---

/**
 * Schema pentru formularul de adăugare/editare stylist
 */
export const StylistFormValidator = z.object({
  fullName: FullNameValidator,
  email: EmailValidator,
  phone: PhoneValidator,
  description: DescriptionValidator,
  isActive: z.boolean(),
})

/**
 * Schema pentru formularul de actualizare (toate câmpurile opționale)
 */
export const UpdateStylistFormValidator = StylistFormValidator.partial().extend({
  id: IdValidator,
})

// --- ACTION VALIDATORS ---

/**
 * Schema pentru acțiunea de creare stylist
 */
export const CreateStylistActionSchema = StylistFormValidator

/**
 * Schema pentru acțiunea de actualizare stylist
 */
export const UpdateStylistActionSchema = StylistFormValidator.extend({
  id: IdValidator,
})

/**
 * Schema pentru acțiunea de ștergere stylist
 */
export const DeleteStylistActionSchema = z.object({
  id: IdValidator,
})

// --- FILTER VALIDATORS ---

/**
 * Schema pentru filtrarea stiliștilor
 */
export const StylistFiltersValidator = z.object({
  isActive: z.boolean().optional(),
  search: z.string().trim().optional(),
  limit: z.number().min(1).max(100).optional(),
  offset: z.number().min(0).optional(),
})

// --- TYPE EXPORTS ---

export type StylistFormData = z.infer<typeof StylistFormValidator>
export type UpdateStylistFormData = z.infer<typeof UpdateStylistFormValidator>
export type StylistFiltersData = z.infer<typeof StylistFiltersValidator>

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
 * Validează datele pentru un stylist folosind validatori centralizați
 */
export function validateStylistData(
  data: unknown,
): { success: true; data: StylistFormData } | { success: false; errors: Record<string, string> } {
  const result = StylistFormValidator.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  return { success: false, errors: formatValidationErrors(result.error) }
}

/**
 * Validează datele pentru actualizarea unui stylist
 */
export function validateUpdateStylistData(
  data: unknown,
): { success: true; data: UpdateStylistFormData } | { success: false; errors: Record<string, string> } {
  const result = UpdateStylistActionSchema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  return { success: false, errors: formatValidationErrors(result.error) }
}
