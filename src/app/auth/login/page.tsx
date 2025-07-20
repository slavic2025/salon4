// src/app/auth/login/page.tsx

import { redirect } from 'next/navigation'
import { Suspense } from 'react'

import { LoginForm } from '@/components/features/auth/LoginForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createAuthRepository, createAuthService } from '@/core/domains/auth'
import { db } from '@/db'
import { APP_ROUTES, ROLES } from '@/lib/constants'
import { createLogger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'

const logger = createLogger('auth:login')

const ROLE_DASHBOARD_MAP: Record<string, string> = {
  [ROLES.ADMIN]: APP_ROUTES.ADMIN_DASHBOARD,
  [ROLES.STYLIST]: APP_ROUTES.STYLIST_DASHBOARD,
}

/**
 * Pagina de Login.
 * Fiind un Server Component, poate executa logică pe server înainte de a fi randată.
 * Aici, o folosim pentru a redirecționa utilizatorii deja autentificați.
 */
export default async function LoginPage() {
  try {
    const supabase = await createClient()
    const authRepository = createAuthRepository(db)
    const authService = createAuthService(authRepository, supabase)

    logger.info('Verificare utilizator autentificat pentru redirecționare')

    const {
      data: { user },
      error: getUserError,
    } = await supabase.auth.getUser()

    if (getUserError) {
      // Verificăm dacă eroarea este doar lipsa sesiunii (utilizator neautentificat)
      if (getUserError.name === 'AuthSessionMissingError') {
        logger.info('Utilizator neautentificat - sesiune lipsă', { error: getUserError.message })
      } else {
        // Pentru alte erori reale, loghează ca error
        logger.error('Eroare la obținerea utilizatorului', { error: getUserError })
      }
      // Continuăm cu afișarea paginii de login în caz de eroare
    }

    if (user) {
      logger.info('Utilizator autentificat găsit, determinare rol și redirecționare', {
        userId: user.id,
        email: user.email,
      })

      try {
        // Folosim metoda din serviciul nostru pentru a obține rolul
        const role = await authService.ensureUserRole(user)
        const dashboardPath = role ? ROLE_DASHBOARD_MAP[role] : null

        if (dashboardPath) {
          logger.info('Redirecționare către dashboard', { role, dashboardPath })
          redirect(dashboardPath)
        } else {
          logger.warn('Rol necunoscut, redirecționare către landing', { role })
          redirect(APP_ROUTES.LANDING)
        }
      } catch (roleError) {
        // Verificăm dacă eroarea este NEXT_REDIRECT (redirecționare normală)
        if (roleError instanceof Error && roleError.message === 'NEXT_REDIRECT') {
          // Aceasta este o redirecționare normală, nu o eroare
          logger.info('Redirecționare inițiată din determinarea rolului', { error: roleError.message })
          // Re-throw eroarea pentru ca Next.js să o gestioneze
          throw roleError
        }

        // Pentru alte erori reale la determinarea rolului
        logger.error('Eroare la determinarea rolului utilizatorului', {
          userId: user.id,
          error: roleError,
        })
        // În caz de eroare la determinarea rolului, redirecționăm către landing
        redirect(APP_ROUTES.LANDING)
      }
    }

    // Dacă nu există utilizator, afișăm pagina de login.
    logger.info('Afișare pagină de login pentru utilizator neautentificat')

    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">Bine ai revenit!</CardTitle>
            <CardDescription>Introdu credențialele pentru a accesa contul.</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="text-center py-4">Se încarcă...</div>}>
              <LoginForm />
            </Suspense>
          </CardContent>
        </Card>
      </main>
    )
  } catch (error) {
    // Verificăm dacă eroarea este NEXT_REDIRECT (redirecționare normală)
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      // Aceasta este o redirecționare normală, nu o eroare
      logger.info('Redirecționare inițiată', { error: error.message })
      // Re-throw eroarea pentru ca Next.js să o gestioneze
      throw error
    }

    // Pentru alte erori reale, loghează ca error
    logger.error('Eroare neașteptată în pagina de login', { error })
    // În caz de eroare neașteptată, afișăm pagina de login pentru a permite utilizatorului să încerce din nou
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">Bine ai revenit!</CardTitle>
            <CardDescription>Introdu credențialele pentru a accesa contul.</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="text-center py-4">Se încarcă...</div>}>
              <LoginForm />
            </Suspense>
          </CardContent>
        </Card>
      </main>
    )
  }
}
