// src/db/schema/unavailabilities.ts

import { boolean, date, pgEnum, pgTable, text, time, timestamp, uuid } from 'drizzle-orm/pg-core'

import { stylists } from './stylists'

/**
 * Enum pentru tipurile de cauze pentru indisponibilitate
 */
export const unavailabilityCauseEnum = pgEnum('unavailability_cause', ['pauza', 'programare_offline', 'alta_situatie'])

/**
 * Tabela `unavailabilities`
 * Stochează intervalele de indisponibilitate pentru fiecare stilist.
 * Permite excluderea acestor intervale din logica de booking.
 */
export const unavailabilities = pgTable('unavailabilities', {
  id: uuid('id').defaultRandom().primaryKey(),

  // Referință la stylist
  stylistId: uuid('stylist_id')
    .notNull()
    .references(() => stylists.id, { onDelete: 'cascade' }),

  // Data pentru care se aplică indisponibilitatea
  date: date('date').notNull(),

  // Orar de indisponibilitate (poate fi null dacă all_day = true)
  startTime: time('start_time'),
  endTime: time('end_time'),

  // Tipul cauzei pentru indisponibilitate
  cause: unavailabilityCauseEnum('cause').notNull(),

  // Dacă este indisponibil toată ziua
  allDay: boolean('all_day').notNull().default(false),

  // Descriere opțională
  description: text('description'),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
})
