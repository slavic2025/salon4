// src/db/schema/work-schedules.ts

import { sql } from 'drizzle-orm'
import { check, integer, pgTable, time, timestamp, uuid } from 'drizzle-orm/pg-core'

import { stylists } from './stylists'

/**
 * Tabela `work_schedules`
 * Stochează programul de lucru al fiecărui stilist.
 * Un stilist poate avea mai multe intervale în aceeași zi.
 */
export const workSchedules = pgTable(
  'work_schedules',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    // Referință la stylist
    stylistId: uuid('stylist_id')
      .notNull()
      .references(() => stylists.id, { onDelete: 'cascade' }),

    // Ziua săptămânii: 0 = Luni, 1 = Marți, ..., 6 = Duminică
    dayOfWeek: integer('day_of_week').notNull(),

    // Orele de început și sfârșit
    startTime: time('start_time').notNull(),
    endTime: time('end_time').notNull(),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    // Constraint pentru day_of_week să fie între 0 și 6
    dayOfWeekCheck: check('day_of_week_check', sql`${table.dayOfWeek} >= 0 AND ${table.dayOfWeek} <= 6`),
    // Constraint pentru end_time să fie după start_time
    timeOrderCheck: check('time_order_check', sql`${table.endTime} > ${table.startTime}`),
  }),
)
