// src/middleware.ts
import { type CookieOptions, createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

import { APP_ROUTES, ROUTE_PROTECTION } from '@/lib/constants'

/**
 * Verifică dacă o cale este protejată (necesită autentificare)
 */
function isProtectedRoute(pathname: string): boolean {
  return (
    ROUTE_PROTECTION.ADMIN_ROUTES.some((route) => pathname.startsWith(route)) ||
    ROUTE_PROTECTION.STYLIST_ROUTES.some((route) => pathname.startsWith(route))
  )
}

export async function middleware(request: NextRequest) {
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
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet: { name: string; value: string; options: CookieOptions }[]) => {
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    },
  )

  const pathname = request.nextUrl.pathname

  // Rolul principal al middleware-ului: reîmprospătează token-ul de sesiune
  const {
    data: { user },
  } = await supabase.auth.getUser()
  response.headers.set('x-pathname', pathname)

  // Verifică dacă utilizatorii neautentificați încearcă să acceseze rute protejate
  if (!user && isProtectedRoute(pathname)) {
    const loginUrl = new URL(APP_ROUTES.LOGIN, request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Pentru utilizatorii autentificați care accesează /auth/login,
  // lăsăm pagina de login să gestioneze redirectul bazat pe rol

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
