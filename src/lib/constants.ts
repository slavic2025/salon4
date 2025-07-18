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
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  ADMIN: '/admin',
  STYLIST: '/stylist',
} as const

export const UI_MESSAGES = {
  LOADING: {
    NAVIGATION: 'Se încarcă...',
    GENERAL: 'Se procesează...',
    SUBMITTING: 'Se trimite...',
  },
  ERRORS: {
    GENERAL: 'A apărut o eroare. Vă rugăm să încercați din nou.',
    NETWORK: 'Eroare de conexiune. Verificați conexiunea la internet.',
    VALIDATION: 'Datele introduse nu sunt valide.',
  },
  SUCCESS: {
    SAVED: 'Datele au fost salvate cu succes.',
    UPDATED: 'Datele au fost actualizate cu succes.',
    DELETED: 'Elementul a fost șters cu succes.',
  },
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
