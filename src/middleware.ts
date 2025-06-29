// src/middleware.ts

import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseClientForMiddleware } from './lib/supabase-middleware';

// Importăm fabricile pentru serviciul și repository-ul de auth
import { createAuthService } from './core/domains/auth/auth.service';
import { createAuthRepository } from './core/domains/auth/auth.repository';

// Importăm clientul Drizzle pentru a-l injecta
import { db } from './db';

/**
 * Middleware-ul principal al aplicației.
 * Rolul său este să orchestreze verificarea sesiunii și a rolului,
 * delegând logica de business către AuthService.
 */
export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createSupabaseClientForMiddleware(request, response);

  // Asamblăm dependențele: db -> repository -> service
  const authRepository = createAuthRepository(db); // Drizzle are nevoie de clientul standard, nu cel de middleware
  const authService = createAuthService(authRepository);

  // Obținem sesiunea
  const { data: { session } } = await supabase.auth.getSession();

  // Obținem rolul utilizatorului
  const role = await authService.getUserRole(session?.user.id);
  
  // Delegăm logica de redirect către serviciu și returnăm rezultatul
  return authService.handleRedirects(request, session, role);
}

// Configurația matcher rămâne aceeași
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};