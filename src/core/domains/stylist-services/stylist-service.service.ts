// src/core/domains/stylist-services/stylist-service.service.ts

import { DatabaseError, NotFoundError, UniquenessError } from '@/lib/errors'
import { createLogger } from '@/lib/logger'

import { STYLIST_SERVICE_LINK_MESSAGES } from './stylist-service.constants'
import type { StylistServiceLinkRepository } from './stylist-service.repository'
import type {
  CreateStylistServiceLinkPayload,
  StylistServiceLinkFilters,
  UpdateStylistServiceLinkPayload,
} from './stylist-service.types'

export function createStylistServiceLinkService(repository: StylistServiceLinkRepository) {
  const logger = createLogger('StylistServiceLinkService')

  /**
   * Verifică proactiv unicitatea pentru stilist și serviciu.
   */
  async function _ensureUniqueness(stylistId: string, serviceId: string) {
    const existing = await repository.checkUniqueness(stylistId, serviceId)
    if (existing) {
      logger.warn('Uniqueness violation detected.', { stylistId, serviceId })
      throw new UniquenessError(STYLIST_SERVICE_LINK_MESSAGES.ERROR.ALREADY_EXISTS, [
        { field: 'stylistId', message: STYLIST_SERVICE_LINK_MESSAGES.ERROR.ALREADY_EXISTS },
        { field: 'serviceId', message: STYLIST_SERVICE_LINK_MESSAGES.ERROR.ALREADY_EXISTS },
      ])
    }
  }

  /**
   * Verifică că legătura există înainte de operații de update/delete.
   */
  async function _ensureLinkExists(stylistId: string, serviceId: string) {
    const existing = await repository.findByStylistAndService(stylistId, serviceId)
    if (!existing) {
      logger.warn('Link not found for operation.', { stylistId, serviceId })
      throw new NotFoundError(STYLIST_SERVICE_LINK_MESSAGES.ERROR.NOT_FOUND)
    }
    return existing
  }

  return {
    /**
     * Obține toate legăturile (pentru admin)
     */
    getAllLinks: () => repository.findAll(),

    /**
     * Obține legăturile unui stilist
     */
    getLinksByStylistId: (stylistId: string) => repository.findByStylistId(stylistId),

    /**
     * Obține legăturile pentru un serviciu
     */
    getLinksByServiceId: (serviceId: string) => repository.findByServiceId(serviceId),

    /**
     * Obține legăturile bazate pe filtre
     */
    getLinksByFilters: (filters: StylistServiceLinkFilters) => repository.findByFilters(filters),

    /**
     * Obține o legătură după stilist și serviciu
     */
    getLinkById: (stylistId: string, serviceId: string) => repository.findByStylistAndService(stylistId, serviceId),

    /**
     * Creează o nouă legătură stylist-service
     */
    async createLink(payload: CreateStylistServiceLinkPayload) {
      const { stylistId, serviceId, customPrice, customDuration } = payload

      // Verificăm unicitatea
      await _ensureUniqueness(stylistId, serviceId)

      try {
        const link = await repository.create({
          stylistId,
          serviceId,
          customPrice,
          customDuration,
        })

        logger.info('Stylist service link created successfully.', {
          stylistId,
          serviceId,
          hasCustomPrice: !!customPrice,
          hasCustomDuration: !!customDuration,
        })

        return {
          success: true,
          message: STYLIST_SERVICE_LINK_MESSAGES.SUCCESS.CREATED,
          data: link,
        }
      } catch (error: any) {
        if (error instanceof UniquenessError) throw error
        logger.error('Failed to create stylist service link.', { error, stylistId, serviceId })
        throw new DatabaseError(STYLIST_SERVICE_LINK_MESSAGES.ERROR.CREATE_FAILED, { cause: error })
      }
    },

    /**
     * Actualizează o legătură stylist-service
     */
    async updateLink(stylistId: string, serviceId: string, data: UpdateStylistServiceLinkPayload) {
      // Verificăm că legătura există
      await _ensureLinkExists(stylistId, serviceId)

      try {
        const link = await repository.update(stylistId, serviceId, data)

        logger.info('Stylist service link updated successfully.', {
          stylistId,
          serviceId,
          updatedFields: Object.keys(data),
        })

        return {
          success: true,
          message: STYLIST_SERVICE_LINK_MESSAGES.SUCCESS.UPDATED,
          data: link,
        }
      } catch (error: any) {
        logger.error('Failed to update stylist service link.', { error, stylistId, serviceId })
        throw new DatabaseError(STYLIST_SERVICE_LINK_MESSAGES.ERROR.UPDATE_FAILED, { cause: error })
      }
    },

    /**
     * Șterge o legătură stylist-service
     */
    async deleteLink(stylistId: string, serviceId: string) {
      // Verificăm că legătura există
      await _ensureLinkExists(stylistId, serviceId)

      logger.info('Attempting to delete stylist service link...', { stylistId, serviceId })

      try {
        await repository.delete(stylistId, serviceId)

        logger.info('Stylist service link deleted successfully.', { stylistId, serviceId })

        return {
          success: true,
          message: STYLIST_SERVICE_LINK_MESSAGES.SUCCESS.DELETED,
        }
      } catch (error: any) {
        logger.error('Failed to delete stylist service link.', { error, stylistId, serviceId })
        throw new DatabaseError(STYLIST_SERVICE_LINK_MESSAGES.ERROR.DELETE_FAILED, { cause: error })
      }
    },

    /**
     * Verifică unicitatea pentru o legătură stylist-service
     */
    async checkForUniqueness(stylistId: string, serviceId: string) {
      const existing = await repository.checkUniqueness(stylistId, serviceId)
      if (existing) {
        logger.warn('Uniqueness check failed.', { stylistId, serviceId })
        throw new UniquenessError(STYLIST_SERVICE_LINK_MESSAGES.ERROR.ALREADY_EXISTS, [
          { field: 'stylistId', message: STYLIST_SERVICE_LINK_MESSAGES.ERROR.ALREADY_EXISTS },
          { field: 'serviceId', message: STYLIST_SERVICE_LINK_MESSAGES.ERROR.ALREADY_EXISTS },
        ])
      }
    },

    /**
     * Șterge toate legăturile unui stilist (util la ștergerea stilistului)
     */
    async deleteAllStylistLinks(stylistId: string) {
      logger.info('Deleting all links for stylist...', { stylistId })

      try {
        await repository.deleteByStylistId(stylistId)
        logger.info('All stylist links deleted successfully.', { stylistId })

        return {
          success: true,
          message: 'Toate legăturile stilistului au fost șterse cu succes.',
        }
      } catch (error: any) {
        logger.error('Failed to delete stylist links.', { error, stylistId })
        throw new DatabaseError('Nu s-au putut șterge legăturile stilistului.', { cause: error })
      }
    },

    /**
     * Șterge toate legăturile unui serviciu (util la ștergerea serviciului)
     */
    async deleteAllServiceLinks(serviceId: string) {
      logger.info('Deleting all links for service...', { serviceId })

      try {
        await repository.deleteByServiceId(serviceId)
        logger.info('All service links deleted successfully.', { serviceId })

        return {
          success: true,
          message: 'Toate legăturile serviciului au fost șterse cu succes.',
        }
      } catch (error: any) {
        logger.error('Failed to delete service links.', { error, serviceId })
        throw new DatabaseError('Nu s-au putut șterge legăturile serviciului.', { cause: error })
      }
    },
  }
}
