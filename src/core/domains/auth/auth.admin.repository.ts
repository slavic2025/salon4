// src/core/domains/auth/auth.admin.repository.ts

import type { User } from '@supabase/supabase-js'

import { createAdminClient } from '@/lib/supabase-admin'

/**
 * O funcție-fabrică pentru repository-ul de administrare a utilizatorilor.
 * Folosește clientul de admin Supabase pentru a interacționa cu schema `auth`.
 */
export function createAuthAdminRepository() {
  const supabaseAdmin = createAdminClient()

  return {
    /**
     * Găsește un utilizator în Supabase Auth pe baza adresei de email.
     * @param email - Adresa de email a utilizatorului de căutat.
     * @returns {Promise<User>} Obiectul utilizatorului.
     * @throws {Error} Aruncă o eroare dacă utilizatorul nu este găsit sau apar alte probleme.
     */
    async findUserByEmail(email: string): Promise<User> {
      const {
        data: { users },
        error,
      } = await supabaseAdmin.auth.admin.listUsers()

      if (error) {
        throw new Error(`Failed to fetch user by email: ${error.message}`)
      }
      const user = users.find((u) => u.email === email)

      if (!user) {
        throw new Error(`User with email "${email}" not found in Supabase Auth.`)
      }

      return user
    },
  }
}
