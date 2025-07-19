// src/core/domains/auth/auth.constants.ts

import { APP_ROUTES, ROLES } from '@/lib/constants'

// --- VALIDATION MESSAGES ---

/**
 * Mesaje pentru validarea datelor - descriptive și user-friendly
 */
export const AUTH_VALIDATION_MESSAGES = {
  INVALID_EMAIL: 'Adresa de email nu este validă.',
  PASSWORD_REQUIRED: 'Parola este obligatorie.',
  PASSWORD_TOO_SHORT: 'Parola trebuie să aibă cel puțin 8 caractere.',
  PASSWORDS_DO_NOT_MATCH: 'Parolele nu se potrivesc.',
  TOKEN_INVALID: 'Token-ul de invitație este invalid sau a expirat.',
} as const

// --- SUCCESS MESSAGES ---

/**
 * Mesaje de succes pentru operațiuni - descriptive și informative
 */
export const AUTH_SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Autentificare reușită! Vei fi redirecționat...',
  PASSWORD_SET_SUCCESS: 'Parola a fost setată cu succes!',
  PASSWORD_UPDATED_SUCCESS: 'Parola a fost actualizată cu succes!',
  SIGN_OUT_SUCCESS: 'Deconectare reușită!',
} as const

// --- ERROR MESSAGES ---

/**
 * Mesaje de eroare pentru operațiuni - descriptive și cu context
 */
export const AUTH_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Credențiale invalide. Te rugăm să încerci din nou.',
  NO_ROLE_ASSIGNED: 'Contul tău nu are un rol asignat. Te rugăm să contactezi un administrator.',
  SIGN_OUT_ERROR: 'Deconectarea a eșuat. Te rog încearcă din nou.',
  SET_PASSWORD_WITH_TOKEN_ERROR:
    'Setarea parolei după invitație trebuie finalizată pe client, folosind access_token și refresh_token din URL.',
  USER_NOT_FOUND: 'Utilizatorul nu a fost găsit în sistem.',
  DATABASE_ERROR: 'Eroare la accesarea bazei de date - contactați suportul tehnic.',
} as const

// --- SERVER MESSAGES ---

/**
 * Mesaje pentru server actions - cu coduri de eroare
 */
export const AUTH_SERVER_MESSAGES = {
  INVALID_CREDENTIALS: {
    code: 'INVALID_CREDENTIALS',
    message: AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS,
  },
  NO_ROLE_ASSIGNED: {
    code: 'NO_ROLE_ASSIGNED',
    message: AUTH_ERROR_MESSAGES.NO_ROLE_ASSIGNED,
  },
  LOGIN_SUCCESS: {
    code: 'LOGIN_SUCCESS',
    message: AUTH_SUCCESS_MESSAGES.LOGIN_SUCCESS,
  },
  PASSWORD_SET_SUCCESS: {
    code: 'PASSWORD_SET_SUCCESS',
    message: AUTH_SUCCESS_MESSAGES.PASSWORD_SET_SUCCESS,
  },
  SIGN_OUT_ERROR: {
    code: 'SIGN_OUT_ERROR',
    message: AUTH_ERROR_MESSAGES.SIGN_OUT_ERROR,
  },
  SET_PASSWORD_WITH_TOKEN_ERROR: {
    code: 'SET_PASSWORD_WITH_TOKEN_ERROR',
    message: AUTH_ERROR_MESSAGES.SET_PASSWORD_WITH_TOKEN_ERROR,
  },
} as const

// --- LOG MESSAGES ---

/**
 * Mesaje pentru logging - descriptive pentru debugging
 */
export const AUTH_LOG_MESSAGES = {
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
  FIND_USER_BY_EMAIL_ATTEMPT: 'Attempting to find user by email...',
  FIND_USER_BY_EMAIL_SUCCESS: 'Successfully found user.',
  FIND_USER_BY_EMAIL_FAILED: 'Failed to fetch user list from Supabase Auth.',
  USER_NOT_FOUND_IN_AUTH: 'User not found in Supabase Auth.',
} as const

// --- UI MESSAGES ---

/**
 * Mesaje pentru interfața utilizator
 */
export const AUTH_UI_MESSAGES = {
  LOGIN: {
    TITLE: 'Autentificare',
    DESCRIPTION: 'Introdu credențialele pentru a accesa contul tău.',
    EMAIL_LABEL: 'Adresă email',
    EMAIL_PLACEHOLDER: 'exemplu@email.com',
    PASSWORD_LABEL: 'Parolă',
    PASSWORD_PLACEHOLDER: 'Introdu parola',
    SUBMIT_BUTTON: 'Autentificare',
    FORGOT_PASSWORD: 'Ai uitat parola?',
  },
  SET_PASSWORD: {
    TITLE: 'Setează parola',
    DESCRIPTION: 'Creează o parolă sigură pentru contul tău.',
    PASSWORD_LABEL: 'Parolă nouă',
    PASSWORD_PLACEHOLDER: 'Minim 8 caractere',
    CONFIRM_PASSWORD_LABEL: 'Confirmă parola',
    CONFIRM_PASSWORD_PLACEHOLDER: 'Repetă parola',
    SUBMIT_BUTTON: 'Setează parola',
  },
  COMMON: {
    LOADING: 'Se procesează...',
    ERROR_TITLE: 'A apărut o eroare',
    SUCCESS_TITLE: 'Operațiune reușită',
  },
} as const

// --- SYSTEM LIMITS ---

/**
 * Configurări pentru limitări și validări
 */
export const AUTH_LIMITS = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_TOKEN_LENGTH: 10,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION_MINUTES: 15,
} as const

// --- ROUTE MAPPINGS ---

/**
 * Mapare roluri la dashboard-uri
 */
export const ROLE_DASHBOARD_MAP: Record<string, string> = {
  [ROLES.ADMIN]: APP_ROUTES.ADMIN_DASHBOARD,
  [ROLES.STYLIST]: APP_ROUTES.STYLIST_DASHBOARD,
} as const

// --- BACKWARD COMPATIBILITY ---

/**
 * Pentru compatibilitate cu codul existent
 */
export const AUTH_MESSAGES = {
  VALIDATION: AUTH_VALIDATION_MESSAGES,
  SUCCESS: AUTH_SUCCESS_MESSAGES,
  ERROR: AUTH_ERROR_MESSAGES,
  SERVER: AUTH_SERVER_MESSAGES,
  LOG: AUTH_LOG_MESSAGES,
  UI: AUTH_UI_MESSAGES,
} as const
