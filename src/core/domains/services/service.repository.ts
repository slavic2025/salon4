// src/core/domains/services/service.repository.ts

import { desc, eq, ilike } from 'drizzle-orm'

import { type DbClient } from '@/db'
import { services } from '@/db/schema/services'

import { type NewService, type Service, type ServiceCategory } from './service.types'

export function createServiceRepository(db: DbClient) {
  const TABLE = services

  const defaultOrderBy = {
    orderBy: [desc(services.createdAt)],
  }

  return {
    async findAll(): Promise<Service[]> {
      return db.query.services.findMany(defaultOrderBy)
    },
    async findById(id: string): Promise<Service | undefined> {
      return db.query.services.findFirst({ where: eq(TABLE.id, id) })
    },
    async findByName(name: string): Promise<Service | undefined> {
      return db.query.services.findFirst({ where: ilike(TABLE.name, name) })
    },
    async findActive(): Promise<Service[]> {
      return db.query.services.findMany({
        where: eq(TABLE.isActive, true),
        ...defaultOrderBy,
      })
    },
    async findByCategory(category: ServiceCategory): Promise<Service[]> {
      return db.query.services.findMany({
        where: eq(TABLE.category, category),
        ...defaultOrderBy,
      })
    },
    async create(newService: NewService): Promise<Service> {
      const [service] = await db.insert(TABLE).values(newService).returning()
      return service
    },
    async update(id: string, data: Partial<NewService>): Promise<Service> {
      const [service] = await db
        .update(TABLE)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(TABLE.id, id))
        .returning()
      return service
    },
    async delete(id: string): Promise<void> {
      await db.delete(TABLE).where(eq(TABLE.id, id))
    },
  }
}

export type ServiceRepository = ReturnType<typeof createServiceRepository>
