// src/lib/supabase-admin.ts

import { createClient } from '@supabase/supabase-js'

/**
 * O funcție-fabrică pentru a crea un client Supabase cu privilegii de admin.
 *
 * @returns {SupabaseClient} O instanță a clientului Supabase autentificată cu cheia de serviciu.
 * @throws {Error} Aruncă o eroare dacă variabilele de mediu necesare nu sunt setate.
 */
export function createAdminClient() {
  // Variabile de mediu necesare
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Supabase URL or Service Role Key is missing from environment variables.')
  }

  // Creăm clientul folosind cheia de `service_role`.
  // Opțiunea `auth: { autoRefreshToken: false, persistSession: false }` este o "best practice"
  // pentru clienții de server, deoarece nu este nevoie să gestioneze sesiuni sau token-uri.
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
