// src/features/auth/actions.ts
'use server'

import { signInSchema } from '@/core/domains/auth/auth.types'
import { createSafeAction } from '@/lib/safe-action'

// O funcție "getter" care asamblează serviciul la cerere
function getAuthService() {
  // Aici vei instanția și repository-ul dacă serviciul depinde de el
  // Pentru signIn, s-ar putea să nu fie necesar, dar păstrăm pattern-ul
  // const authRepository = createAuthRepository(db);
  // const authService = createAuthService(authRepository);
  // Simplificat pentru exemplu:
  const authService = {
    /* ... implementarea signInWithPassword ... */
  }
  return authService
}

// Creăm acțiunea securizată folosind schema Zod
export const signInAction = createSafeAction(signInSchema, async (credentials) => {
  // În realitate, ai asambla serviciul aici
  // const authService = getAuthService();
  // const result = await authService.signInWithPassword(credentials);

  // Pentru a menține exemplul funcțional, vom simula logica
  const supabase = createClient() // Helper pentru client Supabase pe server
  const { error } = await supabase.auth.signInWithPassword(credentials)

  if (error) {
    return {
      error: 'Credențiale invalide.',
    }
  }

  // Nu redirecționăm aici! Middleware-ul se va ocupa de asta.
  // Doar returnăm un mesaj de succes.
  return {
    data: { success: true },
  }
})
