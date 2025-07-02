// src/lib/supabase/middleware.ts

import { CookieOptions, createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

import type { Database } from '@/types/supabase.types'

/**
 * Creează un client Supabase și gestionează reîmprospătarea sesiunii în Middleware.
 * Această implementare folosește API-ul modern `getAll`/`setAll`.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet: { name: string; value: string; options: CookieOptions }[]) => {
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    },
  )

  // Reîmprospătează sesiunea utilizatorului. Acest apel este esențial.
  await supabase.auth.getUser()
  response.headers.set('x-pathname', request.nextUrl.pathname)
  return response
}
