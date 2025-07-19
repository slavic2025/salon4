// src/core/domains/services/service.constants.ts

import type { ServiceCategory } from './service.types'

// --- ENUM VALUES ---

/**
 * Categoriile de servicii disponibile
 */
export const SERVICE_CATEGORIES = ['haircut', 'coloring', 'styling', 'treatment', 'other'] as const

// --- UI LABELS & DESCRIPTIONS ---

/**
 * Etichete pentru afișarea categoriilor în UI
 */
export const SERVICE_CATEGORY_LABELS: Record<ServiceCategory, string> = {
  haircut: 'Tunsori',
  coloring: 'Vopsit',
  styling: 'Coafat',
  treatment: 'Tratamente',
  other: 'Altele',
}

/**
 * Descrieri pentru categoriile de servicii
 */
export const SERVICE_CATEGORY_DESCRIPTIONS: Record<ServiceCategory, string> = {
  haircut: 'Servicii de tunsori pentru toate tipurile de păr',
  coloring: 'Servicii de vopsit și colorare profesională',
  styling: 'Servicii de coafat și styling pentru ocazii speciale',
  treatment: 'Tratamente pentru păr și scalp',
  other: 'Alte servicii specializate',
}

/**
 * Icoane pentru fiecare categorie de serviciu
 */
export const SERVICE_CATEGORY_ICONS = {
  haircut: 'scissors',
  coloring: 'palette',
  styling: 'sparkles',
  treatment: 'heart',
  other: 'plus-circle',
} as const

/**
 * Culori pentru afișarea diferitelor categorii de servicii
 */
export const SERVICE_CATEGORY_COLORS = {
  haircut: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-300',
  },
  coloring: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    border: 'border-purple-300',
  },
  styling: {
    bg: 'bg-pink-100',
    text: 'text-pink-800',
    border: 'border-pink-300',
  },
  treatment: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-300',
  },
  other: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-300',
  },
} as const

// --- VALIDATION MESSAGES ---

/**
 * Mesaje pentru validarea datelor - descriptive și user-friendly
 */
export const SERVICE_VALIDATION_MESSAGES = {
  NAME_REQUIRED: 'Numele serviciului este obligatoriu pentru a identifica serviciul',
  NAME_MIN_LENGTH: 'Numele serviciului trebuie să aibă cel puțin 3 caractere pentru a fi valid',
  NAME_MAX_LENGTH: 'Numele serviciului nu poate depăși 100 de caractere',
  DESCRIPTION_MAX_LENGTH: 'Descrierea serviciului nu poate depăși 500 de caractere',
  PRICE_REQUIRED: 'Prețul serviciului este obligatoriu',
  PRICE_POSITIVE: 'Prețul trebuie să fie un număr pozitiv mai mare decât 0',
  PRICE_MAX_VALUE: 'Prețul nu poate depăși 10000 RON',
  DURATION_REQUIRED: 'Durata serviciului este obligatorie',
  DURATION_POSITIVE: 'Durata trebuie să fie un număr întreg pozitiv',
  DURATION_MAX_VALUE: 'Durata nu poate depăși 480 minute (8 ore)',
  CATEGORY_REQUIRED: 'Categoria serviciului este obligatorie pentru organizare',
  CATEGORY_INVALID: 'Categoria selectată nu este validă - alegeți din lista disponibilă',
  ID_REQUIRED: 'ID-ul serviciului este necesar pentru această operațiune',
  ID_INVALID: 'ID-ul serviciului trebuie să fie un UUID valid',
} as const

// --- SUCCESS MESSAGES ---

/**
 * Mesaje de succes pentru operațiuni - descriptive și informative
 */
export const SERVICE_SUCCESS_MESSAGES = {
  CREATED: 'Serviciul a fost creat cu succes și este disponibil pentru programări',
  UPDATED: 'Serviciul a fost actualizat cu succes',
  DELETED: 'Serviciul a fost șters cu succes din sistem',
  ACTIVATED: 'Serviciul a fost activat cu succes',
  DEACTIVATED: 'Serviciul a fost dezactivat cu succes',
} as const

// --- ERROR MESSAGES ---

/**
 * Mesaje de eroare pentru operațiuni - descriptive și cu context
 */
export const SERVICE_ERROR_MESSAGES = {
  NOT_FOUND: 'Serviciul nu a fost găsit în sistem - poate a fost șters de altcineva',
  ALREADY_EXISTS: 'Un serviciu cu acest nume există deja în aceeași categorie',
  CREATE_FAILED: 'Crearea serviciului a eșuat din cauza unei probleme tehnice - încercați din nou',
  UPDATE_FAILED: 'Actualizarea serviciului a eșuat din cauza unei probleme tehnice - încercați din nou',
  DELETE_FAILED: 'Ștergerea serviciului a eșuat din cauza unei probleme tehnice - încercați din nou',
  UNAUTHORIZED: 'Nu aveți permisiunea să accesați sau modificați acest serviciu',
  DATABASE_ERROR: 'Eroare la accesarea bazei de date - contactați suportul tehnic',
  INVALID_DATA: 'Datele furnizate pentru serviciu sunt invalide',
} as const

