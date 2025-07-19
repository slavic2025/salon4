// src/core/domains/auth/auth.service.ts

import type { SupabaseClient, User } from '@supabase/supabase-js'

import { type UserRole } from '@/lib/constants'
import { createLogger } from '@/lib/logger'

import { AUTH_LOG_MESSAGES, AUTH_SERVER_MESSAGES } from './auth.constants'
import type { AuthRepository, AuthService, SignInData } from './auth.types'

/**
 * Business logic pentru gestionarea autentificării
 * Folosește Dependency Injection pattern și validatori centralizați
 */
export function createAuthService(repository: AuthRepository, supabase: SupabaseClient): AuthService {
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

      logger.info(AUTH_LOG_MESSAGES.FETCHING_USER_ROLE, { userId: user.id })

      const role = await repository.getUserRole(user.id)

      if (!role) {
        logger.warn(AUTH_LOG_MESSAGES.USER_NO_ROLE_IN_DB_WARNING, { userId: user.id })
        return null
      }

      logger.debug(AUTH_LOG_MESSAGES.ROLE_FETCHED_SUCCESS, { userId: user.id, role })
      return role
    },

    /**
     * Autentifică un utilizator folosind email și parolă.
     */
    async signInWithPassword(credentials: SignInData) {
      const { error } = await supabase.auth.signInWithPassword(credentials)

      if (error) {
        logger.warn(AUTH_LOG_MESSAGES.SIGN_IN_FAILED, { email: credentials.email, error: error.message })
        return { success: false, message: AUTH_SERVER_MESSAGES.INVALID_CREDENTIALS.message }
      }

      logger.info(AUTH_LOG_MESSAGES.SIGN_IN_SUCCESS, { email: credentials.email })
      return { success: true, message: AUTH_SERVER_MESSAGES.LOGIN_SUCCESS.message }
    },

    /**
     * Setează parola utilizatorului curent autentificat.
     */
    async setPassword(password: string) {
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        logger.error(AUTH_LOG_MESSAGES.SET_PASSWORD_FAILED, { error })
        return { success: false, message: error.message }
      }

      logger.info(AUTH_LOG_MESSAGES.SET_PASSWORD_SUCCESS)
      return { success: true, message: AUTH_SERVER_MESSAGES.PASSWORD_SET_SUCCESS.message }
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
      logger.warn(AUTH_LOG_MESSAGES.SET_PASSWORD_WITH_TOKEN_ATTEMPTED, { token_hash })

      return {
        success: false,
        message: AUTH_SERVER_MESSAGES.SET_PASSWORD_WITH_TOKEN_ERROR.message,
      }
    },

    /**
     * Deloghează utilizatorul curent.
     */
    async signOut() {
      const { error } = await supabase.auth.signOut()

      if (error) {
        logger.error(AUTH_LOG_MESSAGES.SIGN_OUT_FAILED, { error })
        throw new Error(AUTH_SERVER_MESSAGES.SIGN_OUT_ERROR.message)
      }

      logger.info(AUTH_LOG_MESSAGES.SIGN_OUT_SUCCESS)
    },
  }
}
