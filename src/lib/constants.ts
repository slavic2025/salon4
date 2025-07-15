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

/**
 * Constante pentru protecția rutelor
 */
export const ROUTE_PROTECTION = {
  // Rute publice care nu necesită autentificare
  PUBLIC_ROUTES: ['/', '/auth/login', '/auth/confirm'],

  // Rute care necesită autentificare dar fără verificare de rol
  AUTH_REQUIRED_ROUTES: [],

  // Rute specifice pentru admin
  ADMIN_ROUTES: ['/admin'],

  // Rute specifice pentru stylist
  STYLIST_ROUTES: ['/stylist'],

  // Mesaje de eroare pentru protecția rutelor
  MESSAGES: {
    UNAUTHORIZED: 'Nu ești autentificat. Te rugăm să te conectezi.',
    FORBIDDEN_ADMIN: 'Nu ai permisiuni de administrator pentru a accesa această pagină.',
    FORBIDDEN_STYLIST: 'Nu ai permisiuni de stilist pentru a accesa această pagină.',
    ROLE_NOT_FOUND: 'Contul tău nu are un rol asignat. Te rugăm să contactezi un administrator.',
    UNEXPECTED_ERROR: 'A apărut o eroare neașteptată. Te rugăm să încerci din nou.',
  },
} as const
