import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * Loading UI pentru directorul auth.
 * Afișează o interfață de încărcare prietenoasă în timp ce se procesează cererile de autentificare.
 * Folosește același design ca paginile de autentificare pentru consistență.
 */
export default function AuthLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Se încarcă...</CardTitle>
          <CardDescription>Te rugăm să aștepți în timp ce procesăm cererea ta.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Loading spinner */}
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>

          {/* Loading skeleton pentru formular */}
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
