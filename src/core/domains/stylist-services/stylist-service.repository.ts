import { and, eq } from 'drizzle-orm'

import type { DbClient } from '@/db'
import { stylistsToServices } from '@/db/schema/stylist-services'

import type { NewStylistServiceLink, StylistServiceLink } from './stylist-service.types'

export function createStylistServiceLinkRepository(db: DbClient) {
  const TABLE = stylistsToServices

  return {
    async findAll(): Promise<StylistServiceLink[]> {
      return db.query.stylistsToServices.findMany()
    },
    async findByStylistId(stylistId: string): Promise<StylistServiceLink[]> {
      return db.query.stylistsToServices.findMany({
        where: eq(TABLE.stylistId, stylistId),
      })
    },
    async findByServiceId(serviceId: string): Promise<StylistServiceLink[]> {
      return db.query.stylistsToServices.findMany({
        where: eq(TABLE.serviceId, serviceId),
      })
    },
    async create(newLink: NewStylistServiceLink): Promise<StylistServiceLink> {
      const [link] = await db.insert(TABLE).values(newLink).returning()
      return link
    },
    async update(
      stylistId: string,
      serviceId: string,
      data: Partial<NewStylistServiceLink>,
    ): Promise<StylistServiceLink> {
      const [link] = await db
        .update(TABLE)
        .set(data)
        .where(and(eq(TABLE.stylistId, stylistId), eq(TABLE.serviceId, serviceId)))
        .returning()
      return link
    },
    async delete(stylistId: string, serviceId: string): Promise<void> {
      await db.delete(TABLE).where(and(eq(TABLE.stylistId, stylistId), eq(TABLE.serviceId, serviceId)))
    },
  }
}

export type StylistServiceLinkRepository = ReturnType<typeof createStylistServiceLinkRepository>
