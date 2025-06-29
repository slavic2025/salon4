import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import { stylists } from '@/db/schema/stylists'

// Funcția-Fabrică pentru repository
export function createStylistRepository(db: PostgresJsDatabase) {
  return {
    /** Găsește toți stiliștii din baza de date. */
    async findAll() {
      // Folosește instanța `db` injectată
      return db.select().from(stylists)
    },
    // Aici vom adăuga findById, create, update etc., toate folosind `db`
  }
}

// Exportăm și tipul pentru a-l putea folosi în serviciu
export type StylistRepository = ReturnType<typeof createStylistRepository>