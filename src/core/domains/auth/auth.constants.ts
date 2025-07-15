// src/core/domains/auth/auth.constants.ts

import { APP_ROUTES, ROLES } from '@/lib/constants'

export const AUTH_MESSAGES = {
  // Mesajele de validare pentru Zod rămân simple
  VALIDATION: {
    INVALID_EMAIL: 'Adresa de email nu este validă.',
    PASSWORD_REQUIRED: 'Parola este obligatorie.',
    PASSWORD_TOO_SHORT: 'Parola trebuie să aibă cel puțin 8 caractere.',
    PASSWORDS_DO_NOT_MATCH: 'Parolele nu se potrivesc.',
  },

  // Mesajele de pe server devin obiecte
  SERVER: {
    INVALID_CREDENTIALS: {
      code: 'INVALID_CREDENTIALS',
      message: 'Credențiale invalide. Te rugăm să încerci din nou.',
    },
    NO_ROLE_ASSIGNED: {
      code: 'NO_ROLE_ASSIGNED',
      message: 'Contul tău nu are un rol asignat. Te rugăm să contactezi un administrator.',
    },
    LOGIN_SUCCESS: {
      code: 'LOGIN_SUCCESS',
      message: 'Autentificare reușită! Vei fi redirecționat...',
    },
    PASSWORD_SET_SUCCESS: {
      code: 'PASSWORD_SET_SUCCESS',
      message: 'Parola a fost setată cu succes!',
    },
    SIGN_OUT_ERROR: {
      code: 'SIGN_OUT_ERROR',
      message: 'Deconectarea a eșuat. Te rog încearcă din nou.',
    },
    SET_PASSWORD_WITH_TOKEN_ERROR: {
      code: 'SET_PASSWORD_WITH_TOKEN_ERROR',
      message:
        'Setarea parolei după invitație trebuie finalizată pe client, folosind access_token și refresh_token din URL.',
    },
  },

  // Mesajele pentru logging
  LOG: {
    USER_NO_ROLE_WARNING: 'User is authenticated but has no role.',
    FETCHING_USER_ROLE: 'Fetching user role directly from the database...',
    USER_NO_ROLE_IN_DB_WARNING: 'Authenticated user has no role assigned in the database.',
    ROLE_FETCHED_SUCCESS: 'Role successfully fetched from database.',
    SIGN_IN_FAILED: 'Failed sign-in attempt.',
    SIGN_IN_SUCCESS: 'User signed in successfully.',
    SET_PASSWORD_FAILED: 'Failed to set password.',
    SET_PASSWORD_SUCCESS: 'Password set successfully for current user.',
    SET_PASSWORD_WITH_TOKEN_ATTEMPTED:
      'Attempt to set password with token on server - this operation should be performed on client.',
    SIGN_OUT_FAILED: 'Failed to sign out.',
    SIGN_OUT_SUCCESS: 'User signed out successfully.',
  },
} as const

export const ROLE_DASHBOARD_MAP: Record<string, string> = {
  [ROLES.ADMIN]: APP_ROUTES.ADMIN_DASHBOARD,
  [ROLES.STYLIST]: APP_ROUTES.STYLIST_DASHBOARD,
} as const
