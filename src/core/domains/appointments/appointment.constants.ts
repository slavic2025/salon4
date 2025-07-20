// src/core/domains/appointments/appointment.constants.ts

import type { AppointmentStatus } from './appointment.types'

// --- ENUM VALUES ---

/**
 * Statusurile programărilor disponibile
 */
export const APPOINTMENT_STATUSES = ['waiting', 'confirmed', 'refused', 'cancelled', 'completed', 'no_show'] as const

// --- UI LABELS & DESCRIPTIONS ---

/**
 * Etichete pentru afișarea statusurilor în UI
 */
export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  waiting: 'În așteptare',
  confirmed: 'Confirmat',
  refused: 'Refuzat',
  cancelled: 'Anulat',
  completed: 'Finalizat',
  no_show: 'Nu s-a prezentat',
}

/**
 * Descrieri pentru statusurile programărilor
 */
export const APPOINTMENT_STATUS_DESCRIPTIONS: Record<AppointmentStatus, string> = {
  waiting: 'Programarea este în așteptarea confirmării',
  confirmed: 'Programarea a fost confirmată și este activă',
  refused: 'Programarea a fost refuzată',
  cancelled: 'Programarea a fost anulată',
  completed: 'Serviciul a fost finalizat cu succes',
  no_show: 'Clientul nu s-a prezentat la programare',
}

/**
 * Icoane pentru fiecare status de programare
 */
export const APPOINTMENT_STATUS_ICONS = {
  waiting: 'clock',
  confirmed: 'check-circle',
  refused: 'x-circle',
  cancelled: 'minus-circle',
  completed: 'check-square',
  no_show: 'user-x',
} as const

/**
 * Culori pentru afișarea diferitelor statusuri de programare
 */
export const APPOINTMENT_STATUS_COLORS = {
  waiting: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-300',
  },
  confirmed: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-300',
  },
  refused: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-300',
  },
  cancelled: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-300',
  },
  completed: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-300',
  },
  no_show: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-300',
  },
} as const

// --- VALIDATION MESSAGES ---

/**
 * Mesaje pentru validarea datelor - descriptive și user-friendly
 */
export const APPOINTMENT_VALIDATION_MESSAGES = {
  EMAIL_REQUIRED: 'Adresa de email este obligatorie pentru contact',
  EMAIL_INVALID: 'Adresa de email nu este într-un format valid',
  EMAIL_MAX_LENGTH: 'Adresa de email nu poate depăși 255 de caractere',
  CLIENT_NAME_REQUIRED: 'Numele clientului este obligatoriu',
  CLIENT_NAME_MIN_LENGTH: 'Numele clientului trebuie să aibă cel puțin 2 caractere',
  CLIENT_NAME_MAX_LENGTH: 'Numele clientului nu poate depăși 100 de caractere',
  CLIENT_NAME_INVALID_FORMAT: 'Numele poate conține doar litere și spații',
  CLIENT_PHONE_REQUIRED: 'Numărul de telefon este obligatoriu pentru contact',
  CLIENT_PHONE_INVALID_FORMAT: 'Numărul de telefon trebuie să fie în format românesc (+40 sau 0 urmat de 9 cifre)',
  CLIENT_NOTES_MAX_LENGTH: 'Notele nu pot depăși 500 de caractere',
  SERVICE_ID_REQUIRED: 'Serviciul este obligatoriu pentru programare',
  SERVICE_ID_INVALID: 'ID-ul serviciului trebuie să fie un UUID valid',
  STYLIST_ID_REQUIRED: 'Stilistul este obligatoriu pentru programare',
  STYLIST_ID_INVALID: 'ID-ul stilistului trebuie să fie un UUID valid',
  START_TIME_REQUIRED: 'Ora de început este obligatorie',
  START_TIME_INVALID: 'Ora de început nu este într-un format valid',
  START_TIME_PAST: 'Ora de început nu poate fi în trecut',
  END_TIME_REQUIRED: 'Ora de sfârșit este obligatorie',
  END_TIME_INVALID: 'Ora de sfârșit nu este într-un format valid',
  END_TIME_BEFORE_START: 'Ora de sfârșit trebuie să fie după ora de început',
  STATUS_INVALID: 'Statusul selectat nu este valid',
  ID_REQUIRED: 'ID-ul programării este necesar pentru această operațiune',
  ID_INVALID: 'ID-ul programării trebuie să fie un UUID valid',
} as const

