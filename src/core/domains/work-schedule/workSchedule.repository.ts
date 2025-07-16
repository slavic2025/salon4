// src/core/domains/work-schedule/workSchedule.repository.ts

import { and, asc, eq, gte, lte, ne, or } from 'drizzle-orm'

import { type DbClient } from '@/db'
import { workSchedules } from '@/db/schema/work-schedules'

import type { DayOfWeek, NewWorkSchedule, WorkSchedule } from './workSchedule.types'

export function createWorkScheduleRepository(db: DbClient) {
  const TABLE = workSchedules

  // Funcție privată pentru a găsi o singură înregistrare
  async function _findOneBy(field: keyof WorkSchedule, value: string | number): Promise<WorkSchedule | undefined> {
    return db.query.workSchedules.findFirst({
      where: eq(TABLE[field], value),
    })
  }

  return {
    /**
     * Găsește toate programele de lucru ordonate după zi și ora de început
     */
    async findAll(): Promise<WorkSchedule[]> {
      return db.query.workSchedules.findMany({
        orderBy: [asc(workSchedules.dayOfWeek), asc(workSchedules.startTime)],
      })
    },

    /**
     * Găsește un program după ID
     */
    async findById(id: string): Promise<WorkSchedule | undefined> {
      return _findOneBy('id', id)
    },

    /**
     * Găsește toate programele unui stilist
     */
    async findByStylistId(stylistId: string): Promise<WorkSchedule[]> {
      return db.query.workSchedules.findMany({
        where: eq(TABLE.stylistId, stylistId),
        orderBy: [asc(workSchedules.dayOfWeek), asc(workSchedules.startTime)],
      })
    },

    /**
     * Găsește programele unui stilist pentru o anumită zi
     */
    async findByStylistAndDay(stylistId: string, dayOfWeek: DayOfWeek): Promise<WorkSchedule[]> {
      return db.query.workSchedules.findMany({
        where: and(eq(TABLE.stylistId, stylistId), eq(TABLE.dayOfWeek, dayOfWeek)),
        orderBy: [asc(workSchedules.startTime)],
      })
    },

    /**
     * Verifică dacă există suprapuneri de timp pentru un stilist în aceeași zi
     * Două intervale se suprapun dacă: startTime < existingEndTime && endTime > existingStartTime
     */
    async checkTimeOverlap(
      stylistId: string,
      dayOfWeek: DayOfWeek,
      startTime: string,
      endTime: string,
      excludeId?: string,
    ): Promise<WorkSchedule[]> {
      let whereCondition = and(
        eq(TABLE.stylistId, stylistId),
        eq(TABLE.dayOfWeek, dayOfWeek),
        // Verificăm suprapunerea: startTime < existing.endTime && endTime > existing.startTime
        and(
          lte(TABLE.startTime, endTime), // existing.startTime <= endTime
          gte(TABLE.endTime, startTime), // existing.endTime >= startTime
        ),
      )

      // Excludem intervalul curent dacă edităm
      if (excludeId) {
        whereCondition = and(whereCondition, ne(TABLE.id, excludeId))
      }

      return db.query.workSchedules.findMany({
        where: whereCondition,
      })
    },

    /**
     * Creează un nou interval de program
     */
    async create(newSchedule: NewWorkSchedule): Promise<WorkSchedule> {
      const [schedule] = await db.insert(TABLE).values(newSchedule).returning()
      return schedule
    },

    /**
     * Actualizează un interval de program
     */
    async update(id: string, data: Partial<NewWorkSchedule>): Promise<WorkSchedule> {
      const [schedule] = await db
        .update(TABLE)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(TABLE.id, id))
        .returning()
      return schedule
    },

    /**
     * Șterge un interval de program
     */
    async delete(id: string): Promise<void> {
      await db.delete(TABLE).where(eq(TABLE.id, id))
    },

    /**
     * Șterge toate programele unui stilist
     */
    async deleteByStylistId(stylistId: string): Promise<void> {
      await db.delete(TABLE).where(eq(TABLE.stylistId, stylistId))
    },

    /**
     * Găsește programele pentru mai mulți stiliști (pentru admin)
     */
    async findByMultipleStylists(stylistIds: string[]): Promise<WorkSchedule[]> {
      if (stylistIds.length === 0) return []

      return db.query.workSchedules.findMany({
        where: or(...stylistIds.map((id) => eq(TABLE.stylistId, id))),
        orderBy: [asc(workSchedules.stylistId), asc(workSchedules.dayOfWeek), asc(workSchedules.startTime)],
      })
    },
  }
}

export type WorkScheduleRepository = ReturnType<typeof createWorkScheduleRepository>
