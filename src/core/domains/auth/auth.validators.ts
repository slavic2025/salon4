// src/core/domains/auth/auth.validators.ts

import { z } from 'zod'

import { AUTH_MESSAGES } from './auth.constants'

// --- BASE VALIDATORS ---

/**
 * Validator pentru email
 */
export const EmailValidator = z.string().email(AUTH_MESSAGES.VALIDATION.INVALID_EMAIL)

/**
 * Validator pentru parolă
 */
export const PasswordValidator = z.string().min(1, AUTH_MESSAGES.VALIDATION.PASSWORD_REQUIRED)

/**
 * Validator pentru parolă cu lungime minimă
 */
export const StrongPasswordValidator = z.string().min(8, AUTH_MESSAGES.VALIDATION.PASSWORD_TOO_SHORT)

/**
 * Validator pentru confirmarea parolei
 */
export const ConfirmPasswordValidator = z.string()

/**
 * Validator pentru token hash
 */
export const TokenHashValidator = z.string().min(10, 'Token-ul trebuie să aibă cel puțin 10 caractere')

// --- FORM VALIDATORS ---

/**
 * Schema pentru validarea formularului de login pe client (în UI).
 * Se concentrează pe feedback-ul imediat pentru utilizator.
 */
export const SignInFormValidator = z.object({
  email: EmailValidator,
  password: PasswordValidator,
})

/**
 * Schema pentru formularul de setare a parolei pe client (în UI).
 * Include verificarea că cele două parole se potrivesc.
 */
export const SetPasswordFormValidator = z
  .object({
    password: StrongPasswordValidator,
    confirmPassword: ConfirmPasswordValidator,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: AUTH_MESSAGES.VALIDATION.PASSWORDS_DO_NOT_MATCH,
    path: ['confirmPassword'],
  })

// --- ACTION VALIDATORS ---

/**
 * Schema pentru validarea datelor pe server, în interiorul Server Action-ului.
 * În acest caz, este identică cu cea de UI, dar o definim separat pentru consistență arhitecturală.
 */
export const SignInActionValidator = SignInFormValidator

/**
 * Schema pentru acțiunea de setare a parolei pe server.
 * Extrage doar parola, deoarece confirmarea nu este necesară pe backend.
 */
export const SetPasswordActionValidator = z.object({
  password: StrongPasswordValidator,
})

/**
 * Schema pentru setarea parolei cu token de invitație
 */
export const SetPasswordWithTokenActionValidator = z.object({
  password: StrongPasswordValidator,
  token_hash: TokenHashValidator,
})

// --- TYPE EXPORTS ---

export type SignInFormData = z.infer<typeof SignInFormValidator>
export type SetPasswordFormData = z.infer<typeof SetPasswordFormValidator>
export type SignInActionData = z.infer<typeof SignInActionValidator>
export type SetPasswordActionData = z.infer<typeof SetPasswordActionValidator>
export type SetPasswordWithTokenActionData = z.infer<typeof SetPasswordWithTokenActionValidator>

// --- HELPER FUNCTIONS ---

/**
 * Formatează erorile de validare Zod într-un obiect simplu
 */
export function formatValidationErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {}

  error.errors.forEach((err) => {
    const path = err.path.join('.')
    errors[path] = err.message
  })

  return errors
}

/**
 * Validează datele pentru sign in folosind validatori centralizați
 */
export function validateSignInData(
  data: unknown,
): { success: true; data: SignInFormData } | { success: false; errors: Record<string, string> } {
  const result = SignInFormValidator.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  return { success: false, errors: formatValidationErrors(result.error) }
}

/**
 * Validează datele pentru setarea parolei folosind validatori centralizați
 */
export function validateSetPasswordData(
  data: unknown,
): { success: true; data: SetPasswordFormData } | { success: false; errors: Record<string, string> } {
  const result = SetPasswordFormValidator.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  return { success: false, errors: formatValidationErrors(result.error) }
}