// --- ADMIN UI MESSAGES ---

/**
 * Mesaje pentru interfața de administrare a serviciilor
 */
export const SERVICE_ADMIN_UI_MESSAGES = {
  PAGE_TITLE: 'Gestionare Servicii',
  PAGE_DESCRIPTION: 'Gestionează serviciile oferite de salon',
  ADD_BUTTON: 'Adaugă Serviciu',
  EDIT_BUTTON: 'Editează',
  DELETE_BUTTON: 'Șterge',
  SAVE_BUTTON: 'Salvează',
  CANCEL_BUTTON: 'Anulează',
  ADD_TITLE: 'Adaugă serviciu nou',
  EDIT_TITLE: 'Editează serviciu',
  DELETE_CONFIRM_TITLE: 'Șterge serviciu',
  DELETE_CONFIRM_DESC: 'Ești sigur că vrei să ștergi acest serviciu? Această acțiune nu poate fi anulată.',
  NAME_LABEL: 'Nume serviciu',
  DESCRIPTION_LABEL: 'Descriere',
  PRICE_LABEL: 'Preț (RON)',
  DURATION_LABEL: 'Durată (minute)',
  CATEGORY_LABEL: 'Categorie',
  IS_ACTIVE_LABEL: 'Activ',
  NO_SERVICES_TITLE: 'Niciun serviciu înregistrat',
  NO_SERVICES_DESC: 'Adaugă primul serviciu pentru a începe să gestionezi oferta salonului.',
  LOADING_CREATE: 'Se creează...',
  LOADING_UPDATE: 'Se actualizează...',
  LOADING_DELETE: 'Se șterge...',
  SEARCH_PLACEHOLDER: 'Caută după nume sau categorie...',
  FILTER_BY_CATEGORY: 'Filtrează după categorie',
  SHOW_ACTIVE_ONLY: 'Arată doar serviciile active',
} as const

// --- SYSTEM LIMITS ---

/**
 * Configurări pentru limitări și validări
 */
export const SERVICE_LIMITS = {
  MAX_PER_PAGE: 50, // Numărul maxim de servicii afișate pe pagină
  DEFAULT_PER_PAGE: 20, // Numărul implicit de servicii pe pagină
  MAX_NAME_LENGTH: 100, // Lungimea maximă pentru numele serviciului
  MIN_NAME_LENGTH: 3, // Lungimea minimă pentru numele serviciului
  MAX_DESCRIPTION_LENGTH: 500, // Lungimea maximă pentru descrierea serviciului
  MIN_PRICE: 0.01, // Prețul minim pentru un serviciu
  MAX_PRICE: 10000, // Prețul maxim pentru un serviciu
  MIN_DURATION: 1, // Durata minimă pentru un serviciu (minute)
  MAX_DURATION: 480, // Durata maximă pentru un serviciu (minute) - 8 ore
} as const

// --- FORMATS ---

/**
 * Formate pentru afișarea datelor
 */
export const SERVICE_FORMATS = {
  PRICE_FORMAT: '0.00', // Format pentru afișarea prețului
  DURATION_FORMAT: '0', // Format pentru afișarea duratei
  CURRENCY: 'RON', // Moneda folosită
  TIME_UNIT: 'minute', // Unitatea de timp pentru durată
} as const

// --- BACKWARD COMPATIBILITY ---

/**
 * Pentru compatibilitate cu codul existent
 */
export const SERVICE_MESSAGES = {
  VALIDATION: SERVICE_VALIDATION_MESSAGES,
  SUCCESS: SERVICE_SUCCESS_MESSAGES,
  ERROR: SERVICE_ERROR_MESSAGES,
  ADMIN_UI: SERVICE_ADMIN_UI_MESSAGES,
  SERVER: {
    CREATE_SUCCESS: SERVICE_SUCCESS_MESSAGES.CREATED,
    CREATE_FAILED: SERVICE_ERROR_MESSAGES.CREATE_FAILED,
    UPDATE_SUCCESS: SERVICE_SUCCESS_MESSAGES.UPDATED,
    UPDATE_FAILED: SERVICE_ERROR_MESSAGES.UPDATE_FAILED,
    DELETE_SUCCESS: SERVICE_SUCCESS_MESSAGES.DELETED,
    DELETE_FAILED: SERVICE_ERROR_MESSAGES.DELETE_FAILED,
    NOT_FOUND: SERVICE_ERROR_MESSAGES.NOT_FOUND,
  },
} as const
