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

// --- FORM SCHEMAS ---

/**
 * Schema de validare pentru formularul de creare/editare (UI)
 */
export const UnavailabilityFormSchema = z
  .object({
    stylistId: z.string().uuid('ID stylist invalid'),
    date: z.string().min(1, 'Data este obligatorie'),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    cause: z.enum(['pauza', 'programare_offline', 'alta_situatie'], {
      required_error: 'Cauza este obligatorie',
    }),
    allDay: z.boolean().default(false),
    description: z.string().optional(),
  })
  .refine(
    (data) => {
      // Validare: dacă nu este all_day, start_time și end_time sunt obligatorii
      if (!data.allDay && (!data.startTime || !data.endTime)) {
        return false
      }
      return true
    },
    {
      message: 'Ora de început și sfârșitul sunt obligatorii când nu este toată ziua',
      path: ['startTime'],
    },
  )
  .refine(
    (data) => {
      // Validare: end_time > start_time dacă nu este all_day
      if (!data.allDay && data.startTime && data.endTime) {
        return data.endTime > data.startTime
      }
      return true
    },
    {
      message: 'Ora de sfârșit trebuie să fie după ora de început',
      path: ['endTime'],
    },
  )

export type UnavailabilityFormData = z.infer<typeof UnavailabilityFormSchema>

// --- ACTION SCHEMAS ---

/**
 * Schema pentru server actions (cu transformări)
 */
export const CreateUnavailabilityActionSchema = z
  .object({
    stylistId: z.string().uuid(),
    date: z.string().transform((val) => val.trim()),
    startTime: z.string().nullable().optional(),
    endTime: z.string().nullable().optional(),
    cause: z.enum(['pauza', 'programare_offline', 'alta_situatie']),
    allDay: z.boolean().default(false),
    description: z.string().nullable().optional(),
  })
  .refine(
    (data) => {
      if (!data.allDay && (!data.startTime || !data.endTime)) {
        return false
      }
      return true
    },
    {
      message: 'Ora de început și sfârșitul sunt obligatorii când nu este toată ziua',
    },
  )
  .refine(
    (data) => {
      if (!data.allDay && data.startTime && data.endTime) {
        return data.endTime > data.startTime
      }
      return true
    },
    {
      message: 'Ora de sfârșit trebuie să fie după ora de început',
    },
  )

export const UpdateUnavailabilityActionSchema = z.object({
  stylistId: z.string().uuid().optional(),
  date: z
    .string()
    .transform((val) => val.trim())
    .optional(),
  startTime: z.string().nullable().optional(),
  endTime: z.string().nullable().optional(),
  cause: z.enum(['pauza', 'programare_offline', 'alta_situatie']).optional(),
  allDay: z.boolean().optional(),
  description: z.string().nullable().optional(),
})

export type CreateUnavailabilityPayload = z.infer<typeof CreateUnavailabilityActionSchema>
export type UpdateUnavailabilityPayload = z.infer<typeof UpdateUnavailabilityActionSchema>

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
