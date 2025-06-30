// src/lib/constants.ts

export const ROLES = {
  ADMIN: 'ADMIN',
  STYLIST: 'STYLIST',
} as const // `as const` face obiectul readonly și tipurile mai stricte

export const APP_ROUTES = {
  LOGIN: '/login',
  ADMIN_DASHBOARD: '/admin',
  STYLIST_DASHBOARD: '/stylist',
  ACCOUNT_SETUP: '/account-setup',
  LANDING: '/',
} as const

// Definim și tipurile pe baza constantelor pentru a le folosi în cod
export type UserRole = keyof typeof ROLES | null
