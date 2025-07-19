// src/features/auth/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

import {
  createAuthRepository,
  createAuthService,
  SetPasswordActionValidator,
  type SetPasswordPayload,
  SetPasswordWithTokenActionValidator,
  type SetPasswordWithTokenPayload,
  SignInActionValidator,
  type SignInPayload,
} from '@/core/domains/auth'
import { db } from '@/db'
import { APP_ROUTES } from '@/lib/constants'
import { createLogger } from '@/lib/logger'
import { executeSafeAction } from '@/lib/safe-action'
import { createClient } from '@/lib/supabase/server'

/**
 * Logger pentru domeniul auth
 */
const logger = createLogger('auth')

/**
 * Instanțiem serviciul auth o singură dată la nivel de modul.
 * Acest lucru este eficient și simplifică corpul acțiunilor.
 */
async function getAuthService() {
  const supabase = await createClient()
  return createAuthService(createAuthRepository(db), supabase)
}

/**
 * FACTORY FUNCTION: Creează o acțiune sigură pentru operații publice de autentificare.
 * Încorporează validarea, execuția, gestionarea erorilor și revalidarea.
 *
 * @param schema - Schema Zod pentru validarea datelor de intrare.
 * @param actionLogic - Funcția care conține logica de business specifică.
 * @returns O Server Action completă și sigură.
 */
function createPublicAuthAction<T extends z.ZodType<any, any, any>>(
  schema: T,
  actionLogic: (payload: z.infer<T>) => Promise<any>,
) {
  return (payload: z.infer<T>) => {
    return executeSafeAction(schema, payload, async (validatedPayload) => {
      try {
        const result = await actionLogic(validatedPayload)
        return { data: result }
      } catch (error) {
        // Gestionarea erorilor specifice domeniului auth
        if (error instanceof Error) {
          logger.error('Eroare în acțiunea de autentificare', { error: error.message, action: 'auth' })
          return { serverError: error.message }
        }
        logger.error('Eroare neașteptată în acțiunea de autentificare', { error })
        throw error
      }
    })
  }
}

// --- PUBLIC SERVER ACTIONS ---

export const signInAction = createPublicAuthAction(SignInActionValidator, async (credentials: SignInPayload) => {
  logger.info('Încercare de autentificare', { email: credentials.email })
  const authService = await getAuthService()
  const result = await authService.signInWithPassword(credentials)
  if (!result.success) {
    logger.warn('Autentificare eșuată', { email: credentials.email, reason: result.message })
    throw new Error(result.message)
  }
  logger.info('Autentificare reușită', { email: credentials.email })
  return { success: true }
})

export const setPasswordAction = createPublicAuthAction(
  SetPasswordActionValidator,
  async ({ password }: SetPasswordPayload) => {
    logger.info('Încercare de setare parolă')
    const authService = await getAuthService()
    const result = await authService.setPassword(password)
    if (!result.success) {
      logger.warn('Setare parolă eșuată', { reason: result.message })
      throw new Error(result.message)
    }
    logger.info('Parolă setată cu succes')
    return { message: result.message }
  },
)

export const setPasswordWithTokenAction = createPublicAuthAction(
  SetPasswordWithTokenActionValidator,
  async ({ password, token_hash }: SetPasswordWithTokenPayload) => {
    logger.info('Încercare de setare parolă cu token')
    const authService = await getAuthService()
    const result = await authService.setPasswordWithToken(password, token_hash)
    if (!result.success) {
      logger.warn('Setare parolă cu token eșuată', { reason: result.message })
      throw new Error(result.message)
    }
    logger.info('Parolă setată cu token cu succes')
    return { message: result.message }
  },
)

export async function signOutAction() {
  logger.info('Deconectare utilizator')
  const authService = await getAuthService()
  await authService.signOut()
  revalidatePath(APP_ROUTES.LANDING, 'layout')
  redirect(APP_ROUTES.LOGIN)
}
