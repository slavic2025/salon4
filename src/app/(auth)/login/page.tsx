// src/app/(auth)/login/page.tsx

import { redirect } from 'next/navigation'

import { LoginForm } from '@/components/features/auth/LoginForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { APP_ROUTES } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'

/**
 * Pagina de Login.
 * Fiind un Server Component, poate executa logică pe server înainte de a fi randată.
 * Aici, o folosim pentru a redirecționa utilizatorii deja autentificați.
 */
export default async function LoginPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Dacă utilizatorul este deja logat, nu are ce căuta pe pagina de login.
  // Îl redirecționăm către pagina principală sau dashboard.
  // Aceasta este o măsură de siguranță suplimentară pe lângă middleware.
  if (user) {
    redirect(APP_ROUTES.LANDING) // Sau către un dashboard, dacă preferi
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
