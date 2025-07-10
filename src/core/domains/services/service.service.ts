// src/core/domains/services/service.service.ts

import { DatabaseError, NotFoundError, UniquenessError } from '@/lib/errors'
import { createLogger } from '@/lib/logger'

import { SERVICE_MESSAGES } from './service.constants'
import type { ServiceRepository } from './service.repository'
import type { CreateServicePayload, ServiceCategory, UpdateServicePayload } from './service.types'

export function createServiceService(repository: ServiceRepository) {
  const logger = createLogger('ServiceService')

  /**
   * Verifică proactiv unicitatea numelui serviciului folosind o interogare la țintă.
   */
  async function _ensureUniqueness(data: { name: string }, idToExclude?: string) {
    logger.debug('Ensuring uniqueness for service name...', { name: data.name, idToExclude })
    const existingByName = await repository.findByName(data.name)
    if (existingByName && existingByName.id !== idToExclude) {
      throw new UniquenessError(SERVICE_MESSAGES.ERROR.ALREADY_EXISTS, [
        { field: 'name', message: SERVICE_MESSAGES.ERROR.ALREADY_EXISTS },
      ])
    }
  }

  /**
   * Funcție privată pentru a traduce erorile tehnice în erori de business.
   */
  function _handleDatabaseError(error: unknown, operation: string): never {
    logger.error(`Database error during ${operation}`, { error })
    // Verificare robustă a codului de eroare pentru unicitate
    if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
      throw new UniquenessError(SERVICE_MESSAGES.ERROR.ALREADY_EXISTS, [
        { field: 'name', message: SERVICE_MESSAGES.ERROR.ALREADY_EXISTS },
      ])
    }
    throw new DatabaseError(`Failed to ${operation} service`, { cause: error })
  }

  return {
    getAllServices: () => repository.findAll(),

    async getServiceById(id: string) {
      const service = await repository.findById(id)
      if (!service) {
        throw new NotFoundError(`Service with id ${id} not found`)
      }
      return service
    },

    async createService(payload: CreateServicePayload) {
      await _ensureUniqueness(payload)
      try {
        const newService = await repository.create({ ...payload, price: String(payload.price) })
        logger.info('Service created successfully.', { serviceId: newService.id })
        return { success: true, message: SERVICE_MESSAGES.SUCCESS.CREATED, data: newService }
      } catch (error) {
        _handleDatabaseError(error, 'create')
      }
    },

    async updateService(payload: UpdateServicePayload) {
      const { id, ...data } = payload
      await _ensureUniqueness(data, id)
      try {
        await repository.update(id, {
          ...data,
          price: data.price ? String(data.price) : undefined,
        })
        logger.info('Service updated successfully.', { serviceId: id })
        return { success: true, message: SERVICE_MESSAGES.SUCCESS.UPDATED }
      } catch (error) {
        _handleDatabaseError(error, 'update')
      }
    },

    async deleteService(serviceId: string) {
      logger.info('Attempting to delete service...', { serviceId })
      try {
        await repository.delete(serviceId)
        logger.info('Service deleted successfully.', { serviceId })
        return { success: true, message: SERVICE_MESSAGES.SUCCESS.DELETED }
      } catch (error) {
        _handleDatabaseError(error, 'delete')
      }
    },

    /** Obține serviciile active printr-o interogare optimizată. */
    getActiveServices: () => repository.findActive(),

    /** Obține serviciile după categorie printr-o interogare optimizată. */
    getServicesByCategory: (category: ServiceCategory) => repository.findByCategory(category),
  }
}
