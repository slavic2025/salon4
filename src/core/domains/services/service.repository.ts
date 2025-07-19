// src/core/domains/services/service.repository.ts

import { desc, eq, ilike } from 'drizzle-orm'

import { type DbClient } from '@/db'
import { services } from '@/db/schema/services'

import type { CreateServiceData, Service, ServiceCategory, ServiceRepository, UpdateServiceData } from './service.types'

/**
 * Repository pentru gestionarea serviciilor cu Drizzle ORM
 * Folosește Dependency Injection pattern
 */
export function createServiceRepository(db: DbClient): ServiceRepository {
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
    /**
     * Găsește toate serviciile
     */
    async findAll(): Promise<Service[]> {
      return db.query.services.findMany(defaultOrderBy)
    },

    /**
     * Găsește un serviciu după ID
     */
    async findById(id: string): Promise<Service | undefined> {
      return _findOneBy('id', id)
    },

    /**
     * Găsește un serviciu după nume
     */
    async findByName(name: string): Promise<Service | undefined> {
      // Folosim ilike pentru căutare insensibilă la caz
      return db.query.services.findFirst({ where: ilike(TABLE.name, name) })
    },

    /**
     * Găsește serviciile după categorie
     */
    async findByCategory(category: ServiceCategory): Promise<Service[]> {
      return db.query.services.findMany({
        where: eq(TABLE.category, category),
        ...defaultOrderBy,
      })
    },

    /**
     * Găsește serviciile active
     */
    async findActive(): Promise<Service[]> {
      return db.query.services.findMany({
        where: eq(TABLE.isActive, true),
        ...defaultOrderBy,
      })
    },

    /**
     * Creează un serviciu nou
     */
    async create(newService: CreateServiceData): Promise<Service> {
      const [service] = await db.insert(TABLE).values(newService).returning()
      return service
    },

    /**
     * Actualizează un serviciu existent
     */
    async update(id: string, data: UpdateServiceData): Promise<Service> {
      const [service] = await db
        .update(TABLE)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(TABLE.id, id))
        .returning()
      return service
    },

    /**
     * Șterge un serviciu
     */
    async delete(id: string): Promise<void> {
      await db.delete(TABLE).where(eq(TABLE.id, id))
    },
  }
}

export type { ServiceRepository }
