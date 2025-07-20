import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { APP_ROUTES } from '@/lib/constants'

/**
 * Not Found UI pentru directorul auth.
 * Afișează o pagină prietenoasă când utilizatorul accesează o rută inexistentă în secțiunea de autentificare.
 * Oferă opțiuni de navigare pentru a ajuta utilizatorul să găsească ceea ce caută.
 */
export default function AuthNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-gray-600">Pagină negăsită</CardTitle>
          <CardDescription>Pagina pe care o cauți nu există sau a fost mutată.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-gray-600">
            <p>Verifică dacă ai introdus corect adresa URL sau folosește link-urile de mai jos pentru a naviga.</p>
          </div>

          <div className="flex flex-col gap-2">
            <Button asChild className="w-full" variant="default">
              <Link href={APP_ROUTES.AUTH.LOGIN}>Mergi la pagina de login</Link>
            </Button>

            <Button asChild className="w-full" variant="outline">
              <Link href={APP_ROUTES.LANDING}>Mergi la pagina principală</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
