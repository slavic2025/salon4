// src/core/domains/stylist-services/stylist-service.types.ts

import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

import { stylistsToServices } from '@/db/schema/stylist-services'

import { Service } from '../services/service.types'

// --- DATABASE TYPES ---

/**
 * Tipuri de bază generate din Schema Drizzle
 */
export const selectStylistServiceLinkSchema = createSelectSchema(stylistsToServices)
export const insertStylistServiceLinkSchema = createInsertSchema(stylistsToServices)

export type StylistServiceLink = typeof stylistsToServices.$inferSelect
export type NewStylistServiceLink = typeof stylistsToServices.$inferInsert

// --- BUSINESS TYPES ---

/**
 * Date de bază pentru stylist service link (fără ID și timestamps)
 */
export interface StylistServiceLinkData {
  stylistId: string
  serviceId: string
  customPrice?: string | null
  customDuration?: number | null
}

/**
 * Date pentru creare stylist service link
 */
export interface CreateStylistServiceLinkData extends StylistServiceLinkData {}

/**
 * Date pentru actualizare stylist service link (toate câmpurile opționale)
 */
export interface UpdateStylistServiceLinkData extends Partial<StylistServiceLinkData> {}

/**
 * Date pentru filtrarea legăturilor stylist-service
 */
export interface StylistServiceLinkFilters {
  stylistId?: string
  serviceId?: string
  hasCustomPrice?: boolean
  hasCustomDuration?: boolean
}

// --- REPOSITORY INTERFACE ---

export interface StylistServiceLinkRepository {
  findAll(): Promise<StylistServiceLink[]>
  findByStylistAndService(stylistId: string, serviceId: string): Promise<StylistServiceLink | undefined>
  findByStylistId(stylistId: string): Promise<StylistServiceLink[]>
  findByServiceId(serviceId: string): Promise<StylistServiceLink[]>
  findByFilters(filters: StylistServiceLinkFilters): Promise<StylistServiceLink[]>
  create(newLink: CreateStylistServiceLinkData): Promise<StylistServiceLink>
  update(stylistId: string, serviceId: string, data: Partial<CreateStylistServiceLinkData>): Promise<StylistServiceLink>
  delete(stylistId: string, serviceId: string): Promise<void>
  checkUniqueness(stylistId: string, serviceId: string): Promise<StylistServiceLink | undefined>
  findByMultipleStylists(stylistIds: string[]): Promise<StylistServiceLink[]>
  findByMultipleServices(serviceIds: string[]): Promise<StylistServiceLink[]>
  deleteByStylistId(stylistId: string): Promise<void>
  deleteByServiceId(serviceId: string): Promise<void>
}

// --- SERVICE INTERFACE ---

export interface StylistServiceLinkService {
  getAllLinks(): Promise<StylistServiceLink[]>
  getLinksByStylistId(stylistId: string): Promise<StylistServiceLink[]>
  getLinksByServiceId(serviceId: string): Promise<StylistServiceLink[]>
  getLinksByFilters(filters: StylistServiceLinkFilters): Promise<StylistServiceLink[]>
  getLinkById(stylistId: string, serviceId: string): Promise<StylistServiceLink>
  createLink(payload: CreateStylistServiceLinkPayload): Promise<{
    success: boolean
    message: string
    data: StylistServiceLink
  }>
  updateLink(
    stylistId: string,
    serviceId: string,
    data: UpdateStylistServiceLinkPayload,
  ): Promise<{
    success: boolean
    message: string
    data: StylistServiceLink
  }>
  deleteLink(
    stylistId: string,
    serviceId: string,
  ): Promise<{
    success: boolean
    message: string
  }>
  checkForUniqueness(stylistId: string, serviceId: string): Promise<void>
  deleteAllStylistLinks(stylistId: string): Promise<{
    success: boolean
    message: string
  }>
  deleteAllServiceLinks(serviceId: string): Promise<{
    success: boolean
    message: string
  }>
}

// --- DISPLAY TYPES ---

/**
 * Tip pentru legătura stylist-service cu detalii complete
 */
export type StylistServiceLinkWithService = StylistServiceLink & {
  service: Service
}

/**
 * Tip pentru legătura stylist-service cu detalii stilist
 */
export type StylistServiceLinkWithStylist = StylistServiceLink & {
  stylist: {
    id: string
    fullName: string
    email: string
  }
}

/**
 * Tip pentru legătura stylist-service cu toate detaliile
 */
export type StylistServiceLinkWithDetails = StylistServiceLink & {
  service: Service
  stylist: {
    id: string
    fullName: string
    email: string
  }
}

/**
 * Tip pentru formularul de creare
 */
export type StylistServiceFormValues = z.infer<typeof stylistServiceFormSchema>

// --- RE-EXPORT VALIDATORS ---
// Re-exportăm validatori din validators.ts pentru a păstra compatibilitatea

import {
  CheckUniquenessSchema,
  CreateStylistServiceLinkActionSchema,
  DeleteStylistServiceLinkActionSchema,
  UpdateStylistServiceLinkActionSchema,
} from './stylist-service.validators'

export type { CreateStylistServiceLinkFormData, UpdateStylistServiceLinkFormData } from './stylist-service.validators'
export {
  CheckUniquenessSchema,
  CreateStylistServiceLinkActionSchema,
  CreateStylistServiceLinkFormValidator,
  DeleteStylistServiceLinkActionSchema,
  UpdateStylistServiceLinkActionSchema,
  UpdateStylistServiceLinkFormValidator,
} from './stylist-service.validators'

// --- ACTION PAYLOAD TYPES ---
// Derivate din validatori pentru type safety

export type CreateStylistServiceLinkPayload = z.infer<typeof CreateStylistServiceLinkActionSchema>
export type UpdateStylistServiceLinkPayload = z.infer<typeof UpdateStylistServiceLinkActionSchema>
export type DeleteStylistServiceLinkPayload = z.infer<typeof DeleteStylistServiceLinkActionSchema>
export type CheckUniquenessPayload = z.infer<typeof CheckUniquenessSchema>

// --- LEGACY SUPPORT ---
// Păstrăm schema-ul original pentru compatibilitate

export const stylistServiceFormSchema = z.object({
  serviceId: z.string().uuid({ message: 'Selectează un serviciu.' }),
  customPrice: z.string().optional(),
  customDuration: z.string().optional(),
})
