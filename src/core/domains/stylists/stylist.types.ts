import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

import { stylists } from '@/db/schema/stylists'

// --- Tipuri generate automat din Drizzle ---
export const selectStylistSchema = createSelectSchema(stylists)
export const insertStylistSchema = createInsertSchema(stylists)

export type Stylist = typeof stylists.$inferSelect
export type NewStylist = typeof stylists.$inferInsert

// --- Schema pentru Formularul din UI ---
// Se concentrează pe validarea input-ului de la utilizator.
export const stylistFormSchema = z.object({
  fullName: z.string().min(3, 'Numele trebuie să aibă cel puțin 3 caractere.'),
  email: z.string().email('Adresa de email nu este validă.'),
  phone: z.string().min(9, 'Numărul de telefon este prea scurt.'),
  description: z.string().optional(),
})
export type StylistFormValues = z.infer<typeof stylistFormSchema>

// --- Schema pentru Acțiunea de pe Server ---
// Extinde schema de UI și adaugă transformări și câmpuri de server.
export const createStylistActionSchema = stylistFormSchema
  .extend({
    // Pe server, ne așteptăm și la ID-ul generat de Supabase Auth.
    id: z.string().uuid(),
    profilePictureUrl: z.string().url().optional(), // URL-ul după upload
  })
  .transform((data) => ({
    // Transformăm datele pentru a se potrivi cu schema Drizzle
    id: data.id,
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    description: data.description,
    profilePicture: data.profilePictureUrl,
  }))

export type CreateStylistPayload = z.infer<typeof createStylistActionSchema>
