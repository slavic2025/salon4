// src/core/domains/auth/auth.service.ts - Varianta finală, "best practice"
import { SupabaseClient, type User } from '@supabase/supabase-js'

import { APP_ROUTES, type UserRole } from '@/lib/constants'
import { createLogger } from '@/lib/logger'

import { AUTH_MESSAGES, ROLE_DASHBOARD_MAP } from './auth.constants'
import { AuthRepository } from './auth.repository'
import { SignInFormValues } from './auth.types'

// Definim stările posibile pe care le poate returna logica de autorizare
type AuthDecision = { status: 'PROCEED' } | { status: 'REDIRECT'; path: string } | { status: 'ERROR'; code: string }

export function createAuthService(repository: AuthRepository, supabase: SupabaseClient) {
  const logger = createLogger('AuthService')

  return {
    /**
     * Punctul central de decizie pentru autorizare.
     * Returnează un obiect de decizie, nu un NextResponse.
     */
    getAuthorizationDecision(pathname: string, user: User | null, role: UserRole): AuthDecision {
      const isProtectedRoute =
        pathname.startsWith(APP_ROUTES.ADMIN_DASHBOARD) || pathname.startsWith(APP_ROUTES.STYLIST_DASHBOARD)

      // Cazul 1: Utilizator logat, dar fără rol.
      if (user && !role) {
        logger.warn('User is authenticated but has no role.', { userId: user.id })
        return { status: 'ERROR', code: AUTH_MESSAGES.SERVER.NO_ROLE_ASSIGNED.code }
      }

      // Cazul 2: Ruta nu este protejată.
      if (!isProtectedRoute) {
        return { status: 'PROCEED' }
      }

      // De aici, ruta este protejată.
      // Cazul 3: Utilizator nelogat.
      if (!user) {
        return { status: 'REDIRECT', path: APP_ROUTES.LOGIN }
      }

      // Cazul 4: Utilizator logat cu rol, dar pe calea greșită.
      const expectedDashboard = ROLE_DASHBOARD_MAP[role!] // Folosim ! deoarece am validat `role` mai sus
      if (expectedDashboard && !pathname.startsWith(expectedDashboard)) {
        return { status: 'REDIRECT', path: expectedDashboard }
      }

      // Cazul 5: "Happy path" - utilizatorul este la locul potrivit.
      return { status: 'PROCEED' }
    },

    async ensureUserRole(user: User | null): Promise<UserRole> {
      // Dacă nu există un utilizator autentificat, nu există nici rol.
      if (!user) {
        return null
      }

      logger.info('Fetching user role directly from the database...', { userId: user.id })

      // Delegăm căutarea către repository, care știe cum să interogheze tabelele.
      const role = await repository.getUserRole(user.id)

      if (!role) {
        // Logăm un avertisment dacă un utilizator autentificat nu are un rol în tabelele noastre.
        logger.warn('Authenticated user has no role assigned in the database.', { userId: user.id })
        return null
      }

      logger.debug('Role successfully fetched from database.', { userId: user.id, role })
      return role
    },

    /**
     * Autentifică un utilizator folosind email și parolă.
     */
    async signInWithPassword(credentials: SignInFormValues) {
      // Folosește clientul injectat, nu mai crează unul nou.
      const { error } = await supabase.auth.signInWithPassword(credentials)

      if (error) {
        logger.warn('Failed sign-in attempt.', { email: credentials.email, error: error.message })
        return { success: false, message: AUTH_MESSAGES.SERVER.INVALID_CREDENTIALS.message }
      }

      logger.info('User signed in successfully.', { email: credentials.email })
      return { success: true, message: AUTH_MESSAGES.SERVER.LOGIN_SUCCESS.message }
    },

    /**
     * Setează parola utilizatorului curent.
     */
    async setPassword(password: string) {
      // Folosește clientul injectat.
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        logger.error('Failed to set password.', { error })
        return { success: false, message: error.message }
      }

      logger.info('Password set successfully for current user.')
      return { success: true, message: AUTH_MESSAGES.SERVER.PASSWORD_SET_SUCCESS.message }
    },

    /**
     * Deloghează utilizatorul curent.
     */
    async signOut() {
      // Folosește clientul injectat.
      const { error } = await supabase.auth.signOut()
      if (error) {
        logger.error('Failed to sign out.', { error })
      }
    },
  }
}
