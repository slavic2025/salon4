// src/core/domains/auth/auth.types.ts

import type { User } from '@supabase/supabase-js'
import { z } from 'zod'

import { type UserRole } from '@/lib/constants'

// --- BUSINESS TYPES ---

/**
 * Date pentru autentificare
 */
export interface SignInData {
  email: string
  password: string
}

/**
 * Date pentru setarea parolei
 */
export interface SetPasswordData {
  password: string
}

/**
 * Date pentru setarea parolei cu token
 */
export interface SetPasswordWithTokenData {
  password: string
  token_hash: string
}

/**
 * Rezultat pentru operațiuni de autentificare
 */
export interface AuthResult {
  success: boolean
  message: string
  data?: any
}

// --- REPOSITORY INTERFACE ---

export interface AuthRepository {
  getUserRole(userId: string): Promise<UserRole>
  findUserByEmail(email: string): Promise<User>
}

// --- SERVICE INTERFACE ---

export interface AuthService {
  ensureUserRole(user: User | null): Promise<UserRole>
  signInWithPassword(credentials: SignInData): Promise<AuthResult>
  setPassword(password: string): Promise<AuthResult>
  setPasswordWithToken(password: string, token_hash: string): Promise<AuthResult>
  signOut(): Promise<void>
}

// --- RE-EXPORT VALIDATORS ---
// Re-exportăm validatori din validators.ts pentru a păstra compatibilitatea

import {
  SetPasswordActionValidator,
  type SetPasswordFormData,
  SetPasswordWithTokenActionValidator,
  SignInActionValidator,
  type SignInFormData,
} from './auth.validators'

export type { SetPasswordFormData, SignInFormData } from './auth.validators'
export {
  SetPasswordActionValidator,
  SetPasswordFormValidator,
  SetPasswordWithTokenActionValidator,
  SignInActionValidator,
  SignInFormValidator,
} from './auth.validators'

// --- ACTION PAYLOAD TYPES ---
// Derivate din validatori pentru type safety

export type SignInPayload = z.infer<typeof SignInActionValidator>
export type SetPasswordPayload = z.infer<typeof SetPasswordActionValidator>
export type SetPasswordWithTokenPayload = z.infer<typeof SetPasswordWithTokenActionValidator>

// --- BACKWARD COMPATIBILITY ---
// Pentru compatibilitate cu codul existent

export type SignInFormValues = SignInFormData
export type SetPasswordFormValues = SetPasswordFormData
