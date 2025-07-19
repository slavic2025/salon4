// src/core/domains/stylists/stylist.types.ts

import { z } from 'zod'

import { stylists } from '@/db/schema/stylists'

// --- DATABASE TYPES ---

/**
 * Tipuri generate automat din schema Drizzle
 */
export type Stylist = typeof stylists.$inferSelect
export type NewStylist = typeof stylists.$inferInsert

// --- BUSINESS TYPES ---

/**
 * Date de bază pentru stylist (fără ID și timestamps)
 */
export interface StylistData {
  fullName: string
  email: string
  phone: string
  description: string
  isActive: boolean
}

/**
 * Date pentru creare stylist (cu ID din Supabase Auth)
 */
export interface CreateStylistData extends StylistData {
  id: string
}

/**
 * Date pentru actualizare stylist (toate câmpurile opționale)
 */
export interface UpdateStylistData extends Partial<StylistData> {}

/**
 * Filtru pentru căutarea stiliștilor
 */
export interface StylistFilters {
  isActive?: boolean
  search?: string
  limit?: number
  offset?: number
}

// --- REPOSITORY INTERFACE ---

export interface StylistRepository {
  findAll(): Promise<Stylist[]>
  findById(id: string): Promise<Stylist | undefined>
  findByEmail(email: string): Promise<Stylist | undefined>
  findByPhone(phone: string): Promise<Stylist | undefined>
  create(newStylist: CreateStylistData): Promise<Stylist>
  update(id: string, data: Partial<CreateStylistData>): Promise<Stylist>
  delete(id: string): Promise<void>
}

// --- SERVICE INTERFACE ---

export interface StylistService {
  getAllStylists(): Promise<Stylist[]>
  getStylistById(id: string): Promise<Stylist | null>
  createStylist(payload: CreateStylistPayload): Promise<{
    success: boolean
    message: string
    data: Stylist
  }>
  updateStylist(payload: UpdateStylistPayload): Promise<{
    success: boolean
    message: string
    data: Stylist
  }>
  deleteStylist(stylistId: string): Promise<{
    success: boolean
    message: string
  }>
}

// --- RE-EXPORT VALIDATORS ---
// Re-exportăm validatori din validators.ts pentru a păstra compatibilitatea

import {
  CreateStylistActionSchema,
  DeleteStylistActionSchema,
  type StylistFormData,
  StylistFormValidator,
  UpdateStylistActionSchema,
  type UpdateStylistFormData,
} from './stylist.validators'

export { CreateStylistActionSchema, DeleteStylistActionSchema, StylistFormValidator, UpdateStylistActionSchema }

export type { StylistFormData, UpdateStylistFormData }

// --- ACTION PAYLOAD TYPES ---
// Derivate din validatori pentru type safety

export type CreateStylistPayload = z.infer<typeof CreateStylistActionSchema>
export type UpdateStylistPayload = z.infer<typeof UpdateStylistActionSchema>
export type DeleteStylistPayload = z.infer<typeof DeleteStylistActionSchema>

// --- BACKWARD COMPATIBILITY ---
// Pentru compatibilitate cu codul existent

export const stylistFormSchema = StylistFormValidator
export type StylistFormValues = StylistFormData
export const createStylistActionSchema = CreateStylistActionSchema
export const updateStylistActionSchema = UpdateStylistActionSchema
export const deleteStylistActionSchema = DeleteStylistActionSchema