// --- SUCCESS MESSAGES ---

/**
 * Mesaje de succes pentru operațiuni - descriptive și informative
 */
export const APPOINTMENT_SUCCESS_MESSAGES = {
  CREATED: 'Programarea a fost creată cu succes și este în așteptarea confirmării',
  UPDATED: 'Programarea a fost actualizată cu succes',
  DELETED: 'Programarea a fost ștearsă cu succes din sistem',
  STATUS_UPDATED: 'Statusul programării a fost actualizat cu succes',
  CONFIRMED: 'Programarea a fost confirmată cu succes',
  CANCELLED: 'Programarea a fost anulată cu succes',
  COMPLETED: 'Programarea a fost marcată ca finalizată',
} as const

// --- ERROR MESSAGES ---

/**
 * Mesaje de eroare pentru operațiuni - descriptive și cu context
 */
export const APPOINTMENT_ERROR_MESSAGES = {
  NOT_FOUND: 'Programarea nu a fost găsită în sistem - poate a fost ștearsă de altcineva',
  ALREADY_EXISTS: 'Există deja o programare pentru acest stilist în intervalul specificat',
  CREATE_FAILED: 'Crearea programării a eșuat din cauza unei probleme tehnice - încercați din nou',
  UPDATE_FAILED: 'Actualizarea programării a eșuat din cauza unei probleme tehnice - încercați din nou',
  DELETE_FAILED: 'Ștergerea programării a eșuat din cauza unei probleme tehnice - încercați din nou',
  STATUS_UPDATE_FAILED: 'Actualizarea statusului a eșuat din cauza unei probleme tehnice - încercați din nou',
  UNAUTHORIZED: 'Nu aveți permisiunea să accesați sau modificați această programare',
  DATABASE_ERROR: 'Eroare la accesarea bazei de date - contactați suportul tehnic',
  INVALID_DATA: 'Datele furnizate pentru programare sunt invalide',
  TIME_CONFLICT: 'Există o conflict de programare în intervalul specificat',
  STYLIST_NOT_AVAILABLE: 'Stilistul nu este disponibil în intervalul specificat',
  SERVICE_NOT_AVAILABLE: 'Serviciul nu este disponibil pentru stilistul selectat',
} as const

// --- ADMIN UI MESSAGES ---

/**
 * Mesaje pentru interfața de administrare a programărilor
 */
export const APPOINTMENT_ADMIN_UI_MESSAGES = {
  PAGE_TITLE: 'Gestionare Programări',
  PAGE_DESCRIPTION: 'Gestionează programările clienților',
  ADD_BUTTON: 'Adaugă Programare',
  EDIT_BUTTON: 'Editează',
  DELETE_BUTTON: 'Șterge',
  SAVE_BUTTON: 'Salvează',
  CANCEL_BUTTON: 'Anulează',
  CONFIRM_BUTTON: 'Confirmă',
  CANCEL_APPOINTMENT_BUTTON: 'Anulează Programarea',
  COMPLETE_BUTTON: 'Marchează ca Finalizat',
  ADD_TITLE: 'Adaugă programare nouă',
  EDIT_TITLE: 'Editează programare',
  DELETE_CONFIRM_TITLE: 'Șterge programare',
  DELETE_CONFIRM_DESC: 'Ești sigur că vrei să ștergi această programare? Această acțiune nu poate fi anulată.',
  CLIENT_EMAIL_LABEL: 'Email client',
  CLIENT_NAME_LABEL: 'Nume client',
  CLIENT_PHONE_LABEL: 'Telefon client',
  CLIENT_NOTES_LABEL: 'Note client',
  SERVICE_LABEL: 'Serviciu',
  STYLIST_LABEL: 'Stilist',
  START_TIME_LABEL: 'Ora de început',
  END_TIME_LABEL: 'Ora de sfârșit',
  STATUS_LABEL: 'Status',
  NO_APPOINTMENTS_TITLE: 'Nicio programare înregistrată',
  NO_APPOINTMENTS_DESC: 'Adaugă prima programare pentru a începe să gestionezi programările salonului.',
  LOADING_CREATE: 'Se creează...',
  LOADING_UPDATE: 'Se actualizează...',
  LOADING_DELETE: 'Se șterge...',
  LOADING_STATUS_UPDATE: 'Se actualizează statusul...',
  SEARCH_PLACEHOLDER: 'Caută după client, stilist sau serviciu...',
  FILTER_BY_STATUS: 'Filtrează după status',
  FILTER_BY_STYLIST: 'Filtrează după stilist',
  FILTER_BY_SERVICE: 'Filtrează după serviciu',
  FILTER_BY_DATE: 'Filtrează după dată',
  SHOW_TODAY_ONLY: 'Arată doar programările de azi',
  SHOW_UPCOMING: 'Arată doar programările viitoare',
} as const

