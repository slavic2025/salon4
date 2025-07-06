export const SERVICE_MESSAGES = {
  VALIDATION: {
    NAME_MIN_LENGTH: 'Numele serviciului trebuie să aibă cel puțin 3 caractere.',
    PRICE_POSITIVE: 'Prețul trebuie să fie un număr pozitiv.',
    DURATION_POSITIVE: 'Durata trebuie să fie un număr întreg pozitiv.',
    ID_REQUIRED: 'ID-ul serviciului este obligatoriu.',
  },
  SUCCESS: {
    CREATED: 'Serviciul a fost creat cu succes.',
    UPDATED: 'Serviciul a fost actualizat cu succes.',
    DELETED: 'Serviciul a fost șters cu succes.',
  },
  ERROR: {
    NOT_FOUND: 'Serviciul nu a fost găsit.',
    ALREADY_EXISTS: 'Un serviciu cu acest nume există deja.',
    CREATE_FAILED: 'Nu s-a putut crea serviciul.',
    UPDATE_FAILED: 'Nu s-a putut actualiza serviciul.',
    DELETE_FAILED: 'Nu s-a putut șterge serviciul.',
  },
} as const
