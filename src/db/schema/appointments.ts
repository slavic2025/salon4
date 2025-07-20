import { relations } from 'drizzle-orm'
import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

import { services } from './services'
import { stylistsToServices } from './stylist-services'
import { stylists } from './stylists'

/**
 * Enum pentru statusurile programărilor.
 * Facilitează gestionarea stării programărilor.
 */
export const appointmentStatusEnum = pgEnum('appointment_status', [
  'waiting', // 0 - În așteptare
  'confirmed', // 1 - Confirmat
  'refused', // 2 - Refuzat
  'cancelled', // 3 - Anulat
  'completed', // 4 - Finalizat
  'no_show', // 5 - Clientul nu s-a prezentat
])

/**
 * Tabela `appointments`
 * Stochează informații despre programările clienților.
 */
export const appointments = pgTable('appointments', {
  id: uuid('id').defaultRandom().primaryKey(),
  // Informații client
  clientEmail: text('client_email').notNull(),
  clientName: text('client_name').notNull(),
  clientPhone: text('client_phone').notNull(),
  clientNotes: text('client_notes'),

  // Referințe la servicii și stilist
  serviceId: uuid('service_id')
    .notNull()
    .references(() => services.id, { onDelete: 'cascade' }),
  stylistId: uuid('stylist_id')
    .notNull()
    .references(() => stylists.id, { onDelete: 'cascade' }),

  // Programare temporală
  startTime: timestamp('start_time', { withTimezone: true }).notNull(),
  endTime: timestamp('end_time', { withTimezone: true }).notNull(),

  // Status și tracking
  status: appointmentStatusEnum('status').default('waiting').notNull(),

  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
})

/**
 * Relațiile pentru tabela appointments
 */
export const appointmentsRelations = relations(appointments, ({ one }) => ({
  service: one(services, {
    fields: [appointments.serviceId],
    references: [services.id],
  }),
  stylist: one(stylists, {
    fields: [appointments.stylistId],
    references: [stylists.id],
  }),
  stylistService: one(stylistsToServices, {
    fields: [appointments.stylistId, appointments.serviceId],
    references: [stylistsToServices.stylistId, stylistsToServices.serviceId],
  }),
}))
