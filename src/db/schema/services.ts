import { relations } from 'drizzle-orm'
import { boolean, integer, numeric, pgEnum, pgTable, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core'

import { stylists } from './stylists' // Presupunem că acest fișier există deja

/**
 * Enum pentru categoriile de servicii.
 * Facilitează filtrarea și organizarea.
 */
export const serviceCategoryEnum = pgEnum('service_category', ['haircut', 'coloring', 'styling', 'treatment', 'other'])

/**
 * Tabela `services`
 * Stochează informații despre fiecare serviciu oferit.
 */
export const services = pgTable('services', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  // Folosim `numeric` pentru prețuri pentru a evita erorile de precizie cu float-uri.
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  // Durata serviciului în minute.
  duration: integer('duration').notNull(),
  category: serviceCategoryEnum('category').default('other'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
})

/**
 * Tabela de legătură (Junction Table) pentru relația Many-to-Many
 * între `stylists` și `services`.
 */
export const stylistsToServices = pgTable(
  'stylists_to_services',
  {
    stylistId: uuid('stylist_id')
      .notNull()
      .references(() => stylists.id, { onDelete: 'cascade' }),
    serviceId: uuid('service_id')
      .notNull()
      .references(() => services.id, { onDelete: 'cascade' }),
  },
  // --- REFACTORIZARE APLICATĂ AICI ---
  // Noul API folosește un array pentru constrângeri, permițând definirea mai multora.
  (table) => [
    primaryKey({ columns: [table.stylistId, table.serviceId] }),
    // Aici s-ar putea adăuga și alți indecși dacă ar fi necesar, de ex:
    // index('service_idx').on(table.serviceId),
  ],
)

// Relațiile Drizzle pentru `services`
export const servicesRelations = relations(services, ({ many }) => ({
  stylistsToServices: many(stylistsToServices),
}))

// Relațiile Drizzle pentru `stylistsToServices`
export const stylistsToServicesRelations = relations(stylistsToServices, ({ one }) => ({
  stylist: one(stylists, {
    fields: [stylistsToServices.stylistId],
    references: [stylists.id],
  }),
  service: one(services, {
    fields: [stylistsToServices.serviceId],
    references: [services.id],
  }),
}))
