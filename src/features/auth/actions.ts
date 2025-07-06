// src/features/auth/actions.ts
'use server' // Directiva este la începutul fișierului

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createAuthRepository } from '@/core/domains/auth/auth.repository'
import { createAuthService } from '@/core/domains/auth/auth.service'
import {
  setPasswordActionSchema,
  type SetPasswordPayload,
  signInActionSchema,
  type SignInPayload,
} from '@/core/domains/auth/auth.types'
import { db } from '@/db'
import { APP_ROUTES } from '@/lib/constants'
import { executeSafeAction } from '@/lib/safe-action'
import { createClient } from '@/lib/supabase/client'

/**
 * Instanțiem serviciul o singură dată la nivel de modul.
 * Acest lucru este eficient și simplifică corpul acțiunilor,
 * asigurând că toate acțiunile folosesc aceeași instanță de serviciu.
 */
const authService = createAuthService(createAuthRepository(db), createClient())

// --- PUBLIC SERVER ACTIONS ---

/**
 * Gestionează autentificarea utilizatorului cu email și parolă.
 */
export const signInAction = (credentials: SignInPayload) => {
  return executeSafeAction(signInActionSchema, credentials, async (validatedCredentials) => {
    const result = await authService.signInWithPassword(validatedCredentials)

    // Practică recomandată: Aruncăm o eroare în caz de eșec.
    // `executeSafeAction` o va prinde și o va plasa automat în `serverError`.
    // Acest lucru curăță logica și evită return-urile condiționate.
    if (!result.success) {
      throw new Error(result.message)
    }

    return { data: { success: true } }
  })
}

/**
 * Permite unui utilizator autentificat să își seteze sau să își schimbe parola.
 */
export const setPasswordAction = (payload: SetPasswordPayload) => {
  return executeSafeAction(setPasswordActionSchema, payload, async ({ password }) => {
    const result = await authService.setPassword(password)

    if (!result.success) {
      throw new Error(result.message)
    }

    return { data: { message: result.message } }
  })
}

/**
 * Gestionează delogarea utilizatorului.
 * Aceasta nu este o "safe action" deoarece nu primește input de la un formular
 * și are ca efect principal o redirecționare.
 */
export async function signOutAction() {
  await authService.signOut()

  // Revalidăm întregul layout pentru a asigura că starea de autentificare
  // este reîmprospătată peste tot în aplicație.
  revalidatePath('/', 'layout')

  // Redirecționăm utilizatorul către pagina de login.
  redirect(APP_ROUTES.LOGIN)
}
