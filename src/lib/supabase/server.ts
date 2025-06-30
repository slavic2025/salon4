// src/lib/supabase/server.ts

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

import type { Database } from '@/types/supabase.types' // Asigură-te că acest fișier a fost generat

/**
 * Creează un client Supabase pentru contexte de Server (Server Components, Server Actions, Route Handlers).
 * Această funcție este ASINCRONĂ deoarece `cookies()` din Next.js 15+ returnează o Promisiune.
 * * @returns {Promise<SupabaseClient<Database>>} O promisiune care se rezolvă cu o instanță a clientului Supabase.
 */
export async function createClient() {
  // 1. Obținem obiectul de cookie-uri folosind `await`, conform noilor "best practices" Next.js.
  const cookieStore = await cookies()

  // 2. Creăm și returnăm clientul Supabase.
  // Specificăm tipul generic `<Database>` pentru a beneficia de type-safety complet.
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        /**
         * Metoda pentru a citi TOATE cookie-urile din request.
         */
        getAll() {
          return cookieStore.getAll()
        },
        /**
         * Metoda pentru a seta TOATE cookie-urile necesare în răspunsul către client.
         */
        setAll(cookiesToSet) {
          try {
            // Folosim un loop `for...of` pentru a seta fiecare cookie.
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options)
            }
          } catch (error) {
            // Această eroare este normală dacă `set` este apelat într-un context
            // static (ex: un Server Component care nu este dinamic).
            // Poate fi ignorată în siguranță dacă un middleware se ocupă
            // de reîmprospătarea sesiunii.
          }
        },
      },
    },
  )
}
