// src/core/domains/services/service.repository.ts

import { eq, ilike } from 'drizzle-orm'

import { type DbClient } from '@/db'
import { services } from '@/db/schema/services'

import { type NewService, type Service, type ServiceCategory } from './service.types'

export function createServiceRepository(db: DbClient) {
  // 1. Extragem logica de sortare într-o constantă locală (DRY)
  const defaultOrderBy = {
    orderBy: (table: any, { desc }: any) => [desc(table.createdAt)],
  } as const

  return {
    /** Găsește toate serviciile, ordonate implicit. */
    async findAll(): Promise<Service[]> {
      return db.query.services.findMany(defaultOrderBy)
    },

    /** Găsește un serviciu după ID. */
    async findById(id: string): Promise<Service | undefined> {
      return db.query.services.findFirst({
        where: eq(services.id, id),
      })
    },

    /** Găsește un serviciu după nume (case-insensitive). */
    async findByName(name: string): Promise<Service | undefined> {
      return db.query.services.findFirst({
        where: ilike(services.name, name),
      })
    },

    /** Găsește toate serviciile active. */
    async findActive(): Promise<Service[]> {
      return db.query.services.findMany({
        where: eq(services.isActive, true),
        ...defaultOrderBy, // 2. Refolosim constanta de sortare
      })
    },

    /** Găsește toate serviciile dintr-o anumită categorie. */
    async findByCategory(category: ServiceCategory): Promise<Service[]> {
      return db.query.services.findMany({
        where: eq(services.category, category),
        ...defaultOrderBy, // 2. Refolosim constanta de sortare
      })
    },

    /** Creează un serviciu nou în baza de date. */
    async create(newService: NewService): Promise<Service> {
      // 3. Denumire corectată
      const [service] = await db.insert(services).values(newService).returning()
      return service
    },

    /** Actualizează un serviciu existent după ID. */
    async update(id: string, data: Partial<NewService>): Promise<Service> {
      const [service] = await db
        .update(services)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(services.id, id))
        .returning()
      return service
    },

    /** Șterge un serviciu după ID. */
    async delete(id: string): Promise<void> {
      await db.delete(services).where(eq(services.id, id))
    },
  }
}

export type ServiceRepository = ReturnType<typeof createServiceRepository>
