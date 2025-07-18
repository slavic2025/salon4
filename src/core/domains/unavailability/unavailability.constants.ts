// src/core/domains/unavailability/unavailability.constants.ts

import type { UnavailabilityCause } from './unavailability.types'

// --- ENUM VALUES ---

/**
 * Tipurile de cauze pentru indisponibilitate
 */
export const UNAVAILABILITY_CAUSES = {
  PAUZA: 'pauza',
  PROGRAMARE_OFFLINE: 'programare_offline',
  ALTA_SITUATIE: 'alta_situatie',
} as const

// --- UI LABELS & DESCRIPTIONS ---

/**
 * Etichete pentru afișarea cauzelor în UI
 */
export const UNAVAILABILITY_CAUSE_LABELS: Record<UnavailabilityCause, string> = {
  pauza: 'Pauză',
  programare_offline: 'Programare offline',
  alta_situatie: 'Altă situație',
}

/**
 * Descrieri pentru cauzele de indisponibilitate
 */
export const UNAVAILABILITY_CAUSE_DESCRIPTIONS: Record<UnavailabilityCause, string> = {
  pauza: 'Pauză planificată peste programul normal de lucru',
  programare_offline: 'Programare care nu se desfășoară la salon',
  alta_situatie: 'Situație excepțională sau neprevăzută',
}

/**
 * Culori pentru afișarea diferitelor tipuri de indisponibilitate
 */
export const UNAVAILABILITY_COLORS = {
  pauza: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-300',
  },
  programare_offline: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-300',
  },
  alta_situatie: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-300',
  },
} as const

/**
 * Icoane pentru fiecare tip de cauză
 */
export const UNAVAILABILITY_ICONS = {
  pauza: 'pause-circle',
  programare_offline: 'map-pin-off',
  alta_situatie: 'alert-circle',
} as const

// --- VALIDATION MESSAGES ---

/**
 * Mesaje pentru validarea datelor - mai descriptive și user-friendly
 */
export const UNAVAILABILITY_VALIDATION_MESSAGES = {
  STYLIST_ID_REQUIRED: 'ID-ul stylistului este obligatoriu pentru a crea indisponibilitatea',
  STYLIST_ID_INVALID: 'ID-ul stylistului trebuie să fie un UUID valid',
  DATE_REQUIRED: 'Data indisponibilității este obligatorie',
  DATE_INVALID: 'Data trebuie să fie în format YYYY-MM-DD (ex: 2024-03-15)',
  START_TIME_REQUIRED: 'Ora de început este obligatorie când nu este selectată opțiunea "Toată ziua"',
  END_TIME_REQUIRED: 'Ora de sfârșit este obligatorie când nu este selectată opțiunea "Toată ziua"',
  END_TIME_AFTER_START: 'Ora de sfârșit trebuie să fie după ora de început',
  CAUSE_REQUIRED: 'Cauza indisponibilității este obligatorie pentru a categorisi intervalul',
  CAUSE_INVALID: 'Cauza selectată nu este validă - alegeți din lista disponibilă',
  TIME_CONFLICT: 'Există deja o indisponibilitate în acest interval de timp',
  DATE_IN_PAST: 'Nu se poate crea indisponibilitate pentru o dată din trecut',
} as const

// --- SUCCESS MESSAGES ---

/**
 * Mesaje de succes pentru operațiuni - mai descriptive
 */
export const UNAVAILABILITY_SUCCESS_MESSAGES = {
  CREATED: 'Indisponibilitatea a fost creată cu succes și va fi luată în considerare pentru programări',
  UPDATED: 'Indisponibilitatea a fost actualizată cu succes',
  DELETED: 'Indisponibilitatea a fost ștearsă cu succes din sistem',
} as const

// --- ERROR MESSAGES ---

/**
 * Mesaje de eroare pentru operațiuni - mai descriptive și cu context
 */
export const UNAVAILABILITY_ERROR_MESSAGES = {
  NOT_FOUND: 'Indisponibilitatea nu a fost găsită în sistem - poate a fost ștearsă de altcineva',
  CREATION_FAILED: 'Crearea indisponibilității a eșuat din cauza unei probleme tehnice - încercați din nou',
  UPDATE_FAILED: 'Actualizarea indisponibilității a eșuat din cauza unei probleme tehnice - încercați din nou',
  DELETE_FAILED: 'Ștergerea indisponibilității a eșuat din cauza unei probleme tehnice - încercați din nou',
  UNAUTHORIZED: 'Nu aveți permisiunea să accesați sau modificați această indisponibilitate',
  STYLIST_NOT_FOUND: 'Stylistul nu a fost găsit în sistem - verificați ID-ul',
  INVALID_TIME_FORMAT: 'Formatul timpului este invalid - folosiți formatul HH:MM (ex: 14:30)',
  CONFLICT_EXISTS: 'Există deja o indisponibilitate în acest interval - verificați calendarul',
  DATABASE_ERROR: 'Eroare la accesarea bazei de date - contactați suportul tehnic',
} as const

// --- SYSTEM LIMITS ---

/**
 * Configurări pentru paginare și limitări - cu explicații
 */
export const UNAVAILABILITY_LIMITS = {
  MAX_PER_PAGE: 50, // Numărul maxim de indisponibilități afișate pe pagină
  DEFAULT_PER_PAGE: 20, // Numărul implicit de indisponibilități pe pagină
  MAX_DESCRIPTION_LENGTH: 500, // Lungimea maximă pentru descrierea indisponibilității
  MIN_DURATION_MINUTES: 15, // Durata minimă pentru un interval (15 minute)
  MAX_ADVANCE_DAYS: 365, // Maxim 1 an în avans pentru planificare
  MAX_CONFLICTS_TO_CHECK: 10, // Numărul maxim de conflicte de verificat înainte de salvare
} as const

// --- FORMATS ---

/**
 * Formate pentru afișarea datelor și timpului
 */
export const UNAVAILABILITY_FORMATS = {
  DATE_FORMAT: 'dd/MM/yyyy', // Format pentru afișarea datei în UI
  TIME_FORMAT: 'HH:mm', // Format pentru afișarea timpului în UI
  DATETIME_FORMAT: 'dd/MM/yyyy HH:mm', // Format pentru afișarea datei și timpului
  DATE_INPUT_FORMAT: 'yyyy-MM-dd', // Format pentru input-ul de dată
  TIME_INPUT_FORMAT: 'HH:mm', // Format pentru input-ul de timp
} as const
