// src/features/auth/actions.ts
'use server' // Directiva este la începutul fișierului

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createAuthService } from '@/core/domains/auth/auth.service'
import { setPasswordActionSchema, signInActionSchema, type SignInPayload } from '@/core/domains/auth/auth.types'
import { APP_ROUTES } from '@/lib/constants'
import { executeSafeAction } from '@/lib/safe-action'

function getAuthService() {
  const authService = createAuthService()
  return authService
}

export async function signInAction(credentials: SignInPayload) {
  return executeSafeAction(signInActionSchema, credentials, async (validatedCredentials) => {
    const authService = getAuthService()
    const result = await authService.signInWithPassword(validatedCredentials)

    if (!result.success) {
      return { serverError: result.message }
    }
    return { data: { success: true } }
  })
}

export async function setPasswordAction(payload: { password: string }) {
  return executeSafeAction(setPasswordActionSchema, payload, async ({ password }) => {
    const authService = getAuthService()
    const result = await authService.setPassword(password)

    if (!result.success) {
      return { serverError: result.message }
    }
    return { data: { message: result.message } }
  })
}

export async function signOutAction() {
  const authService = getAuthService()
  await authService.signOut()
  revalidatePath('/', 'layout')
  redirect(APP_ROUTES.LOGIN)
}
