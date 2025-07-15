// src/core/domains/auth/auth.service.ts
import { SupabaseClient, type User } from '@supabase/supabase-js'

import { type UserRole } from '@/lib/constants'
import { createLogger } from '@/lib/logger'

import { AUTH_MESSAGES } from './auth.constants'
import { AuthRepository } from './auth.repository'
import { SignInFormValues } from './auth.types'

export function createAuthService(repository: AuthRepository, supabase: SupabaseClient) {
  const logger = createLogger('AuthService')

  return {
    /**
     * Obține rolul utilizatorului autentificat din baza de date.
     * Returnează null dacă utilizatorul nu este autentificat sau nu are rol asignat.
     */
    async ensureUserRole(user: User | null): Promise<UserRole> {
      if (!user) {
        return null
      }

      logger.info(AUTH_MESSAGES.LOG.FETCHING_USER_ROLE, { userId: user.id })

      const role = await repository.getUserRole(user.id)

      if (!role) {
        logger.warn(AUTH_MESSAGES.LOG.USER_NO_ROLE_IN_DB_WARNING, { userId: user.id })
        return null
      }

      logger.debug(AUTH_MESSAGES.LOG.ROLE_FETCHED_SUCCESS, { userId: user.id, role })
      return role
    },

    /**
     * Autentifică un utilizator folosind email și parolă.
     */
    async signInWithPassword(credentials: SignInFormValues) {
      const { error } = await supabase.auth.signInWithPassword(credentials)

      if (error) {
        logger.warn(AUTH_MESSAGES.LOG.SIGN_IN_FAILED, { email: credentials.email, error: error.message })
        return { success: false, message: AUTH_MESSAGES.SERVER.INVALID_CREDENTIALS.message }
      }

      logger.info(AUTH_MESSAGES.LOG.SIGN_IN_SUCCESS, { email: credentials.email })
      return { success: true, message: AUTH_MESSAGES.SERVER.LOGIN_SUCCESS.message }
    },

    /**
     * Setează parola utilizatorului curent autentificat.
     */
    async setPassword(password: string) {
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        logger.error(AUTH_MESSAGES.LOG.SET_PASSWORD_FAILED, { error })
        return { success: false, message: error.message }
      }

      logger.info(AUTH_MESSAGES.LOG.SET_PASSWORD_SUCCESS)
      return { success: true, message: AUTH_MESSAGES.SERVER.PASSWORD_SET_SUCCESS.message }
    },

    /**
     * Setează parola unui utilizator invitat folosind tokenul de invitație.
     *
     * NOTĂ IMPORTANTĂ: Din motive de securitate, acest flow trebuie finalizat pe client, nu pe server.
     * Pe server nu avem acces la access_token/refresh_token din URL.
     *
     * Recomandare: Implementați această funcționalitate pe client folosind:
     * - supabase.auth.setSession() cu token-urile din URL
     * - supabase.auth.updateUser({ password }) după setarea sesiunii
     */
    async setPasswordWithToken(password: string, token_hash: string) {
      logger.warn(AUTH_MESSAGES.LOG.SET_PASSWORD_WITH_TOKEN_ATTEMPTED, { token_hash })

      return {
        success: false,
        message: AUTH_MESSAGES.SERVER.SET_PASSWORD_WITH_TOKEN_ERROR.message,
      }
    },

    /**
     * Deloghează utilizatorul curent.
     */
    async signOut() {
      const { error } = await supabase.auth.signOut()

      if (error) {
        logger.error(AUTH_MESSAGES.LOG.SIGN_OUT_FAILED, { error })
        throw new Error(AUTH_MESSAGES.SERVER.SIGN_OUT_ERROR.message)
      }

      logger.info(AUTH_MESSAGES.LOG.SIGN_OUT_SUCCESS)
    },
  }
}
