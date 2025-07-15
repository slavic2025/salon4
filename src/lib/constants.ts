// src/lib/constants.ts

export const ROLES = {
  ADMIN: 'ADMIN',
  STYLIST: 'STYLIST',
} as const // `as const` face obiectul readonly și tipurile mai stricte

export const PATHS = {
  revalidate: {
    list: () => '/admin/stylists',
    details: (id: string) => `/admin/stylists/${id}`,
  },
  pages: {
    list: '/admin/stylists',
    details: (id: string) => `/admin/stylists/${id}`,
    services: (id: string) => `/admin/stylists/${id}/services`,
  },
} as const

// Definim și tipurile pe baza constantelor pentru a le folosi în cod
export type UserRole = keyof typeof ROLES | null

export const DEFAULT_CURRENCY = 'MDL'

export const APP_ROUTES = {
  ADMIN_DASHBOARD: '/admin',
  STYLIST_DASHBOARD: '/stylist',
  LOGIN: '/auth/login',
  LANDING: '/',
  ADMIN_STYLISTS_PAGE: '/admin/stylists',
  ADMIN_SERVICES_PAGE: '/admin/services',
  AUTH_CONFIRM:
    process.env.NODE_ENV === 'production'
      ? 'https://yourdomain.com/auth/confirm' // TODO: Înlocuiește cu domeniul tău în producție
      : 'http://localhost:3000/auth/confirm',
} as const
