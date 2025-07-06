// --- Tipuri de Bază generate din Schema Drizzle ---

import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

import { services } from '@/db/schema/services'

import { SERVICE_MESSAGES } from './service.constants'

export const SERVICE_CATEGORIES = ['haircut', 'coloring', 'styling', 'treatment', 'other'] as const
// --- PASUL 2: Derivăm tipul TypeScript și schema Zod din constantă. ---
export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number]
export const serviceCategorySchema = z.enum(SERVICE_CATEGORIES)

export const selectServiceSchema = createSelectSchema(services)
export const insertServiceSchema = createInsertSchema(services)

export type Service = typeof services.$inferSelect
export type NewService = typeof services.$inferInsert

// --- Schema pentru Formularul din UI (Adăugare / Editare) ---
export const serviceFormSchema = z.object({
  name: z.string().min(3, SERVICE_MESSAGES.VALIDATION.NAME_MIN_LENGTH),
  description: z.string(),
  price: z.number().positive(SERVICE_MESSAGES.VALIDATION.PRICE_POSITIVE),
  duration: z.number().int().positive(SERVICE_MESSAGES.VALIDATION.DURATION_POSITIVE),
  category: z.enum(SERVICE_CATEGORIES),
  isActive: z.boolean(),
})

export type ServiceFormValues = z.infer<typeof serviceFormSchema>

// --- Scheme pentru Acțiunile de pe Server ---

// Schema pentru acțiunea de ADĂUGARE
export const createServiceActionSchema = serviceFormSchema
export type CreateServicePayload = z.infer<typeof createServiceActionSchema>

// Schema pentru acțiunea de EDITARE
export const updateServiceActionSchema = serviceFormSchema.extend({
  id: z.string().uuid(SERVICE_MESSAGES.VALIDATION.ID_REQUIRED),
})
export type UpdateServicePayload = z.infer<typeof updateServiceActionSchema>

// Schema pentru acțiunea de ȘTERGERE
export const deleteServiceActionSchema = z.object({
  id: z.string().uuid(SERVICE_MESSAGES.VALIDATION.ID_REQUIRED),
})
export type DeleteServicePayload = z.infer<typeof deleteServiceActionSchema>
