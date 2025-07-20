'use client'

import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createLogger } from '@/lib/logger'

const logger = createLogger('auth:error')

/**
 * Error Boundary pentru directorul auth.
 * Prinde erorile neașteptate din componentele de autentificare și afișează o interfață prietenoasă.
 * Permite utilizatorului să încerce din nou sau să navigheze înapoi.
 */
export default function AuthError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Loghează eroarea pentru debugging și monitoring
    logger.error('Eroare în componenta de autentificare', {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
    })
  }, [error])

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-red-600">A apărut o problemă</CardTitle>
          <CardDescription>
            Ne pare rău, dar a apărut o eroare neașteptată în timpul procesului de autentificare.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-gray-600">
            <p>Eroare: {error.message}</p>
            {error.digest && <p className="mt-2 text-xs">Cod de referință: {error.digest}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={() => reset()} className="w-full" variant="default">
              Încearcă din nou
            </Button>

            <Button onClick={() => window.history.back()} className="w-full" variant="outline">
              Mergi înapoi
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
