// src/db/schema/admins.ts

import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

// Definim tabela 'admins'
export const admins = pgTable('admins', {
  // Cheia primară. Este și cheie externă către `auth.users.id`
  id: uuid('id').primaryKey(),
  // Un câmp pentru numele adminului, dacă este necesar
  fullName: text('full_name'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})