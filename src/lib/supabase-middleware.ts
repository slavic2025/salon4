// src/lib/supabase-middleware.ts

import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

/**
 * Creează un client Supabase special pentru a fi folosit în Middleware,
 * folosind noua semnătură recomandată pentru gestionarea cookie-urilor.
 */
export function createSupabaseClientForMiddleware(request: NextRequest) {
  // `createServerClient` are nevoie de un obiect `response` pentru a putea
  // seta cookie-uri, chiar dacă nu îl folosim mereu.
  // Crearea lui la început simplifică logica.
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Noua metodă `getAll` citește toate cookie-urile din request.
        getAll() {
          return request.cookies.getAll()
        },
        // Noua metodă `setAll` primește un array de cookie-uri de setat.
        setAll(cookiesToSet) {
          // Iterăm prin cookie-urile primite și le setăm atât pe request,
          // cât și pe răspuns, pentru a menține starea sincronizată.
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    },
  )

  // Returnăm atât clientul Supabase, cât și obiectul de răspuns.
  return { supabase, response }
}
