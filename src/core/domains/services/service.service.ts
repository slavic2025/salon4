// src/core/domains/services/service.service.ts

import { DatabaseError, NotFoundError, UniquenessError } from '@/lib/errors'
import { createLogger } from '@/lib/logger'

import { SERVICE_ERROR_MESSAGES, SERVICE_SUCCESS_MESSAGES, SERVICE_VALIDATION_MESSAGES } from './service.constants'
import type { ServiceRepository } from './service.repository'
import type {
  CreateServiceData,
  CreateServicePayload,
  ServiceCategory,
  ServiceService,
  UpdateServiceData,
  UpdateServicePayload,
} from './service.types'
import { validateServiceData } from './service.validators'

/**
 * Business logic pentru gestionarea serviciilor
 * Folosește Dependency Injection pattern și validatori centralizați
 */
export function createServiceService(repository: ServiceRepository): ServiceService {
  const logger = createLogger('ServiceService')

  /**
   * Verifică proactiv unicitatea pentru nume de serviciu.
   */
  async function _ensureUniqueness(data: { name: string }, idToExclude?: string) {
    const existingByName = await repository.findByName(data.name)
    if (existingByName && existingByName.id !== idToExclude) {
      throw new UniquenessError(SERVICE_ERROR_MESSAGES.ALREADY_EXISTS, [
        { field: 'name', message: SERVICE_ERROR_MESSAGES.ALREADY_EXISTS },
      ])
    }
  }

  return {
    /**
     * Obține toate serviciile
     */
    getAllServices: () => repository.findAll(),

    /**
     * Obține un serviciu după ID
     */
    async getServiceById(id: string) {
      if (!id?.trim()) {
        throw new Error(SERVICE_VALIDATION_MESSAGES.ID_REQUIRED)
      }

      const service = await repository.findById(id)
      if (!service) {
        throw new NotFoundError(SERVICE_ERROR_MESSAGES.NOT_FOUND)
      }
      return service
    },

    /**
     * Obține serviciile după categorie
     */
    async getServicesByCategory(category: ServiceCategory) {
      return repository.findByCategory(category)
    },

    /**
     * Obține serviciile active
     */
    getActiveServices: () => repository.findActive(),

    /**
     * Creează un serviciu nou
     */
    async createService(payload: CreateServicePayload) {
      // Validare folosind validatori centralizați
      await this.validateServiceData({
        name: payload.name,
        description: payload.description || '',
        price: String(payload.price),
        duration: payload.duration,
        category: payload.category,
        isActive: payload.isActive,
      })

      // Verificare unicitate
      await _ensureUniqueness(payload)

      try {
        const newService = await repository.create({
          name: payload.name,
          description: payload.description || '',
          price: String(payload.price),
          duration: payload.duration,
          category: payload.category,
          isActive: payload.isActive,
        })
        logger.info('Service created successfully.', { serviceId: newService.id })
        return { success: true, message: SERVICE_SUCCESS_MESSAGES.CREATED, data: newService }
      } catch (error: any) {
        if (error instanceof UniquenessError) throw error
        logger.error('Failed to create service.', { error })
        throw new DatabaseError(SERVICE_ERROR_MESSAGES.CREATE_FAILED, { cause: error })
      }
    },

    /**
     * Actualizează un serviciu existent
     */
    async updateService(payload: UpdateServicePayload) {
      const { id, ...data } = payload

      if (!id?.trim()) {
        throw new Error(SERVICE_VALIDATION_MESSAGES.ID_REQUIRED)
      }

      // Verificare existență
      const existing = await repository.findById(id)
      if (!existing) {
        throw new NotFoundError(SERVICE_ERROR_MESSAGES.NOT_FOUND)
      }

      // Verificare unicitate (doar dacă se schimbă numele)
      if (data.name) {
        await _ensureUniqueness({ name: data.name }, id)
      }

      try {
        const updatedService = await repository.update(id, {
          ...data,
          price: data.price ? String(data.price) : undefined,
        })
        logger.info('Service updated successfully.', { serviceId: id })
        return { success: true, message: SERVICE_SUCCESS_MESSAGES.UPDATED, data: updatedService }
      } catch (error: any) {
        if (error instanceof UniquenessError) throw error
        logger.error('Failed to update service.', { error })
        throw new DatabaseError(SERVICE_ERROR_MESSAGES.UPDATE_FAILED, { cause: error })
      }
    },

    /**
     * Șterge un serviciu
     */
    async deleteService(serviceId: string) {
      if (!serviceId?.trim()) {
        throw new Error(SERVICE_VALIDATION_MESSAGES.ID_REQUIRED)
      }

      // Verificare existență
      const existing = await repository.findById(serviceId)
      if (!existing) {
        throw new NotFoundError(SERVICE_ERROR_MESSAGES.NOT_FOUND)
      }

      logger.info('Attempting to delete service...', { serviceId })
      try {
        await repository.delete(serviceId)
        logger.info('Service deleted successfully.', { serviceId })
        return { success: true, message: SERVICE_SUCCESS_MESSAGES.DELETED }
      } catch (error: any) {
        logger.error('Failed to delete service.', { error })
        throw new DatabaseError(SERVICE_ERROR_MESSAGES.DELETE_FAILED, { cause: error })
      }
    },

    /**
     * Validează datele unui serviciu folosind validatori centralizați
     */
    async validateServiceData(data: CreateServiceData | UpdateServiceData): Promise<void> {
      // Folosim validarea centralizată din validators.ts
      const validationResult = validateServiceData(data)

      if (!validationResult.success) {
        // Luăm primul mesaj de eroare pentru a păstra compatibilitatea
        const firstError = Object.values(validationResult.errors)[0]
        throw new Error(String(firstError) || SERVICE_VALIDATION_MESSAGES.NAME_REQUIRED)
      }
    },
  }
}
