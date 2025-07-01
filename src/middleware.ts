// src/middleware.ts

import { type NextRequest } from 'next/server'

import { createAuthService } from './core/domains/auth/auth.service'
import { createSupabaseClientForMiddleware } from './lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // 1. Creăm clientul și răspunsul
  const { supabase } = createSupabaseClientForMiddleware(request)
  // 2. Apelăm `getUser()` în loc de `getSession()` - Aici este corecția de securitate
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 3. Asamblăm serviciul ca înainte
  const authService = createAuthService()

  // 4. Obținem rolul, pasând obiectul `user` validat
  const role = await authService.ensureUserRole(user)

  // 5. Delegăm logica de redirect, pasând `user` în loc de `session`
  const finalResponse = authService.handleAuthorization(request, user, role)

  // Returnăm răspunsul final
  return finalResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
