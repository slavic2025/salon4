// src/db/schema/stylists.ts

import { pgTable, text, timestamp, boolean, uuid } from 'drizzle-orm/pg-core'

export const stylists = pgTable('stylists', {
  // Vom folosi același ID ca în tabela `auth.users` de la Supabase
  id: uuid('id').primaryKey(),

  fullName: text('full_name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone').unique(),
  description: text('description'),

  profilePicture: text('profile_picture'),
  isActive: boolean('is_active').default(true),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})
