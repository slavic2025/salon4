// src/db/index.ts - Varianta finală, optimizată cu Singleton Pattern

import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as schema from './schema/_schema'

// Tipul pentru clientul nostru de bază de date, cu schema inclusă.
export type DbClient = PostgresJsDatabase<typeof schema>

// --- Implementarea Singleton Pattern ---

// Declarăm o variabilă globală pentru a stoca instanța clientului.
// `declare global { var client: ... }` extinde tipurile globale ale Node.js.
declare global {
  var client: postgres.Sql | undefined
}

let client: postgres.Sql
const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is not set in the environment variables.')
}

// În producție, folosim variabila globală pentru a partaja aceeași conexiune
// între diferite invocații de funcții serverless, prevenind epuizarea conexiunilor.
if (process.env.NODE_ENV === 'production') {
  if (!global.client) {
    global.client = postgres(connectionString, {
      prepare: false,
      ssl: 'require',
    })
  }
  client = global.client
} else {
  // În dezvoltare, creăm o nouă conexiune la fiecare reîncărcare a codului
  // pentru a ne asigura că vedem mereu cele mai noi modificări.
  client = postgres(connectionString, {
    prepare: false,
    ssl: 'require', // Este bine să folosim SSL și local pentru consistență
  })
}

// Injectăm schema pentru a avea type-safety și autocomplete.
export const db: DbClient = drizzle(client, { schema })
