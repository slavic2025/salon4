import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

// Încarcă variabilele din .env.local
config({ path: '.env.local' })

export default defineConfig({
  // Calea către schema - folosim fișierul principal de export
  schema: './src/db/schema/_schema.ts',

  // Calea unde Drizzle va salva fișierele de migrație
  out: './src/db/migrations',

  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },

  // Configurație optimizată pentru Supabase
  schemaFilter: ['public'],
  verbose: false, // Reduce noise în output
  strict: true,
})
