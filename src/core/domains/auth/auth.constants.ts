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
  },
} as const

export const ROLE_DASHBOARD_MAP: Record<string, string> = {
  [ROLES.ADMIN]: APP_ROUTES.ADMIN_DASHBOARD,
  [ROLES.STYLIST]: APP_ROUTES.STYLIST_DASHBOARD,
} as const
