// src/core/domains/stylists/stylist.repository.ts

import { eq } from 'drizzle-orm'

import type { DbClient } from '@/db'
import { stylists } from '@/db/schema/stylists'

import type { NewStylist, Stylist } from './stylist.types'

export function createStylistRepository(db: DbClient) {
  return {
    /** Găsește toți stiliștii, ordonați după data creării. */
    async findAll(): Promise<Stylist[]> {
      return db.query.stylists.findMany({
        orderBy: (stylists, { desc }) => [desc(stylists.createdAt)],
      })
    },

    /** Găsește un stilist după ID. */
    async findById(id: string): Promise<Stylist | undefined> {
      return db.query.stylists.findFirst({
        where: eq(stylists.id, id),
      })
    },

    /** Găsește un stilist după adresa de email. */
    async findByEmail(email: string): Promise<Stylist | undefined> {
      return db.query.stylists.findFirst({
        where: eq(stylists.email, email),
      })
    },

    /** Găsește un stilist după numărul de telefon. */
    async findByPhone(phone: string): Promise<Stylist | undefined> {
      return db.query.stylists.findFirst({
        where: eq(stylists.phone, phone),
      })
    },

    /** Creează un profil nou de stilist în baza de date. */
    async create(newStylist: NewStylist): Promise<Stylist> {
      const [stylist] = await db.insert(stylists).values(newStylist).returning()
      return stylist
    },

    /** Actualizează profilul unui stilist. */
    async update(id: string, data: Partial<NewStylist>): Promise<Stylist> {
      const [stylist] = await db
        .update(stylists)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(stylists.id, id))
        .returning()
      return stylist
    },

    /** Șterge un profil de stilist. */
    async delete(id: string): Promise<void> {
      await db.delete(stylists).where(eq(stylists.id, id))
    },
  }
}

export type StylistRepository = ReturnType<typeof createStylistRepository>
