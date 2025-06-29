// src/core/domains/auth/auth.service.ts (Varianta finală)

import { NextResponse, type NextRequest } from 'next/server'
import type { Session } from '@supabase/supabase-js'
import { APP_ROUTES, ROLES, type UserRole } from '@/lib/constants'
import type { AuthRepository } from './auth.repository'

// O hartă simplă pentru a asocia un rol cu calea sa corectă
const ROLE_DASHBOARD_MAP = {
  [ROLES.ADMIN]: APP_ROUTES.ADMIN_DASHBOARD,
  [ROLES.STYLIST]: APP_ROUTES.STYLIST_DASHBOARD,
}

export function createAuthService(repository: AuthRepository) {
  return {
    /**
     * Orchestrează logica de redirect folosind pattern-ul "Guard Clauses".
     */
    handleRedirects(request: NextRequest, session: Session | null): NextResponse {
      const { pathname } = request.nextUrl
      const url = (path: string) => new URL(path, request.url)

      // --- GUARD CLAUSE 1: Rute publice ---
      // Dacă ruta nu este protejată, permitem accesul imediat.
      const isProtectedRoute =
        pathname.startsWith(APP_ROUTES.ADMIN_DASHBOARD) ||
        pathname.startsWith(APP_ROUTES.STYLIST_DASHBOARD)

      if (!isProtectedRoute) {
        return NextResponse.next()
      }

      // --- GUARD CLAUSE 2: Utilizator nelogat ---
      // De aici încolo, știm că toate rutele sunt protejate.
      if (!session) {
        return NextResponse.redirect(url(APP_ROUTES.LOGIN))
      }

      // De aici încolo, știm că utilizatorul ESTE logat.
      const { role } = session.user.app_metadata

      // --- GUARD CLAUSE 3: Utilizator fără rol definit ---
      if (!role || !ROLE_DASHBOARD_MAP[role]) {
        const loginUrl = url(APP_ROUTES.LOGIN)
        loginUrl.searchParams.set('error', 'no_role_assigned')
        return NextResponse.redirect(loginUrl)
      }

      // --- LOGICA PRINCIPALĂ: Utilizatorul are un rol valid ---
      const expectedPath = ROLE_DASHBOARD_MAP[role]

      // Dacă utilizatorul nu este deja pe calea corectă, îl redirecționăm.
      if (!pathname.startsWith(expectedPath)) {
        return NextResponse.redirect(url(expectedPath))
      }

      // "Happy Path": Utilizatorul este logat, are rol și este la locul potrivit.
      return NextResponse.next()
    },

    /**
     * Returnează rolul utilizatorului.
     * MODIFICARE: Vom citi rolul direct din metadatele sesiunii,
     * pentru a evita o interogare suplimentară la baza de date la fiecare request.
     */
    async assignRoleToSession(session: Session) {
      if (!session.user.app_metadata.role) {
        const role = await repository.getUserRole(session.user.id)
        // Aici am putea actualiza metadatele utilizatorului în Supabase
        // pentru a include rolul, optimizând request-urile viitoare.
        // Pentru moment, doar îl atașăm la sesiune.
        if (role){
          session.user.app_metadata.role = role
        }
      }
    },
  }
}
