// src/core/domains/stylists/stylist.repository.ts

import type { DbClient } from '@/db'

// Funcția-Fabrică pentru repository
export function createStylistRepository(db: DbClient) {
  return {
    /** Găsește toți stiliștii din baza de date, ordonați după data creării. */
    async findAll() {
      return db.query.stylists.findMany({
        orderBy: (stylists, { desc }) => [desc(stylists.createdAt)],
      })
    },
    // Aici vom adăuga findById, create, update etc., toate folosind `db.query.stylists...`
  }
}

// Exportăm și tipul pentru a-l putea folosi în serviciu
export type StylistRepository = ReturnType<typeof createStylistRepository>
