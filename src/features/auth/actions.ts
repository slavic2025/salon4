// src/features/auth/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createAuthRepository } from '@/core/domains/auth/auth.repository'
import { createAuthService } from '@/core/domains/auth/auth.service'
import { setPasswordActionSchema, signInActionSchema } from '@/core/domains/auth/auth.types'
import { db } from '@/db'
import { APP_ROUTES } from '@/lib/constants'
import { createSafeAction } from '@/lib/safe-action'

/**
 * Funcție ajutătoare care asamblează serviciul de autentificare cu dependențele sale.
 * Respectă pattern-ul de Dependency Injection.
 */
function getAuthService() {
  const authRepository = createAuthRepository(db)
  const authService = createAuthService(authRepository)
  return authService
}

// --- Acțiuni care returnează o stare către UI ---

export const signInAction = createSafeAction(signInActionSchema, async (credentials) => {
  const authService = getAuthService()
  const result = await authService.signInWithPassword(credentials)

  if (!result.success) {
    // Returnăm un `serverError` dacă autentificarea eșuează.
    return { serverError: result.message }
  }

  // Returnăm un obiect `data` la succes.
  return { data: { success: true } }
})

export const setPasswordAction = createSafeAction(setPasswordActionSchema, async ({ password }) => {
  const authService = getAuthService()
  const result = await authService.setPassword(password)

  if (!result.success) {
    // Returnăm un `serverError` dacă setarea parolei eșuează.
    return { serverError: result.message }
  }

  // Returnăm un obiect `data` cu un mesaj de succes.
  return { data: { message: result.message } }
})

// --- Acțiune care face redirect ---

export async function signOutAction() {
  const authService = getAuthService()
  await authService.signOut()

  // Curățăm cache-ul pentru a reflecta starea de "delogat"
  revalidatePath('/', 'layout')

  // Redirecționăm utilizatorul către pagina de login
  redirect(APP_ROUTES.LOGIN)
}
