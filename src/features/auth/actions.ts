// src/features/auth/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

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
import { executeSafeAction } from '@/lib/safe-action'
import { createClient } from '@/lib/supabase/server'

// Creăm serviciul auth cu dependențele necesare
async function getAuthService() {
  const supabase = await createClient()
  return createAuthService(createAuthRepository(db), supabase)
}

// --- PUBLIC SERVER ACTIONS ---

export const signInAction = async (credentials: SignInPayload) => {
  return executeSafeAction(SignInActionValidator, credentials, async (validatedCredentials) => {
    const authService = await getAuthService()
    const result = await authService.signInWithPassword(validatedCredentials)
    if (!result.success) {
      throw new Error(result.message)
    }
    return { data: { success: true } }
  })
}

export const setPasswordAction = async (payload: SetPasswordPayload) => {
  return executeSafeAction(SetPasswordActionValidator, payload, async ({ password }) => {
    const authService = await getAuthService()
    const result = await authService.setPassword(password)
    if (!result.success) {
      throw new Error(result.message)
    }
    return { data: { message: result.message } }
  })
}

export const setPasswordWithTokenAction = async (payload: SetPasswordWithTokenPayload) => {
  return executeSafeAction(SetPasswordWithTokenActionValidator, payload, async ({ password, token_hash }) => {
    const authService = await getAuthService()
    const result = await authService.setPasswordWithToken(password, token_hash)
    if (!result.success) {
      throw new Error(result.message)
    }
    return { data: { message: result.message } }
  })
}

export async function signOutAction() {
  const authService = await getAuthService()
  await authService.signOut()
  revalidatePath('/', 'layout')
  redirect(APP_ROUTES.LOGIN)
}
