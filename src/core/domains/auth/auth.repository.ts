// src/core/domains/auth/auth.repository.ts

import type { User } from '@supabase/supabase-js'
import { eq } from 'drizzle-orm'

import type { DbClient } from '@/db'
import { admins } from '@/db/schema/admins'
import { stylists } from '@/db/schema/stylists'
import { ROLES, type UserRole } from '@/lib/constants'
import { createLogger } from '@/lib/logger'
import { createAdminClient } from '@/lib/supabase/admin'

import type { AuthRepository } from './auth.types'

/**
 * Repository pentru verificarea rolurilor utilizatorilor și gestionarea utilizatorilor.
 * Folosește Dependency Injection pattern.
 */
export function createAuthRepository(db: DbClient): AuthRepository {
  const logger = createLogger('AuthRepository')
  const supabaseAdmin = createAdminClient()

  return {
    /**
     * Găsește rolul unui utilizator pe baza ID-ului său.
     */
    async getUserRole(userId: string): Promise<UserRole> {
      // Verificăm dacă este admin
      const admin = await db.query.admins.findFirst({
        where: eq(admins.id, userId),
        columns: { id: true },
      })
      if (admin) return ROLES.ADMIN

      // Verificăm dacă este stilist
      const stylist = await db.query.stylists.findFirst({
        where: eq(stylists.id, userId),
        columns: { id: true },
      })
      if (stylist) return ROLES.STYLIST

      return null
    },

    /**
     * Găsește un utilizator în Supabase Auth pe baza adresei de email.
     * @param email - Adresa de email a utilizatorului de căutat.
     * @returns {Promise<User>} Obiectul utilizatorului.
     * @throws {Error} Aruncă o eroare dacă utilizatorul nu este găsit sau apar alte probleme.
     */
    async findUserByEmail(email: string): Promise<User> {
      logger.info('Attempting to find user by email...', { email })

      // Logica de a prelua toți utilizatorii și a filtra rămâne,
      // deoarece API-ul Supabase nu permite filtrarea directă aici.
      const {
        data: { users },
        error,
      } = await supabaseAdmin.auth.admin.listUsers()

      if (error) {
        // Logăm eroarea folosind logger-ul înainte de a o arunca
        logger.error('Failed to fetch user list from Supabase Auth.', { error })
        throw new Error(`Failed to fetch user by email: ${error.message}`)
      }

      const user = users.find((u) => u.email === email)

      if (!user) {
        // Logăm un avertisment dacă utilizatorul nu este găsit
        logger.warn('User not found in Supabase Auth.', { email })
        throw new Error(`User with email "${email}" not found in Supabase Auth.`)
      }

      logger.info('Successfully found user.', { userId: user.id, email: user.email })
      return user
    },
  }
}
