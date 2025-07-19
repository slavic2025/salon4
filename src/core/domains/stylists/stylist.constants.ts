// src/core/domains/stylists/stylist.constants.ts
import type { NavItem } from '@/types/ui.types'

// --- VALIDATION MESSAGES ---

/**
 * Mesaje pentru validarea datelor - descriptive și user-friendly
 */
export const STYLIST_VALIDATION_MESSAGES = {
  FULL_NAME_REQUIRED: 'Numele complet este obligatoriu pentru a identifica stilistul',
  FULL_NAME_MIN_LENGTH: 'Numele trebuie să aibă cel puțin 3 caractere pentru a fi valid',
  INVALID_EMAIL: 'Adresa de email nu este validă - verificați formatul (ex: stilist@salon.com)',
  PHONE_TOO_SHORT: 'Numărul de telefon este prea scurt - trebuie să aibă cel puțin 9 cifre',
  ID_REQUIRED: 'ID-ul stilistului este necesar pentru această operațiune',
  EMAIL_ALREADY_EXISTS: 'Această adresă de email este deja folosită de alt stilist',
  PHONE_ALREADY_EXISTS: 'Acest număr de telefon este deja folosit de alt stilist',
} as const

// --- SUCCESS MESSAGES ---

/**
 * Mesaje de succes pentru operațiuni - descriptive și informative
 */
export const STYLIST_SUCCESS_MESSAGES = {
  CREATED: 'Stilistul a fost invitat și adăugat cu succes în sistem!',
  UPDATED: 'Profilul stilistului a fost actualizat cu succes',
  DELETED: 'Stilistul a fost șters cu succes din sistem',
  INVITATION_SENT: 'Invitația a fost trimisă cu succes pe adresa de email',
} as const

// --- ERROR MESSAGES ---

/**
 * Mesaje de eroare pentru operațiuni - descriptive și cu context
 */
export const STYLIST_ERROR_MESSAGES = {
  NOT_FOUND: 'Stilistul nu a fost găsit în sistem - poate a fost șters de altcineva',
  CREATE_AUTH_ERROR: 'Eroare la crearea contului de autentificare pentru stilist - încercați din nou',
  CREATE_PROFILE_ERROR:
    'Contul de autentificare a fost creat, dar a apărut o eroare la salvarea profilului. Contul a fost șters pentru a preveni date inconsistente.',
  UPDATE_FAILED: 'A apărut o eroare la actualizarea profilului - încercați din nou',
  DELETE_FAILED: 'A apărut o eroare la ștergerea stilistului - încercați din nou',
  UNAUTHORIZED: 'Nu aveți permisiunea să accesați sau modificați acest stilist',
  DATABASE_ERROR: 'Eroare la accesarea bazei de date - contactați suportul tehnic',
} as const

// --- ADMIN UI MESSAGES ---

/**
 * Mesaje pentru interfața de administrare a stiliștilor
 */
export const STYLIST_ADMIN_UI_MESSAGES = {
  PAGE_TITLE: 'Gestionare Stiliști',
  PAGE_DESCRIPTION: 'Gestionează echipa de stiliști și cosmetologi ai salonului',
  ADD_BUTTON: 'Adaugă Stilist',
  EDIT_BUTTON: 'Editează',
  DELETE_BUTTON: 'Șterge',
  SAVE_BUTTON: 'Salvează',
  CANCEL_BUTTON: 'Anulează',
  ADD_TITLE: 'Adaugă stilist nou',
  EDIT_TITLE: 'Editează stilist',
  DELETE_CONFIRM_TITLE: 'Șterge stilist',
  DELETE_CONFIRM_DESC: 'Ești sigur că vrei să ștergi acest stilist? Această acțiune nu poate fi anulată.',
  FULL_NAME_LABEL: 'Nume complet',
  EMAIL_LABEL: 'Adresă email',
  PHONE_LABEL: 'Număr telefon',
  DESCRIPTION_LABEL: 'Descriere',
  IS_ACTIVE_LABEL: 'Activ',
  NO_STYLISTS_TITLE: 'Niciun stilist înregistrat',
  NO_STYLISTS_DESC: 'Adaugă primul stilist pentru a începe să gestionezi echipa.',
  LOADING_CREATE: 'Se creează...',
  LOADING_UPDATE: 'Se actualizează...',
  LOADING_DELETE: 'Se șterge...',
  SEARCH_PLACEHOLDER: 'Caută după nume sau email...',
} as const

