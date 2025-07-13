// src/core/domains/services/service.service.ts

import { DatabaseError, NotFoundError, UniquenessError } from '@/lib/errors'
import { createLogger } from '@/lib/logger'

import { SERVICE_MESSAGES } from './service.constants'
import type { ServiceRepository } from './service.repository'
import type { CreateServicePayload, ServiceCategory, UpdateServicePayload } from './service.types'

export function createServiceService(repository: ServiceRepository) {
  const logger = createLogger('ServiceService')

  /**
   * Verifică proactiv unicitatea pentru nume de serviciu.
   */
  async function _ensureUniqueness(data: { name: string }, idToExclude?: string) {
    const existingByName = await repository.findByName(data.name)
    if (existingByName && existingByName.id !== idToExclude) {
      throw new UniquenessError(SERVICE_MESSAGES.ERROR.ALREADY_EXISTS, [
        { field: 'name', message: SERVICE_MESSAGES.ERROR.ALREADY_EXISTS },
      ])
    }
  }

  return {
    getAllServices: () => repository.findAll(),

    async getServiceById(id: string) {
      const service = await repository.findById(id)
      if (!service) {
        throw new NotFoundError(SERVICE_MESSAGES.ERROR.NOT_FOUND)
      }
      return service
    },

    async createService(payload: CreateServicePayload) {
      await _ensureUniqueness(payload)
      try {
        const newService = await repository.create({ ...payload, price: String(payload.price) })
        logger.info('Service created successfully.', { serviceId: newService.id })
        return { success: true, message: SERVICE_MESSAGES.SUCCESS.CREATED, data: newService }
      } catch (error: any) {
        if (error instanceof UniquenessError) throw error
        logger.error('Failed to create service.', { error })
        throw new DatabaseError(SERVICE_MESSAGES.ERROR.CREATE_FAILED, { cause: error })
      }
    },

    async updateService(payload: UpdateServicePayload) {
      const { id, ...data } = payload
      await _ensureUniqueness(data, id)
      try {
        const updatedService = await repository.update(id, {
          ...data,
          price: data.price ? String(data.price) : undefined,
        })
        logger.info('Service updated successfully.', { serviceId: id })
        return { success: true, message: SERVICE_MESSAGES.SUCCESS.UPDATED, data: updatedService }
      } catch (error: any) {
        if (error instanceof UniquenessError) throw error
        logger.error('Failed to update service.', { error })
        throw new DatabaseError(SERVICE_MESSAGES.ERROR.UPDATE_FAILED, { cause: error })
      }
    },

    async deleteService(serviceId: string) {
      logger.info('Attempting to delete service...', { serviceId })
      try {
        await repository.delete(serviceId)
        logger.info('Service deleted successfully.', { serviceId })
        return { success: true, message: SERVICE_MESSAGES.SUCCESS.DELETED }
      } catch (error: any) {
        logger.error('Failed to delete service.', { error })
        throw new DatabaseError(SERVICE_MESSAGES.ERROR.DELETE_FAILED, { cause: error })
      }
    },

    /** Obține serviciile active printr-o interogare optimizată. */
    getActiveServices: () => repository.findActive(),

    /** Obține serviciile după categorie printr-o interogare optimizată. */
    getServicesByCategory: (category: ServiceCategory) => repository.findByCategory(category),
  }
}
