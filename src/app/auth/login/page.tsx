// src/app/(auth)/login/page.tsx

import { redirect } from 'next/navigation'

import { LoginForm } from '@/components/features/auth/LoginForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createAuthRepository } from '@/core/domains/auth/auth.repository'
import { createAuthService } from '@/core/domains/auth/auth.service'
import { db } from '@/db'
import { APP_ROUTES, ROLES } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'

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
  const supabase = await createClient()
  const authRepository = createAuthRepository(db)
  const authService = createAuthService(authRepository, supabase)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    // Folosim metoda din serviciul nostru pentru a obține rolul
    const role = await authService.ensureUserRole(user)

    const dashboardPath = role ? ROLE_DASHBOARD_MAP[role] : null

    if (dashboardPath) {
      redirect(dashboardPath)
    } else {
      redirect(APP_ROUTES.LANDING)
    }
  }

  // Dacă nu există utilizator, afișăm pagina de login.
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Bine ai revenit!</CardTitle>
          <CardDescription>Introdu credențialele pentru a accesa contul.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  )
}
