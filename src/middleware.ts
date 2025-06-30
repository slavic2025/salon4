// src/middleware.ts

import { type NextRequest } from 'next/server'

import { createAuthRepository } from './core/domains/auth/auth.repository'
import { createAuthService } from './core/domains/auth/auth.service'
import { db } from './db'
import { createSupabaseClientForMiddleware } from './lib/supabase-middleware'

export async function middleware(request: NextRequest) {
  // Asamblarea dependențelor...
  const authRepository = createAuthRepository(db)
  const authService = createAuthService(authRepository)
  const { supabase } = createSupabaseClientForMiddleware(request)

  // Obținem sesiunea
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Asigurăm că avem rolul, fie din JWT, fie din DB
  const role = await authService.ensureUserRole(session)

  // Delegăm complet logica și returnăm rezultatul
  return authService.handleAuthorization(request, session, role)
}
// Configurația matcher rămâne aceeași
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
