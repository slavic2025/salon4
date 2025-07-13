import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

// Încarcă variabilele din .env.local
config({ path: '.env.local' })

console.log('DATABASE_URL:', process.env.DATABASE_URL)

export default defineConfig({
  // Calea către fișierele unde definim tabelele (schema)
  schema: './src/db/schema/*',

  // Calea unde Drizzle va salva fișierele de migrație
  out: './src/db/migrations',

  dialect: 'postgresql',
  dbCredentials: {
    // Acum, process.env.DATABASE_URL este garantat să aibă o valoare
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
})