// --- DASHBOARD UI MESSAGES ---

/**
 * Mesaje pentru dashboard-ul stilistului
 */
export const STYLIST_DASHBOARD_MESSAGES = {
  DASHBOARD: {
    WELCOME_TITLE: 'Dashboard Stilist',
    WELCOME_DESCRIPTION: 'Bine ai venit! Aici poți gestiona programările și serviciile tale.',
  },
  PROFILE: {
    TITLE: 'Profilul meu',
    DESCRIPTION: 'Gestionează informațiile tale personale și profesionale.',
  },
  SERVICES: {
    TITLE: 'Serviciile mele',
    DESCRIPTION: 'Vezi și gestionează serviciile pe care le oferi.',
  },
  APPOINTMENTS: {
    TITLE: 'Programările mele',
    DESCRIPTION: 'Vezi și gestionează programările tale.',
  },
  WORK_SCHEDULE: {
    TITLE: 'Programul meu de lucru',
    DESCRIPTION: 'Configurează intervalele tale de lucru pentru fiecare zi a săptămânii.',
  },
} as const

// --- NAVIGATION ITEMS ---

/**
 * Elemente de navigație pentru dashboard-ul stilistului
 */
export const STYLIST_NAV_ITEMS: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/stylist',
    icon: 'dashboard',
  },
  {
    title: 'Programările mele',
    href: '/stylist/appointments',
    icon: 'calendar',
  },
  {
    title: 'Indisponibilitate',
    href: '/stylist/unavailability',
    icon: 'calendarX',
  },
  {
    title: 'Programul meu de lucru',
    href: '/stylist/work-schedule',
    icon: 'clock',
  },
  {
    title: 'Serviciile mele',
    href: '/stylist/services',
    icon: 'scissors',
  },
  {
    title: 'Profilul meu',
    href: '/stylist/profile',
    icon: 'user',
  },
]

// --- SYSTEM LIMITS ---

/**
 * Configurări pentru limitări și validări
 */
export const STYLIST_LIMITS = {
  MAX_PER_PAGE: 50, // Numărul maxim de stiliști afișați pe pagină
  DEFAULT_PER_PAGE: 20, // Numărul implicit de stiliști pe pagină
  MAX_DESCRIPTION_LENGTH: 500, // Lungimea maximă pentru descrierea stilistului
  MIN_FULL_NAME_LENGTH: 3, // Lungimea minimă pentru numele complet
  MAX_FULL_NAME_LENGTH: 100, // Lungimea maximă pentru numele complet
  MIN_PHONE_LENGTH: 9, // Lungimea minimă pentru telefon
  MAX_PHONE_LENGTH: 15, // Lungimea maximă pentru telefon
} as const

// --- BACKWARD COMPATIBILITY ---

/**
 * Pentru compatibilitate cu codul existent
 */
export const STYLIST_MESSAGES = {
  VALIDATION: STYLIST_VALIDATION_MESSAGES,
  SUCCESS: STYLIST_SUCCESS_MESSAGES,
  ERROR: STYLIST_ERROR_MESSAGES,
  ADMIN_UI: STYLIST_ADMIN_UI_MESSAGES,
  DASHBOARD_UI: STYLIST_DASHBOARD_MESSAGES,
  SERVER: {
    CREATE_SUCCESS: STYLIST_SUCCESS_MESSAGES.CREATED,
    CREATE_AUTH_ERROR: STYLIST_ERROR_MESSAGES.CREATE_AUTH_ERROR,
    CREATE_PROFILE_ERROR: STYLIST_ERROR_MESSAGES.CREATE_PROFILE_ERROR,
    UPDATE_SUCCESS: STYLIST_SUCCESS_MESSAGES.UPDATED,
    UPDATE_ERROR: STYLIST_ERROR_MESSAGES.UPDATE_FAILED,
    DELETE_SUCCESS: STYLIST_SUCCESS_MESSAGES.DELETED,
    DELETE_ERROR: STYLIST_ERROR_MESSAGES.DELETE_FAILED,
    NOT_FOUND: STYLIST_ERROR_MESSAGES.NOT_FOUND,
  },
} as const
