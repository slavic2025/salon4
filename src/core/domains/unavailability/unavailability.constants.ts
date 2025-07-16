// src/core/domains/unavailability/unavailability.constants.ts

import type { UnavailabilityCause } from './unavailability.types'

/**
 * Tipurile de cauze pentru indisponibilitate
 */
export const UNAVAILABILITY_CAUSES = {
  PAUZA: 'pauza',
  PROGRAMARE_OFFLINE: 'programare_offline',
  ALTA_SITUATIE: 'alta_situatie',
} as const

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
 * Mesaje pentru validarea datelor
 */
export const UNAVAILABILITY_VALIDATION_MESSAGES = {
  STYLIST_ID_REQUIRED: 'ID-ul stylistului este obligatoriu',
  STYLIST_ID_INVALID: 'ID-ul stylistului este invalid',
  DATE_REQUIRED: 'Data este obligatorie',
  DATE_INVALID: 'Data este invalidă',
  START_TIME_REQUIRED: 'Ora de început este obligatorie când nu este toată ziua',
  END_TIME_REQUIRED: 'Ora de sfârșit este obligatorie când nu este toată ziua',
  END_TIME_AFTER_START: 'Ora de sfârșit trebuie să fie după ora de început',
  CAUSE_REQUIRED: 'Cauza indisponibilității este obligatorie',
  CAUSE_INVALID: 'Cauza selectată este invalidă',
  TIME_CONFLICT: 'Există un conflict cu un alt interval de indisponibilitate',
  DATE_IN_PAST: 'Nu se poate crea indisponibilitate pentru o dată din trecut',
} as const

/**
 * Mesaje de succes pentru operațiuni
 */
export const UNAVAILABILITY_SUCCESS_MESSAGES = {
  CREATED: 'Indisponibilitatea a fost creată cu succes',
  UPDATED: 'Indisponibilitatea a fost actualizată cu succes',
  DELETED: 'Indisponibilitatea a fost ștearsă cu succes',
} as const

/**
 * Mesaje de eroare pentru operațiuni
 */
export const UNAVAILABILITY_ERROR_MESSAGES = {
  NOT_FOUND: 'Indisponibilitatea nu a fost găsită',
  CREATION_FAILED: 'Crearea indisponibilității a eșuat',
  UPDATE_FAILED: 'Actualizarea indisponibilității a eșuat',
  DELETE_FAILED: 'Ștergerea indisponibilității a eșuat',
  UNAUTHORIZED: 'Nu aveți permisiunea să accesați această indisponibilitate',
  STYLIST_NOT_FOUND: 'Stylistul nu a fost găsit',
  INVALID_TIME_FORMAT: 'Formatul timpului este invalid',
  CONFLICT_EXISTS: 'Există deja o indisponibilitate în acest interval',
  DATABASE_ERROR: 'Eroare la accesarea bazei de date',
} as const

/**
 * Configurări pentru paginare și limitări
 */
export const UNAVAILABILITY_LIMITS = {
  MAX_PER_PAGE: 50,
  DEFAULT_PER_PAGE: 20,
  MAX_DESCRIPTION_LENGTH: 500,
  MIN_DURATION_MINUTES: 15, // Durata minimă pentru un interval (15 minute)
  MAX_ADVANCE_DAYS: 365, // Maxim 1 an în avans pentru planificare
  MAX_CONFLICTS_TO_CHECK: 10, // Numărul maxim de conflicte de verificat
} as const

/**
 * Formate pentru afișarea datelor și timpului
 */
export const UNAVAILABILITY_FORMATS = {
  DATE_FORMAT: 'dd/MM/yyyy',
  TIME_FORMAT: 'HH:mm',
  DATETIME_FORMAT: 'dd/MM/yyyy HH:mm',
  DATE_INPUT_FORMAT: 'yyyy-MM-dd',
  TIME_INPUT_FORMAT: 'HH:mm',
} as const

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
