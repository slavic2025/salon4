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
   * Aruncă o eroare `UniquenessError` dacă numele este deja folosit.
   */
  async function _ensureUniqueness(data: { name: string }, idToExclude: string | null = null) {
    logger.debug('Ensuring uniqueness for service name...', { name: data.name, idToExclude })

    // Presupunem că repository-ul are o metodă optimizată `findByName`.
    const existingByName = await repository.findByName(data.name)

    if (existingByName && existingByName.id !== idToExclude) {
      throw new UniquenessError('Service name already exists', [
        { field: 'name', message: SERVICE_MESSAGES.ERROR.ALREADY_EXISTS },
      ])
    }
  }

  /**
   * Funcție privată pentru a traduce erorile tehnice în erori de business.
   * Acum verifică `error.code` pentru o mai mare robustețe.
   */
  function _handleDatabaseError(error: unknown, operation: string): never {
    logger.error(`Database error during ${operation}`, { error })

    // Verificare robustă a codului de eroare pentru unicitate
    if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
      throw new UniquenessError('A service with this name already exists.', [
        { field: 'name', message: SERVICE_MESSAGES.ERROR.ALREADY_EXISTS },
      ])
    }

    throw new DatabaseError(`Failed to ${operation} service`, { cause: error })
  }

  return {
    async getAllServices() {
      return repository.findAll()
    },

    async getServiceById(id: string) {
      const service = await repository.findById(id)
      if (!service) {
        throw new NotFoundError(`Service with id ${id} not found`)
      }
      return service
    },

    async createService(payload: CreateServicePayload) {
      await _ensureUniqueness(payload)
      logger.info('Attempting to create a new service...', { name: payload.name })

      try {
        const newService = await repository.create({
          ...payload,
          price: String(payload.price),
        })
        logger.info('Service created successfully.', { serviceId: newService.id })
        return { success: true, message: SERVICE_MESSAGES.SUCCESS.CREATED, data: newService }
      } catch (error) {
        _handleDatabaseError(error, 'create')
      }
    },

    async updateService(payload: UpdateServicePayload) {
      const { id, ...dataToUpdate } = payload
      await _ensureUniqueness(dataToUpdate, id)
      logger.info('Attempting to update service...', { serviceId: id })

      try {
        const updateData = {
          ...dataToUpdate,
          price: dataToUpdate.price !== undefined ? String(dataToUpdate.price) : undefined,
        }
        await repository.update(id, updateData)
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
    async getActiveServices() {
      // Presupunem că repository-ul are o metodă `findActive`.
      return repository.findActive()
    },

    /** Obține serviciile după categorie printr-o interogare optimizată. */
    async getServicesByCategory(category: ServiceCategory) {
      // Presupunem că repository-ul are o metodă `findByCategory`.
      return repository.findByCategory(category)
    },
  }
}
