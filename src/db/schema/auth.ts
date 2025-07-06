// src/db/schema/auth.ts

import { pgSchema, timestamp, uuid } from 'drizzle-orm/pg-core'

// Definim schema `auth` pentru a putea accesa tabela `users`
export const authSchema = pgSchema('auth')

// Definim structura tabelei `auth.users` de care avem nevoie
export const users = authSchema.table('users', {
  id: uuid('id').primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }),
  // Adaugă alte coloane din auth.users dacă ai nevoie de ele
})
