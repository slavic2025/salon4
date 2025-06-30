import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

/**
 * Creează un client Supabase special pentru a fi folosit în Middleware.
 * Această variantă este optimizată și robustă, combinând o interfață curată
 * cu logica de gestionare a cookie-urilor din documentația oficială.
 */
export function createSupabaseClientForMiddleware(request: NextRequest) {
  // Păstrăm o referință la răspuns, care va fi actualizată.
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
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Aici adoptăm logica din documentație pentru o mai mare robustețe.

          // 1. Mai întâi, actualizăm cookie-urile pe obiectul de request.
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))

          // 2. Apoi, recreăm răspunsul bazat pe request-ul actualizat.
          response = NextResponse.next({
            request,
          })

          // 3. La final, setăm cookie-urile pe noul răspuns care va fi trimis la client.
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    },
  )

  // Returnăm atât clientul, cât și răspunsul, menținând interfața noastră utilă.
  return { supabase, response }
}
