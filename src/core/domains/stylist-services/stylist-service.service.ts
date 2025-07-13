import { DatabaseError, UniquenessError } from '@/lib/errors'
import { createLogger } from '@/lib/logger'

import { STYLIST_SERVICE_LINK_MESSAGES } from './stylist-service.constants'
import type { StylistServiceLinkRepository } from './stylist-service.repository'
import type { NewStylistServiceLink } from './stylist-service.types'

export function createStylistServiceLinkService(repository: StylistServiceLinkRepository) {
  const logger = createLogger('StylistServiceLinkService')

  async function _ensureUniqueness(link: NewStylistServiceLink) {
    const existing = await repository.findByStylistId(link.stylistId)
    if (existing.some((l) => l.serviceId === link.serviceId)) {
      throw new UniquenessError(STYLIST_SERVICE_LINK_MESSAGES.ERROR.ALREADY_EXISTS, [
        { field: 'stylistId', message: STYLIST_SERVICE_LINK_MESSAGES.ERROR.ALREADY_EXISTS },
        { field: 'serviceId', message: STYLIST_SERVICE_LINK_MESSAGES.ERROR.ALREADY_EXISTS },
      ])
    }
  }

  return {
    getAllLinks: () => repository.findAll(),

    getLinksByStylistId: (stylistId: string) => repository.findByStylistId(stylistId),

    getLinksByServiceId: (serviceId: string) => repository.findByServiceId(serviceId),

    async createLink(payload: NewStylistServiceLink) {
      await _ensureUniqueness(payload)
      try {
        const link = await repository.create(payload)
        logger.info('Link created successfully.', { stylistId: link.stylistId, serviceId: link.serviceId })
        return { success: true, message: STYLIST_SERVICE_LINK_MESSAGES.SUCCESS.CREATED, data: link }
      } catch (error: any) {
        if (error instanceof UniquenessError) throw error
        logger.error('Failed to create link.', { error })
        throw new DatabaseError(STYLIST_SERVICE_LINK_MESSAGES.ERROR.CREATE_FAILED, { cause: error })
      }
    },

    async deleteLink(stylistId: string, serviceId: string) {
      logger.info('Attempting to delete link...', { stylistId, serviceId })
      try {
        await repository.delete(stylistId, serviceId)
        logger.info('Link deleted successfully.', { stylistId, serviceId })
        return { success: true, message: STYLIST_SERVICE_LINK_MESSAGES.SUCCESS.DELETED }
      } catch (error: any) {
        logger.error('Failed to delete link.', { error })
        throw new DatabaseError(STYLIST_SERVICE_LINK_MESSAGES.ERROR.DELETE_FAILED, { cause: error })
      }
    },

    async updateLink(stylistId: string, serviceId: string, data: Partial<NewStylistServiceLink>) {
      try {
        const link = await repository.update(stylistId, serviceId, data)
        logger.info('Link updated successfully.', { stylistId, serviceId, data })
        return { success: true, message: STYLIST_SERVICE_LINK_MESSAGES.SUCCESS.UPDATED, data: link }
      } catch (error: any) {
        logger.error('Failed to update link.', { error })
        throw new DatabaseError(STYLIST_SERVICE_LINK_MESSAGES.ERROR.UPDATE_FAILED, { cause: error })
      }
    },
  }
}
