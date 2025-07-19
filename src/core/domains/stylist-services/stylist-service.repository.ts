// src/core/domains/stylist-services/stylist-service.repository.ts

import { and, asc, eq, isNotNull, isNull, or } from 'drizzle-orm'

import type { DbClient } from '@/db'
import { stylistsToServices } from '@/db/schema/stylist-services'

import type {
  CreateStylistServiceLinkData,
  StylistServiceLink,
  StylistServiceLinkFilters,
} from './stylist-service.types'

export function createStylistServiceLinkRepository(db: DbClient) {
  const TABLE = stylistsToServices

  // Funcție privată pentru a găsi o singură înregistrare
  async function _findOneBy(field: 'stylistId' | 'serviceId', value: string): Promise<StylistServiceLink | undefined> {
    return db.query.stylistsToServices.findFirst({
      where: eq(TABLE[field], value),
    })
  }

  return {
    /**
     * Găsește toate legăturile stylist-service ordonate după stilist și serviciu
     */
    async findAll(): Promise<StylistServiceLink[]> {
      return db.query.stylistsToServices.findMany({
        orderBy: [asc(stylistsToServices.stylistId), asc(stylistsToServices.serviceId)],
      })
    },

    /**
     * Găsește o legătură după stilist și serviciu
     */
    async findByStylistAndService(stylistId: string, serviceId: string): Promise<StylistServiceLink | undefined> {
      return db.query.stylistsToServices.findFirst({
        where: and(eq(TABLE.stylistId, stylistId), eq(TABLE.serviceId, serviceId)),
      })
    },

    /**
     * Găsește toate legăturile unui stilist
     */
    async findByStylistId(stylistId: string): Promise<StylistServiceLink[]> {
      return db.query.stylistsToServices.findMany({
        where: eq(TABLE.stylistId, stylistId),
        orderBy: [asc(stylistsToServices.serviceId)],
      })
    },

    /**
     * Găsește toate legăturile pentru un serviciu
     */
    async findByServiceId(serviceId: string): Promise<StylistServiceLink[]> {
      return db.query.stylistsToServices.findMany({
        where: eq(TABLE.serviceId, serviceId),
        orderBy: [asc(stylistsToServices.stylistId)],
      })
    },

    /**
     * Găsește legăturile bazate pe filtre
     */
    async findByFilters(filters: StylistServiceLinkFilters): Promise<StylistServiceLink[]> {
      const conditions = []

      if (filters.stylistId) {
        conditions.push(eq(TABLE.stylistId, filters.stylistId))
      }

      if (filters.serviceId) {
        conditions.push(eq(TABLE.serviceId, filters.serviceId))
      }

      if (filters.hasCustomPrice === true) {
        conditions.push(isNotNull(TABLE.customPrice))
      } else if (filters.hasCustomPrice === false) {
        conditions.push(isNull(TABLE.customPrice))
      }

      if (filters.hasCustomDuration === true) {
        conditions.push(isNotNull(TABLE.customDuration))
      } else if (filters.hasCustomDuration === false) {
        conditions.push(isNull(TABLE.customDuration))
      }

      const whereCondition = conditions.length > 0 ? and(...conditions) : undefined

      return db.query.stylistsToServices.findMany({
        where: whereCondition,
        orderBy: [asc(stylistsToServices.stylistId), asc(stylistsToServices.serviceId)],
      })
    },

    /**
     * Creează o nouă legătură stylist-service
     */
    async create(newLink: CreateStylistServiceLinkData): Promise<StylistServiceLink> {
      const [link] = await db.insert(TABLE).values(newLink).returning()
      return link
    },

    /**
     * Actualizează o legătură stylist-service
     */
    async update(
      stylistId: string,
      serviceId: string,
      data: Partial<CreateStylistServiceLinkData>,
    ): Promise<StylistServiceLink> {
      const [link] = await db
        .update(TABLE)
        .set(data)
        .where(and(eq(TABLE.stylistId, stylistId), eq(TABLE.serviceId, serviceId)))
        .returning()
      return link
    },

    /**
     * Șterge o legătură stylist-service
     */
    async delete(stylistId: string, serviceId: string): Promise<void> {
      await db.delete(TABLE).where(and(eq(TABLE.stylistId, stylistId), eq(TABLE.serviceId, serviceId)))
    },

    /**
     * Verifică dacă există deja o legătură pentru stilist și serviciu
     */
    async checkUniqueness(stylistId: string, serviceId: string): Promise<StylistServiceLink | undefined> {
      return db.query.stylistsToServices.findFirst({
        where: and(eq(TABLE.stylistId, stylistId), eq(TABLE.serviceId, serviceId)),
      })
    },

    /**
     * Găsește legăturile pentru mai mulți stiliști (pentru admin)
     */
    async findByMultipleStylists(stylistIds: string[]): Promise<StylistServiceLink[]> {
      if (stylistIds.length === 0) return []

      return db.query.stylistsToServices.findMany({
        where: or(...stylistIds.map((id) => eq(TABLE.stylistId, id))),
        orderBy: [asc(stylistsToServices.stylistId), asc(stylistsToServices.serviceId)],
      })
    },

    /**
     * Găsește legăturile pentru mai multe servicii (pentru admin)
     */
    async findByMultipleServices(serviceIds: string[]): Promise<StylistServiceLink[]> {
      if (serviceIds.length === 0) return []

      return db.query.stylistsToServices.findMany({
        where: or(...serviceIds.map((id) => eq(TABLE.serviceId, id))),
        orderBy: [asc(stylistsToServices.serviceId), asc(stylistsToServices.stylistId)],
      })
    },

    /**
     * Șterge toate legăturile unui stilist (util la ștergerea stilistului)
     */
    async deleteByStylistId(stylistId: string): Promise<void> {
      await db.delete(TABLE).where(eq(TABLE.stylistId, stylistId))
    },

    /**
     * Șterge toate legăturile unui serviciu (util la ștergerea serviciului)
     */
    async deleteByServiceId(serviceId: string): Promise<void> {
      await db.delete(TABLE).where(eq(TABLE.serviceId, serviceId))
    },
  }
}

export type StylistServiceLinkRepository = ReturnType<typeof createStylistServiceLinkRepository>
