import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

import { stylistsToServices } from '@/db/schema/stylist-services'

export const selectStylistServiceLinkSchema = createSelectSchema(stylistsToServices)
export const insertStylistServiceLinkSchema = createInsertSchema(stylistsToServices)

export const createStylistServiceLinkActionSchema = z.object({
  stylistId: z.string().uuid(),
  serviceId: z.string().uuid(),
  customPrice: z.string().optional().nullable(),
  customDuration: z.number().int().positive().optional().nullable(),
})
export type CreateStylistServiceLinkPayload = z.infer<typeof createStylistServiceLinkActionSchema>

export const deleteStylistServiceLinkActionSchema = z.object({
  stylistId: z.string().uuid(),
  serviceId: z.string().uuid(),
})
export type DeleteStylistServiceLinkPayload = z.infer<typeof deleteStylistServiceLinkActionSchema>

export type StylistServiceLink = typeof stylistsToServices.$inferSelect
export type NewStylistServiceLink = Omit<typeof stylistsToServices.$inferInsert, 'customPrice'> & {
  customPrice?: string | null
}
