// src/db/schema/stylists.ts

import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const stylists = pgTable('stylists', {
  // Vom folosi același ID ca în tabela `auth.users` de la Supabase
  id: uuid('id').primaryKey(),

  fullName: text('full_name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone').notNull().unique(),
  description: text('description').notNull(),

  profilePicture: text('profile_picture'),
  isActive: boolean('is_active').notNull().default(true),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})
