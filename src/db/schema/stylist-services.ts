import { relations } from 'drizzle-orm'
import { integer, numeric, pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core'

import { services } from './services'
import { stylists } from './stylists'

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
    customPrice: numeric('custom_price', { precision: 10, scale: 2 }),
    customDuration: integer('custom_duration'),
  },
  (table) => [primaryKey({ columns: [table.stylistId, table.serviceId] })],
)

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
