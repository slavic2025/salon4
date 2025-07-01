// src/core/domains/auth/auth.admin.repository.ts

import type { User } from '@supabase/supabase-js'

import { createLogger } from '@/lib/logger' // 1. Importăm logger-ul
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * O funcție-fabrică pentru repository-ul de administrare a utilizatorilor.
 * Folosește clientul de admin Supabase pentru a interacționa cu schema `auth`.
 */
export function createAuthAdminRepository() {
  // 2. Creăm o instanță a logger-ului cu un context specific
  const logger = createLogger('AuthAdminRepository')
  const supabaseAdmin = createAdminClient()

  return {
    /**
     * Găsește un utilizator în Supabase Auth pe baza adresei de email.
     * @param email - Adresa de email a utilizatorului de căutat.
     * @returns {Promise<User>} Obiectul utilizatorului.
     * @throws {Error} Aruncă o eroare dacă utilizatorul nu este găsit sau apar alte probleme.
     */
    async findUserByEmail(email: string): Promise<User> {
      logger.info(`Attempting to find user by email...`, { email })

      // Logica de a prelua toți utilizatorii și a filtra rămâne,
      // deoarece API-ul Supabase nu permite filtrarea directă aici.
      const {
        data: { users },
        error,
      } = await supabaseAdmin.auth.admin.listUsers()

      if (error) {
        // 3. Logăm eroarea folosind logger-ul înainte de a o arunca
        logger.error('Failed to fetch user list from Supabase Auth.', { error })
        throw new Error(`Failed to fetch user by email: ${error.message}`)
      }

      const user = users.find((u) => u.email === email)

      if (!user) {
        // Logăm un avertisment dacă utilizatorul nu este găsit
        logger.warn(`User not found in Supabase Auth.`, { email })
        throw new Error(`User with email "${email}" not found in Supabase Auth.`)
      }

      logger.info(`Successfully found user.`, { userId: user.id, email: user.email })
      return user
    },
  }
}
