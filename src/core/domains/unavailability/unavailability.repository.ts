// src/core/domains/unavailability/unavailability.repository.ts

import { and, eq, gte, lte, not, or } from 'drizzle-orm'

import type { DbClient } from '@/db'
import { stylists } from '@/db/schema/stylists'
import { unavailabilities } from '@/db/schema/unavailabilities'

import {
  type CreateUnavailabilityData,
  type Unavailability,
  type UnavailabilityFilters,
  type UnavailabilityRepository,
  type UnavailabilityWithStylist,
  type UpdateUnavailabilityData,
} from './unavailability.types'

/**
 * Repository pentru gestionarea unavailabilities cu Drizzle ORM
 * Folosește Dependency Injection pattern
 */
export const createUnavailabilityRepository = (db: DbClient): UnavailabilityRepository => {
  return {
    /**
     * Găsește o indisponibilitate după ID
     */
    async findById(id: string): Promise<Unavailability | null> {
      const results = await db.select().from(unavailabilities).where(eq(unavailabilities.id, id)).limit(1)

      return results[0] || null
    },

    /**
     * Găsește indisponibilități după filtru
     */
    async findByFilters(filters: UnavailabilityFilters): Promise<Unavailability[]> {
      const conditions = []

      if (filters.stylistId) {
        conditions.push(eq(unavailabilities.stylistId, filters.stylistId))
      }

      if (filters.dateFrom) {
        conditions.push(gte(unavailabilities.date, filters.dateFrom))
      }

      if (filters.dateTo) {
        conditions.push(lte(unavailabilities.date, filters.dateTo))
      }

      if (filters.cause) {
        conditions.push(eq(unavailabilities.cause, filters.cause))
      }

      if (filters.allDay !== undefined) {
        conditions.push(eq(unavailabilities.allDay, filters.allDay))
      }

      const query = db.select().from(unavailabilities).orderBy(unavailabilities.date, unavailabilities.startTime)

      if (conditions.length > 0) {
        query.where(and(...conditions))
      }

      return await query
    },

    /**
     * Găsește indisponibilități pentru un stylist în interval de date
     */
    async findByStylistId(stylistId: string, dateFrom?: string, dateTo?: string): Promise<Unavailability[]> {
      const conditions = [eq(unavailabilities.stylistId, stylistId)]

      if (dateFrom) {
        conditions.push(gte(unavailabilities.date, dateFrom))
      }

      if (dateTo) {
        conditions.push(lte(unavailabilities.date, dateTo))
      }

      return await db
        .select()
        .from(unavailabilities)
        .where(and(...conditions))
        .orderBy(unavailabilities.date, unavailabilities.startTime)
    },

    /**
     * Găsește indisponibilități cu detalii stylist pentru afișare
     */
    async findWithStylistDetails(filters: UnavailabilityFilters): Promise<UnavailabilityWithStylist[]> {
      const conditions = []

      if (filters.stylistId) {
        conditions.push(eq(unavailabilities.stylistId, filters.stylistId))
      }

      if (filters.dateFrom) {
        conditions.push(gte(unavailabilities.date, filters.dateFrom))
      }

      if (filters.dateTo) {
        conditions.push(lte(unavailabilities.date, filters.dateTo))
      }

      if (filters.cause) {
        conditions.push(eq(unavailabilities.cause, filters.cause))
      }

      if (filters.allDay !== undefined) {
        conditions.push(eq(unavailabilities.allDay, filters.allDay))
      }

      const query = db
        .select({
          // Unavailability fields
          id: unavailabilities.id,
          stylistId: unavailabilities.stylistId,
          date: unavailabilities.date,
          startTime: unavailabilities.startTime,
          endTime: unavailabilities.endTime,
          cause: unavailabilities.cause,
          allDay: unavailabilities.allDay,
          description: unavailabilities.description,
          createdAt: unavailabilities.createdAt,
          updatedAt: unavailabilities.updatedAt,
          // Stylist details
          stylist: {
            id: stylists.id,
            fullName: stylists.fullName,
            email: stylists.email,
          },
        })
        .from(unavailabilities)
        .innerJoin(stylists, eq(unavailabilities.stylistId, stylists.id))
        .orderBy(unavailabilities.date, unavailabilities.startTime)

      if (conditions.length > 0) {
        query.where(and(...conditions))
      }

      return await query
    },

    /**
     * Creează o nouă indisponibilitate
     */
    async create(data: CreateUnavailabilityData): Promise<Unavailability> {
      const results = await db
        .insert(unavailabilities)
        .values({
          stylistId: data.stylistId,
          date: data.date,
          startTime: data.startTime,
          endTime: data.endTime,
          cause: data.cause,
          allDay: data.allDay,
          description: data.description,
        })
        .returning()

      return results[0]
    },

    /**
     * Actualizează o indisponibilitate existentă
     */
    async update(id: string, data: UpdateUnavailabilityData): Promise<Unavailability | null> {
      const results = await db
        .update(unavailabilities)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(unavailabilities.id, id))
        .returning()

      return results[0] || null
    },

    /**
     * Șterge o indisponibilitate
     */
    async delete(id: string): Promise<boolean> {
      const results = await db.delete(unavailabilities).where(eq(unavailabilities.id, id)).returning()

      return results.length > 0
    },

    /**
     * Verifică conflicte cu alte indisponibilități
     * Returnează lista conflictelor găsite
     */
    async checkConflicts(
      stylistId: string,
      date: string,
      startTime?: string,
      endTime?: string,
      excludeId?: string,
    ): Promise<Unavailability[]> {
      const conditions = [eq(unavailabilities.stylistId, stylistId), eq(unavailabilities.date, date)]

      // Excludem ID-ul curent dacă este update
      if (excludeId) {
        conditions.push(not(eq(unavailabilities.id, excludeId)))
      }

      // Dacă verificăm pentru toată ziua sau intervalul nou este toată ziua
      if (!startTime || !endTime) {
        // Conflict cu orice indisponibilitate în aceeași zi
        return await db
          .select()
          .from(unavailabilities)
          .where(and(...conditions))
      }

      // Verificăm suprapuneri de timp:
      // 1. Indisponibilitate toată ziua în aceeași dată
      // 2. Intervale care se suprapun
      const timeConflictConditions = [
        ...conditions,
        or(
          // Indisponibilitate toată ziua
          eq(unavailabilities.allDay, true),
          // Suprapuneri de timp
          and(
            eq(unavailabilities.allDay, false),
            or(
              // Noul interval începe înainte de sfârșitul celui existent
              // și se termină după începutul celui existent
              and(lte(unavailabilities.startTime, endTime), gte(unavailabilities.endTime, startTime)),
            ),
          ),
        ),
      ]

      return await db
        .select()
        .from(unavailabilities)
        .where(and(...timeConflictConditions))
    },
  }
}
