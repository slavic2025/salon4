// src/core/domains/unavailability/unavailability.types.ts

import { z } from 'zod'

import { unavailabilities, unavailabilityCauseEnum } from '@/db/schema/unavailabilities'

// --- DATABASE TYPES ---

/**
 * Tip pentru tabela unavailabilities din DB
 */
export type Unavailability = typeof unavailabilities.$inferSelect
export type NewUnavailability = typeof unavailabilities.$inferInsert

/**
 * Tipuri pentru enum-uri
 */
export type UnavailabilityCause = (typeof unavailabilityCauseEnum.enumValues)[number]

// --- BUSINESS TYPES ---

/**
 * Date de bază pentru unavailability (fără ID și timestamps)
 */
export interface UnavailabilityData {
  stylistId: string
  date: string
  startTime?: string | null
  endTime?: string | null
  cause: UnavailabilityCause
  allDay: boolean
  description?: string | null
}

/**
 * Date pentru creare unavailability
 */
export interface CreateUnavailabilityData extends UnavailabilityData {}

/**
 * Date pentru actualizare unavailability (toate câmpurile opționale)
 */
export interface UpdateUnavailabilityData extends Partial<UnavailabilityData> {}

/**
 * Unavailability cu detalii stylist (pentru afișare)
 */
export interface UnavailabilityWithStylist extends Unavailability {
  stylist: {
    id: string
    fullName: string
    email: string
  }
}

/**
 * Filtru pentru căutarea unavailabilities
 */
export interface UnavailabilityFilters {
  stylistId?: string
  dateFrom?: string
  dateTo?: string
  cause?: UnavailabilityCause
  allDay?: boolean
}

// --- REPOSITORY INTERFACE ---

export interface UnavailabilityRepository {
  findById(id: string): Promise<Unavailability | null>
  findByFilters(filters: UnavailabilityFilters): Promise<Unavailability[]>
  findByStylistId(stylistId: string, dateFrom?: string, dateTo?: string): Promise<Unavailability[]>
  findWithStylistDetails(filters: UnavailabilityFilters): Promise<UnavailabilityWithStylist[]>
  create(data: CreateUnavailabilityData): Promise<Unavailability>
  update(id: string, data: UpdateUnavailabilityData): Promise<Unavailability | null>
  delete(id: string): Promise<boolean>
  checkConflicts(
    stylistId: string,
    date: string,
    startTime?: string,
    endTime?: string,
    excludeId?: string,
  ): Promise<Unavailability[]>
}

// --- SERVICE INTERFACE ---

export interface UnavailabilityService {
  getUnavailabilityById(id: string): Promise<Unavailability | null>
  getUnavailabilitiesByFilters(filters: UnavailabilityFilters): Promise<Unavailability[]>
  getUnavailabilitiesByStylist(stylistId: string, dateFrom?: string, dateTo?: string): Promise<Unavailability[]>
  getUnavailabilitiesWithStylistDetails(filters: UnavailabilityFilters): Promise<UnavailabilityWithStylist[]>
  createUnavailability(data: CreateUnavailabilityData): Promise<Unavailability>
  updateUnavailability(id: string, data: UpdateUnavailabilityData): Promise<Unavailability | null>
  deleteUnavailability(id: string): Promise<boolean>
  validateUnavailabilityData(data: CreateUnavailabilityData | UpdateUnavailabilityData): Promise<void>
  checkForConflicts(
    stylistId: string,
    date: string,
    startTime?: string,
    endTime?: string,
    excludeId?: string,
  ): Promise<void>
}

// --- RE-EXPORT VALIDATORS ---
// Re-exportăm validatori din validators.ts pentru a păstra compatibilitatea

import { CreateUnavailabilityActionSchema, UpdateUnavailabilityActionSchema } from './unavailability.validators'

export type { CreateUnavailabilityFormData, UpdateUnavailabilityFormData } from './unavailability.validators'
export {
  CreateUnavailabilityActionSchema,
  CreateUnavailabilityFormValidator,
  UpdateUnavailabilityActionSchema,
  UpdateUnavailabilityFormValidator,
} from './unavailability.validators'

// --- ACTION PAYLOAD TYPES ---
// Derivate din validatori pentru type safety

export type CreateUnavailabilityPayload = z.infer<typeof CreateUnavailabilityActionSchema>
export type UpdateUnavailabilityPayload = z.infer<typeof UpdateUnavailabilityActionSchema>