// --- SYSTEM LIMITS ---

/**
 * Configurări pentru limitări și validări
 */
export const APPOINTMENT_LIMITS = {
  MAX_PER_PAGE: 50, // Numărul maxim de programări afișate pe pagină
  DEFAULT_PER_PAGE: 20, // Numărul implicit de programări pe pagină
  MAX_CLIENT_NAME_LENGTH: 100, // Lungimea maximă pentru numele clientului
  MIN_CLIENT_NAME_LENGTH: 2, // Lungimea minimă pentru numele clientului
  MAX_CLIENT_NOTES_LENGTH: 500, // Lungimea maximă pentru notele clientului
  MAX_EMAIL_LENGTH: 255, // Lungimea maximă pentru email
  MIN_APPOINTMENT_DURATION: 15, // Durata minimă pentru o programare (minute)
  MAX_APPOINTMENT_DURATION: 480, // Durata maximă pentru o programare (minute) - 8 ore
  ADVANCE_BOOKING_DAYS: 90, // Numărul maxim de zile în avans pentru programări
  MIN_ADVANCE_BOOKING_MINUTES: 30, // Timpul minim în avans pentru programări (minute)
} as const

// --- FORMATS ---

/**
 * Formate pentru afișarea datelor
 */
export const APPOINTMENT_FORMATS = {
  DATE_FORMAT: 'dd/MM/yyyy', // Format pentru afișarea datei
  TIME_FORMAT: 'HH:mm', // Format pentru afișarea orei
  DATETIME_FORMAT: 'dd/MM/yyyy HH:mm', // Format pentru afișarea datei și orei
  DURATION_FORMAT: '0', // Format pentru afișarea duratei
  TIME_UNIT: 'minute', // Unitatea de timp pentru durată
} as const

// --- BACKWARD COMPATIBILITY ---

/**
 * Pentru compatibilitate cu codul existent
 */
export const APPOINTMENT_MESSAGES = {
  VALIDATION: APPOINTMENT_VALIDATION_MESSAGES,
  SUCCESS: APPOINTMENT_SUCCESS_MESSAGES,
  ERROR: APPOINTMENT_ERROR_MESSAGES,
  ADMIN_UI: APPOINTMENT_ADMIN_UI_MESSAGES,
  SERVER: {
    CREATE_SUCCESS: APPOINTMENT_SUCCESS_MESSAGES.CREATED,
    CREATE_FAILED: APPOINTMENT_ERROR_MESSAGES.CREATE_FAILED,
    UPDATE_SUCCESS: APPOINTMENT_SUCCESS_MESSAGES.UPDATED,
    UPDATE_FAILED: APPOINTMENT_ERROR_MESSAGES.UPDATE_FAILED,
    DELETE_SUCCESS: APPOINTMENT_SUCCESS_MESSAGES.DELETED,
    DELETE_FAILED: APPOINTMENT_ERROR_MESSAGES.DELETE_FAILED,
    STATUS_UPDATE_SUCCESS: APPOINTMENT_SUCCESS_MESSAGES.STATUS_UPDATED,
    STATUS_UPDATE_FAILED: APPOINTMENT_ERROR_MESSAGES.STATUS_UPDATE_FAILED,
    NOT_FOUND: APPOINTMENT_ERROR_MESSAGES.NOT_FOUND,
  },
} as const
