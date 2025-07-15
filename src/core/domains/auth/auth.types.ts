// src/core/domains/auth/auth.types.ts

import { z } from 'zod'

import { AUTH_MESSAGES } from './auth.constants'

// --- Scheme pentru Procesul de Autentificare (Sign In) ---

/**
 * Schema pentru validarea formularului de login pe client (în UI).
 * Se concentrează pe feedback-ul imediat pentru utilizator.
 */
export const signInFormSchema = z.object({
  email: z.string().email(AUTH_MESSAGES.VALIDATION.INVALID_EMAIL),
  password: z.string().min(1, AUTH_MESSAGES.VALIDATION.PASSWORD_REQUIRED),
})

// Tipul pentru valorile din formularul de login
export type SignInFormValues = z.infer<typeof signInFormSchema>

/**
 * Schema pentru validarea datelor pe server, în interiorul Server Action-ului.
 * În acest caz, este identică cu cea de UI, dar o definim separat pentru consistență arhitecturală.
 */
export const signInActionSchema = signInFormSchema

// Tipul pentru payload-ul acțiunii de login
export type SignInPayload = z.infer<typeof signInActionSchema>

// --- Scheme pentru Procesul de Setare a Parolei (Set Password) ---

const baseSetPasswordSchema = z.object({
  password: z.string().min(8, AUTH_MESSAGES.VALIDATION.PASSWORD_TOO_SHORT),
  confirmPassword: z.string(),
})

/**
 * Schema pentru formularul de setare a parolei pe client (în UI).
 * Include verificarea că cele două parole se potrivesc.
 */
export const setPasswordFormSchema = baseSetPasswordSchema.refine((data) => data.password === data.confirmPassword, {
  message: AUTH_MESSAGES.VALIDATION.PASSWORDS_DO_NOT_MATCH,
  path: ['confirmPassword'],
})

// Tipul pentru valorile din formularul de setare a parolei
export type SetPasswordFormValues = z.infer<typeof setPasswordFormSchema>

/**
 * Schema pentru acțiunea de setare a parolei pe server.
 * Extrage doar parola, deoarece confirmarea nu este necesară pe backend.
 */
export const setPasswordActionSchema = baseSetPasswordSchema.pick({
  password: true,
})

// Tipul pentru payload-ul acțiunii de setare a parolei
export type SetPasswordPayload = z.infer<typeof setPasswordActionSchema>

export const setPasswordWithTokenActionSchema = z.object({
  password: z.string().min(8),
  token_hash: z.string().min(10),
})

export type SetPasswordWithTokenPayload = {
  password: string
  token_hash: string
}
