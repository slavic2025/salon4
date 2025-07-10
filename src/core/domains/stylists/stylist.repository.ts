// src/core/domains/stylists/stylist.repository.ts

import { eq } from 'drizzle-orm'
import { desc } from 'drizzle-orm'

import { type DbClient } from '@/db'
import { stylists } from '@/db/schema/stylists'

import type { NewStylist, Stylist } from './stylist.types'

export function createStylistRepository(db: DbClient) {
  const TABLE = stylists

  // Funcție privată, generică, pentru a găsi o singură înregistrare.
  async function _findOneBy(field: keyof Stylist, value: string): Promise<Stylist | undefined> {
    return db.query.stylists.findFirst({
      where: eq(TABLE[field], value),
    })
  }

  return {
    async findAll(): Promise<Stylist[]> {
      return db.query.stylists.findMany({
        orderBy: [desc(stylists.createdAt)],
      })
    },
    async findById(id: string): Promise<Stylist | undefined> {
      return _findOneBy('id', id)
    },
    async findByEmail(email: string): Promise<Stylist | undefined> {
      return _findOneBy('email', email)
    },
    async findByPhone(phone: string): Promise<Stylist | undefined> {
      return _findOneBy('phone', phone)
    },
    async create(newStylist: NewStylist): Promise<Stylist> {
      const [stylist] = await db.insert(TABLE).values(newStylist).returning()
      return stylist
    },
    async update(id: string, data: Partial<NewStylist>): Promise<Stylist> {
      const [stylist] = await db
        .update(TABLE)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(TABLE.id, id))
        .returning()
      return stylist
    },
    async delete(id: string): Promise<void> {
      await db.delete(TABLE).where(eq(TABLE.id, id))
    },
  }
}

export type StylistRepository = ReturnType<typeof createStylistRepository>
