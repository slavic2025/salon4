// src/core/domains/auth/auth.service.ts - Varianta finală, "best practice"
import { type User } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'

import { APP_ROUTES, ROLES, type UserRole } from '@/lib/constants'
import { createLogger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'

import { AUTH_MESSAGES } from './auth.constants'
import { SignInFormValues } from './auth.types'

// O hartă simplă pentru a asocia un rol cu calea sa de dashboard corectă.
const ROLE_DASHBOARD_MAP: Record<string, string> = {
  [ROLES.ADMIN]: APP_ROUTES.ADMIN_DASHBOARD,
  [ROLES.STYLIST]: APP_ROUTES.STYLIST_DASHBOARD,
} as const

export function createAuthService() {
  const logger = createLogger('AuthService')
  /**
   * O funcție pură, privată, pentru a determina dacă este necesară o redirecționare.
   * Returnează calea către care trebuie redirecționat sau `null` dacă nu este necesar.
   */
  function _getRedirectPath(pathname: string, role: UserRole): string | null {
    const isProtectedRoute =
      pathname.startsWith(APP_ROUTES.ADMIN_DASHBOARD) || pathname.startsWith(APP_ROUTES.STYLIST_DASHBOARD)

    // Cazul 1: Utilizator pe o rută publică. Nu facem nimic.
    if (!isProtectedRoute) {
      return null
    }

    // De aici încolo, știm că ruta este protejată.

    // Cazul 2: Utilizator nelogat (fără rol) pe o rută protejată.
    if (!role) {
      return APP_ROUTES.LOGIN
    }

    // Cazul 3: Utilizator logat cu rol, dar pe dashboard-ul greșit.
    const expectedDashboard = ROLE_DASHBOARD_MAP[role]
    if (expectedDashboard && !pathname.startsWith(expectedDashboard)) {
      return expectedDashboard
    }

    // Cazul 4: "Happy path" - utilizatorul este la locul potrivit.
    return null
  }

  return {
    /**
     * Punctul de intrare principal. Orchestrează verificările și returnează răspunsul final.
     */
    handleAuthorization(request: NextRequest, user: User | null, role: UserRole): NextResponse {
      const { pathname } = request.nextUrl
      const url = (path: string) => new URL(path, request.url)

      // Cazul special: utilizator logat, dar fără rol în baza de date.
      if (user && !role) {
        const loginUrl = url(APP_ROUTES.LOGIN)
        loginUrl.searchParams.set('error', AUTH_MESSAGES.SERVER.NO_ROLE_ASSIGNED.code)
        return NextResponse.redirect(loginUrl)
      }

      // Folosim funcția pură pentru a determina dacă și unde trebuie să redirecționăm.
      const redirectPath = _getRedirectPath(pathname, role)

      if (redirectPath) {
        return NextResponse.redirect(url(redirectPath))
      }

      // Dacă nu este necesară nicio redirecționare, permitem cererii să continue.
      return NextResponse.next()
    },

    /**
     * Asigură că rolul utilizatorului este cunoscut, fie din sesiune, fie din baza de date.
     */
    async ensureUserRole(user: User | null): Promise<UserRole> {
      if (!user) return null

      // Citim rolul direct din metadate. Nu mai este nevoie de repository.
      const role = user.app_metadata.role as UserRole | undefined

      if (!role) {
        logger.warn('Role not found in user metadata.', { userId: user.id })
        return null
      }

      logger.debug('Role found in user metadata.', { userId: user.id, role })
      return role
    },

    /**
     * Autentifică un utilizator folosind email și parolă.
     */
    async signInWithPassword(credentials: SignInFormValues) {
      // Notă: Pentru signIn, folosim un client Supabase care poate gestiona cookie-uri
      const supabase = await createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })

      if (error) {
        logger.warn('Failed sign-in attempt.', { email: credentials.email, error: error.message })
        return {
          success: false,
          // 3. Folosim constantele pentru mesaje, pentru consistență.
          message: AUTH_MESSAGES.SERVER.INVALID_CREDENTIALS.message,
        }
      }

      logger.info('User signed in successfully.', { email: credentials.email })
      return {
        success: true,
        message: AUTH_MESSAGES.SERVER.LOGIN_SUCCESS.message,
      }
    },
    async setPassword(password: string) {
      const supabase = await createClient()
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
      const supabase = await createClient()
      const { error } = await supabase.auth.signOut()

      if (error) {
        logger.error('Failed to sign out.', { error })
        // Chiar dacă delogarea eșuează, vom încerca să redirecționăm
      }
    },
  }
}
