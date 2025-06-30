// src/core/domains/auth/auth.service.ts - Varianta finală, "best practice"

import type { Session } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'

import { APP_ROUTES, ROLES, type UserRole } from '@/lib/constants'

import type { AuthRepository } from './auth.repository'

// O hartă simplă pentru a asocia un rol cu calea sa de dashboard corectă.
const ROLE_DASHBOARD_MAP: Record<string, string> = {
  [ROLES.ADMIN]: APP_ROUTES.ADMIN_DASHBOARD,
  [ROLES.STYLIST]: APP_ROUTES.STYLIST_DASHBOARD,
} as const

export function createAuthService(repository: AuthRepository) {
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
    handleAuthorization(request: NextRequest, session: Session | null, role: UserRole): NextResponse {
      const { pathname } = request.nextUrl
      const url = (path: string) => new URL(path, request.url)

      // Cazul special: utilizator logat, dar fără rol în baza de date.
      if (session && !role) {
        const loginUrl = url(APP_ROUTES.LOGIN)
        loginUrl.searchParams.set('error', 'no_role_assigned')
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
     * Asigură că rolul utilizatorului este prezent în sesiune.
     * Dacă nu este, îl preia din baza de date.
     * Această metodă ar trebui apelată în middleware înainte de `handleAuthorization`.
     */
    async ensureUserRole(session: Session | null): Promise<UserRole> {
      if (!session) return null

      // Preferăm rolul din metadate, dacă există, pentru performanță.
      if (session.user.app_metadata.role) {
        return session.user.app_metadata.role as UserRole
      }

      // Dacă nu, îl căutăm în baza de date.
      return repository.getUserRole(session.user.id)
    },
  }
}
