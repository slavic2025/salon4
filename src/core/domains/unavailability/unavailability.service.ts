// src/core/domains/unavailability/unavailability.service.ts

import { UNAVAILABILITY_ERROR_MESSAGES, UNAVAILABILITY_VALIDATION_MESSAGES } from './unavailability.constants'
import {
  type CreateUnavailabilityData,
  type Unavailability,
  type UnavailabilityCause,
  type UnavailabilityFilters,
  type UnavailabilityRepository,
  type UnavailabilityService,
  type UnavailabilityWithStylist,
  type UpdateUnavailabilityData,
} from './unavailability.types'
import { validateUnavailabilityData } from './unavailability.validators'

/**
 * Business logic pentru gestionarea indisponibilităților
 * Folosește Dependency Injection pattern și validatori centralizați
 */
export const createUnavailabilityService = (repository: UnavailabilityRepository): UnavailabilityService => {
  return {
    /**
     * Găsește o indisponibilitate după ID
     */
    async getUnavailabilityById(id: string): Promise<Unavailability | null> {
      if (!id?.trim()) {
        throw new Error(UNAVAILABILITY_VALIDATION_MESSAGES.STYLIST_ID_REQUIRED)
      }

      return await repository.findById(id)
    },

    /**
     * Găsește indisponibilități după filtru
     */
    async getUnavailabilitiesByFilters(filters: UnavailabilityFilters): Promise<Unavailability[]> {
      // Validare basic pentru filtru
      if (filters.dateFrom && filters.dateTo && filters.dateFrom > filters.dateTo) {
        throw new Error('Data de început nu poate fi după data de sfârșit')
      }

      return await repository.findByFilters(filters)
    },

    /**
     * Găsește indisponibilități pentru un stylist
     */
    async getUnavailabilitiesByStylist(
      stylistId: string,
      dateFrom?: string,
      dateTo?: string,
    ): Promise<Unavailability[]> {
      if (!stylistId?.trim()) {
        throw new Error(UNAVAILABILITY_VALIDATION_MESSAGES.STYLIST_ID_REQUIRED)
      }

      // Validare interval de date
      if (dateFrom && dateTo && dateFrom > dateTo) {
        throw new Error('Data de început nu poate fi după data de sfârșit')
      }

      return await repository.findByStylistId(stylistId, dateFrom, dateTo)
    },

    /**
     * Găsește indisponibilități cu detalii stylist
     */
    async getUnavailabilitiesWithStylistDetails(filters: UnavailabilityFilters): Promise<UnavailabilityWithStylist[]> {
      return await repository.findWithStylistDetails(filters)
    },

    /**
     * Creează o nouă indisponibilitate
     */
    async createUnavailability(data: CreateUnavailabilityData): Promise<Unavailability> {
      // Validare folosind validatori centralizați
      await this.validateUnavailabilityData(data)

      // Verificare pentru conflicte
      await this.checkForConflicts(data.stylistId, data.date, data.startTime || undefined, data.endTime || undefined)

      // Creare indisponibilitate
      try {
        return await repository.create(data)
      } catch (error) {
        console.error('Eroare la crearea indisponibilității:', error)
        throw new Error(UNAVAILABILITY_ERROR_MESSAGES.CREATION_FAILED)
      }
    },

    /**
     * Actualizează o indisponibilitate existentă
     */
    async updateUnavailability(id: string, data: UpdateUnavailabilityData): Promise<Unavailability | null> {
      if (!id?.trim()) {
        throw new Error(UNAVAILABILITY_VALIDATION_MESSAGES.STYLIST_ID_REQUIRED)
      }

      // Verificare existență
      const existing = await repository.findById(id)
      if (!existing) {
        throw new Error(UNAVAILABILITY_ERROR_MESSAGES.NOT_FOUND)
      }

      // Validare date de intrare (doar câmpurile prezente)
      if (Object.keys(data).length > 0) {
        await this.validateUnavailabilityData({
          stylistId: data.stylistId || existing.stylistId,
          date: data.date || existing.date,
          startTime: data.startTime ?? existing.startTime,
          endTime: data.endTime ?? existing.endTime,
          cause: data.cause || existing.cause,
          allDay: data.allDay ?? existing.allDay,
          description: data.description ?? existing.description,
        })
      }

      // Verificare pentru conflicte (dacă se schimbă date relevante)
      if (data.date || data.startTime !== undefined || data.endTime !== undefined || data.allDay !== undefined) {
        await this.checkForConflicts(
          data.stylistId || existing.stylistId,
          data.date || existing.date,
          (data.startTime ?? existing.startTime) || undefined,
          (data.endTime ?? existing.endTime) || undefined,
          id, // excludem ID-ul curent
        )
      }

      // Actualizare
      try {
        return await repository.update(id, data)
      } catch (error) {
        console.error('Eroare la actualizarea indisponibilității:', error)
        throw new Error(UNAVAILABILITY_ERROR_MESSAGES.UPDATE_FAILED)
      }
    },

    /**
     * Șterge o indisponibilitate
     */
    async deleteUnavailability(id: string): Promise<boolean> {
      if (!id?.trim()) {
        throw new Error(UNAVAILABILITY_VALIDATION_MESSAGES.STYLIST_ID_REQUIRED)
      }

      // Verificare existență
      const existing = await repository.findById(id)
      if (!existing) {
        throw new Error(UNAVAILABILITY_ERROR_MESSAGES.NOT_FOUND)
      }

      try {
        return await repository.delete(id)
      } catch (error) {
        console.error('Eroare la ștergerea indisponibilității:', error)
        throw new Error(UNAVAILABILITY_ERROR_MESSAGES.DELETE_FAILED)
      }
    },

    /**
     * Validează datele unei indisponibilități folosind validatori centralizați
     */
    async validateUnavailabilityData(data: CreateUnavailabilityData | UpdateUnavailabilityData): Promise<void> {
      // Folosim validarea centralizată din validators.ts
      const validationResult = validateUnavailabilityData(data)

      if (!validationResult.success) {
        // Luăm primul mesaj de eroare pentru a păstra compatibilitatea
        const firstError = Object.values(validationResult.errors)[0]
        throw new Error(String(firstError) || UNAVAILABILITY_VALIDATION_MESSAGES.DATE_REQUIRED)
      }
    },

    /**
     * Verifică conflicte cu alte indisponibilități
     */
    async checkForConflicts(
      stylistId: string,
      date: string,
      startTime?: string,
      endTime?: string,
      excludeId?: string,
    ): Promise<void> {
      const conflicts = await repository.checkConflicts(stylistId, date, startTime, endTime, excludeId)

      if (conflicts.length > 0) {
        throw new Error(UNAVAILABILITY_VALIDATION_MESSAGES.TIME_CONFLICT)
      }
    },

    /**
     * Verifică că o indisponibilitate aparține unui stylist specific
     */
    async ensureStylistOwns(id: string, stylistId: string): Promise<Unavailability> {
      const unavailability = await repository.findById(id)

      if (!unavailability) {
        throw new Error(UNAVAILABILITY_ERROR_MESSAGES.NOT_FOUND)
      }

      if (unavailability.stylistId !== stylistId) {
        throw new Error(UNAVAILABILITY_ERROR_MESSAGES.UNAUTHORIZED)
      }

      return unavailability
    },

    /**
     * Creează mai multe indisponibilități pentru aceleași date
     */
    async createBulkUnavailability(data: {
      stylistId: string
      dates: string[]
      startTime?: string | null
      endTime?: string | null
      cause: UnavailabilityCause
      allDay: boolean
      description?: string | null
    }): Promise<Unavailability[]> {
      const results = []
      const errors = []

      for (const date of data.dates) {
        try {
          const unavailabilityData = {
            stylistId: data.stylistId,
            date,
            startTime: data.allDay ? null : data.startTime,
            endTime: data.allDay ? null : data.endTime,
            cause: data.cause,
            allDay: data.allDay,
            description: data.description,
          }

          const unavailability = await this.createUnavailability(unavailabilityData)
          results.push(unavailability)
        } catch (error) {
          errors.push({
            date,
            error: error instanceof Error ? error.message : 'Eroare necunoscută',
          })
        }
      }

      if (errors.length > 0 && results.length === 0) {
        throw new Error(`Nu s-a putut crea nicio indisponibilitate: ${errors[0].error}`)
      }

      return results
    },
  }
}
