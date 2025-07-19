// src/core/domains/stylist-services/stylist-service.constants.ts

export const STYLIST_SERVICE_LINK_MESSAGES = {
  VALIDATION: {
    STYLIST_ID_REQUIRED: 'ID-ul stilistului este obligatoriu.',
    STYLIST_ID_INVALID: 'ID-ul stilistului nu este valid.',
    SERVICE_ID_REQUIRED: 'ID-ul serviciului este obligatoriu.',
    SERVICE_ID_INVALID: 'ID-ul serviciului nu este valid.',
    CUSTOM_PRICE_INVALID: 'Prețul personalizat trebuie să fie un număr pozitiv.',
    CUSTOM_DURATION_INVALID: 'Durata personalizată trebuie să fie un număr întreg pozitiv.',
    CUSTOM_DURATION_MIN: 'Durata personalizată trebuie să fie minim 15 minute.',
    CUSTOM_PRICE_FORMAT: 'Formatul prețului nu este valid. Folosiți formatul cu două zecimale.',
    LINK_ALREADY_EXISTS: 'Această legătură stilist-serviciu există deja.',
  },
  SUCCESS: {
    CREATED: 'Legătura stilist-serviciu a fost creată cu succes.',
    UPDATED: 'Legătura stilist-serviciu a fost actualizată cu succes.',
    DELETED: 'Legătura stilist-serviciu a fost ștearsă cu succes.',
    REMOVED: 'Serviciul a fost eliminat cu succes.',
    ASSOCIATED: 'Serviciu asociat cu succes!',
  },
  ERROR: {
    NOT_FOUND: 'Legătura stilist-serviciu nu a fost găsită.',
    CREATE_FAILED: 'Nu s-a putut crea legătura stilist-serviciu.',
    UPDATE_FAILED: 'Nu s-a putut actualiza legătura stilist-serviciu.',
    DELETE_FAILED: 'Nu s-a putut șterge legătura stilist-serviciu.',
    ALREADY_EXISTS: 'Această legătură există deja.',
    VALIDATION: 'Eroare de validare la ștergere.',
    GENERIC: 'A apărut o eroare la ștergere.',
    UNAUTHORIZED_ACCESS: 'Acces neautorizat la gestionarea serviciilor stilistului.',
    UNAUTHORIZED_ADD: 'Nu poți adăuga servicii pentru alți stiliști.',
    UNAUTHORIZED_DELETE: 'Nu poți șterge servicii de la alți stiliști.',
    UNAUTHORIZED_UPDATE: 'Nu poți actualiza servicii de la alți stiliști.',
    SERVICES_LOAD_FAILED: 'Nu s-au putut încărca serviciile.',
    SERVICES_LOAD_ERROR: 'Eroare la încărcarea serviciilor:',
  },
  UI: {
    // Constante pentru pagina stilistului
    PAGE_TITLE: 'Serviciile Mele',
    PAGE_DESCRIPTION: 'Gestionează serviciile pe care le oferi clienților.',
    SERVICES_COUNT: (count: number) => `${count} servicii asociate.`,
    SERVICES_LIST_TITLE: 'Lista Serviciilor',
    EMPTY_STATE_TITLE: 'Niciun serviciu asociat',
    EMPTY_STATE_DESCRIPTION: 'Adaugă primul tău serviciu pentru a începe să lucrezi cu clienții.',

    // Constante pentru butoane și acțiuni
    ADD_BUTTON: 'Adaugă Serviciu',
    ADD_TITLE: 'Adaugă un Serviciu pentru Stilist',
    EDIT_TITLE: 'Editează serviciul asociat',
    EDIT_BUTTON: 'Salvează Modificările',
    DELETE_CONFIRM_TITLE: 'Ești sigur că vrei să elimini serviciul?',
    DELETE_CONFIRM_DESC: (serviceName: string) =>
      `Această acțiune nu poate fi anulată. Serviciul ${serviceName} va fi eliminat din lista stilistului.`,
    CANCEL_BUTTON: 'Anulează',
    DELETE_BUTTON: 'Șterge',
    SAVE_BUTTON: 'Salvează',

    // Constante pentru formulare
    FORM_SERVICE_LABEL: 'Serviciu',
    FORM_PRICE_LABEL: 'Preț personalizat',
    FORM_DURATION_LABEL: 'Durată personalizată (minute)',
    FORM_PLACEHOLDER_PRICE: 'Lasă necompletat pentru preț standard',
    FORM_PLACEHOLDER_DURATION: 'Lasă necompletat pentru durata standard',
    SELECT_SERVICE_PLACEHOLDER: 'Selectează un serviciu',

    // Constante pentru tabele
    TABLE_EMPTY_TITLE: 'Niciun serviciu asociat',
    TABLE_EMPTY_DESC: 'Adaugă un serviciu pentru acest stilist.',
    TABLE_HEADER_NAME: 'Nume',
    TABLE_HEADER_CATEGORY: 'Categorie',
    TABLE_HEADER_PRICE: 'Preț standard',
    TABLE_HEADER_DURATION: 'Durată standard',
    TABLE_HEADER_CUSTOM_PRICE: 'Preț personalizat',
    TABLE_HEADER_CUSTOM_DURATION: 'Durată personalizată',
    TABLE_HEADER_ACTIONS: 'Acțiuni',

    // Constante pentru dialog-uri
    ADD_DIALOG_TITLE: 'Adaugă un serviciu nou la lista ta de servicii oferite.',
    EDIT_DIALOG_DESCRIPTION: (serviceName: string) =>
      `Editează prețul și durata personalizată pentru serviciul "${serviceName}".`,
    SERVICE_DETAILS_TITLE: 'Serviciu selectat:',
    SERVICE_DETAILS_LABEL: 'Detalii serviciu:',
    PRICE_STANDARD_LABEL: 'Preț standard:',
    DURATION_STANDARD_LABEL: 'Durată standard:',
    TIME_UNIT: 'min',
    CURRENCY_UNIT: 'MDL',

    // Constante pentru loading states
    LOADING_ADD: 'Se adaugă...',
    LOADING_DELETE: 'Se șterge...',
    LOADING_UPDATE: 'Se actualizează serviciul...',
    LOADING_SAVE: 'Se salvează...',
  },
} as const

// Constante pentru validare
export const STYLIST_SERVICE_VALIDATION = {
  MIN_DURATION: 15, // minute
  MAX_DURATION: 480, // 8 ore
  MIN_PRICE: 0.01,
  MAX_PRICE: 9999.99,
  MAX_DESCRIPTION_LENGTH: 500,
} as const

// Constante pentru formate
export const STYLIST_SERVICE_FORMATS = {
  PRICE_PATTERN: /^\d+(\.\d{1,2})?$/,
  DURATION_PATTERN: /^\d+$/,
  TIME_PATTERN: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
} as const

// Constante pentru tipuri de preț
export const PRICE_TYPES = {
  STANDARD: 'standard',
  CUSTOM: 'custom',
} as const

export type PriceType = (typeof PRICE_TYPES)[keyof typeof PRICE_TYPES]
