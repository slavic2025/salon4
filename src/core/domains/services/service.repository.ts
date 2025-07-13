// src/core/domains/services/service.repository.ts

import { desc, eq, ilike } from 'drizzle-orm'

import { type DbClient } from '@/db'
import { services } from '@/db/schema/services'

import type { NewService, Service, ServiceCategory } from './service.types'

export function createServiceRepository(db: DbClient) {
  const TABLE = services

  // Funcție privată, generică, pentru a găsi o singură înregistrare.
  async function _findOneBy(field: keyof Service, value: string): Promise<Service | undefined> {
    return db.query.services.findFirst({
      where: eq(TABLE[field], value),
    })
  }

  const defaultOrderBy = {
    orderBy: [desc(services.createdAt)],
  }

  return {
    async findAll(): Promise<Service[]> {
      return db.query.services.findMany(defaultOrderBy)
    },
    async findById(id: string): Promise<Service | undefined> {
      return _findOneBy('id', id)
    },
    async findByName(name: string): Promise<Service | undefined> {
      // Folosim ilike pentru căutare insensibilă la caz
      return db.query.services.findFirst({ where: ilike(TABLE.name, name) })
    },
    async findByCategory(category: ServiceCategory): Promise<Service[]> {
      return db.query.services.findMany({
        where: eq(TABLE.category, category),
        ...defaultOrderBy,
      })
    },
    async findActive(): Promise<Service[]> {
      return db.query.services.findMany({
        where: eq(TABLE.isActive, true),
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
