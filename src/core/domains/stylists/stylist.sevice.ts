import type { StylistRepository } from './stylist.repository'

// Funcția-Fabrică pentru serviciu, care primește repository-ul ca dependență
export function createStylistService(repository: StylistRepository) {
  return {
    /** Obține o listă cu toți stiliștii. */
    async getAllStylists() {
      // Aici poate exista logică de business suplimentară în viitor
      return repository.findAll()
    },
  }
}
