// src/core/domains/stylists/stylist.types.ts

import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

import { stylists } from '@/db/schema/stylists'

import { STYLIST_MESSAGES } from './stylist.constants'

// --- Tipuri de Bază generate din Schema Drizzle ---
export const selectStylistSchema = createSelectSchema(stylists)
export const insertStylistSchema = createInsertSchema(stylists)

export type Stylist = typeof stylists.$inferSelect
export type NewStylist = typeof stylists.$inferInsert

// --- Schema pentru Formularul din UI (Adăugare / Editare) ---
export const stylistFormSchema = z.object({
  fullName: z.string().min(3, STYLIST_MESSAGES.VALIDATION.FULL_NAME_MIN_LENGTH),
  email: z.string().email(STYLIST_MESSAGES.VALIDATION.INVALID_EMAIL),
  phone: z.string().min(9, STYLIST_MESSAGES.VALIDATION.PHONE_TOO_SHORT),
  description: z.string(),
  isActive: z.boolean(),
})

export type StylistFormValues = z.infer<typeof stylistFormSchema>

// --- Scheme pentru Acțiunile de pe Server ---

// Schema pentru acțiunea de ADĂUGARE
export const createStylistActionSchema = stylistFormSchema
export type CreateStylistPayload = z.infer<typeof createStylistActionSchema>

// Schema pentru acțiunea de EDITARE
export const updateStylistActionSchema = stylistFormSchema.extend({
  id: z.string().uuid(STYLIST_MESSAGES.VALIDATION.ID_REQUIRED),
})
export type UpdateStylistPayload = z.infer<typeof updateStylistActionSchema>

// Schema pentru acțiunea de ȘTERGERE
export const deleteStylistActionSchema = z.object({
  id: z.string().uuid(STYLIST_MESSAGES.VALIDATION.ID_REQUIRED),
})
export type DeleteStylistPayload = z.infer<typeof deleteStylistActionSchema>
