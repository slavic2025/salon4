// src/app/auth/confirm/page.tsx

import { Suspense } from 'react'

import { SetPasswordForm } from '@/components/features/auth/SetPasswordForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createLogger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'

const logger = createLogger('auth:confirm')

/**
 * Pagina de confirmare și setare parolă.
 * Permite utilizatorilor să-și seteze parola după primirea unui link de invitație.
 * Gestionează atât utilizatorii autentificați cât și neautentificați.
 */
export default async function ConfirmPage() {
  try {
    const supabase = await createClient()

    logger.info('Verificare utilizator pentru pagina de confirmare')

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
      // Continuăm cu afișarea formularului în caz de eroare
    }

    if (user) {
      logger.info('Utilizator autentificat găsit', {
        userId: user.id,
        email: user.email,
        emailVerified: user.user_metadata?.email_verified,
      })

      // Dacă utilizatorul este autentificat prin invitație, îl lăsăm să-și seteze parola
      if (user.user_metadata?.email_verified) {
        logger.info('Utilizator autentificat prin invitație, afișare formular de setare parolă')
      }
    } else {
      logger.info('Utilizator neautentificat, afișare formular de setare parolă')
    }

    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">Finalizează înregistrarea</CardTitle>
            <CardDescription>Setează o parolă pentru a-ți activa contul de stilist.</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="text-center py-4">Se încarcă...</div>}>
              <SetPasswordForm />
            </Suspense>
          </CardContent>
        </Card>
      </main>
    )
  } catch (error) {
    logger.error('Eroare neașteptată în pagina de confirmare', { error })

    // În caz de eroare neașteptată, afișăm o pagină de eroare prietenoasă
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold tracking-tight text-red-600">Eroare de încărcare</CardTitle>
            <CardDescription>A apărut o problemă la încărcarea paginii. Te rog încearcă din nou.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Încearcă din nou
            </button>
          </CardContent>
        </Card>
      </main>
    )
  }
}
