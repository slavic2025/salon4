// src/middleware.ts
import { type NextRequest } from 'next/server'

import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Apelăm helper-ul, care se ocupă de tot:
  // - creează clientul
  // - reîmprospătează sesiunea
  // - returnează răspunsul cu cookie-urile corecte
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Rulează pe toate rutele, cu excepția celor care:
     * - conțin un punct (fișiere statice)
     * - încep cu `_next` (fișiere interne Next.js)
     * - încep cu `api` (rute API)
     */
    '/((?!api|_next/static|_next/image|.*\\..*).*)',
  ],
}
