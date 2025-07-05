// src/core/domains/stylists/stylist.constants.ts

export const STYLIST_MESSAGES = {
  VALIDATION: {
    FULL_NAME_REQUIRED: 'Numele complet este obligatoriu.',
    FULL_NAME_MIN_LENGTH: 'Numele trebuie să aibă cel puțin 3 caractere.',
    INVALID_EMAIL: 'Adresa de email nu este validă.',
    PHONE_TOO_SHORT: 'Numărul de telefon este prea scurt.',
    ID_REQUIRED: 'ID-ul stilistului este necesar pentru această operațiune.',
  },
  SERVER: {
    CREATE_SUCCESS: 'Stilistul a fost invitat și adăugat cu succes!',
    CREATE_AUTH_ERROR: 'Eroare la crearea contului de autentificare pentru stilist.',
    CREATE_PROFILE_ERROR:
      'Contul a fost creat, dar a apărut o eroare la salvarea profilului. Contul a fost șters pentru a preveni date inconsistente.',
    UPDATE_SUCCESS: 'Profilul stilistului a fost actualizat cu succes!',
    UPDATE_ERROR: 'A apărut o eroare la actualizarea profilului.',
    DELETE_SUCCESS: 'Stilistul a fost șters cu succes.',
    DELETE_ERROR: 'A apărut o eroare la ștergerea stilistului.',
    NOT_FOUND: 'Stilistul nu a fost găsit.',
  },
} as const
