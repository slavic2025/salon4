import { boolean, integer, numeric, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

// Presupunem că acest fișier există deja

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
