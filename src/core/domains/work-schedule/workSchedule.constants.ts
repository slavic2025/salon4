// src/core/domains/work-schedule/workSchedule.constants.ts

export const DAYS_OF_WEEK = {
  MONDAY: 0,
  TUESDAY: 1,
  WEDNESDAY: 2,
  THURSDAY: 3,
  FRIDAY: 4,
  SATURDAY: 5,
  SUNDAY: 6,
} as const

export const DAY_NAMES = {
  [DAYS_OF_WEEK.MONDAY]: 'Luni',
  [DAYS_OF_WEEK.TUESDAY]: 'Marți',
  [DAYS_OF_WEEK.WEDNESDAY]: 'Miercuri',
  [DAYS_OF_WEEK.THURSDAY]: 'Joi',
  [DAYS_OF_WEEK.FRIDAY]: 'Vineri',
  [DAYS_OF_WEEK.SATURDAY]: 'Sâmbătă',
  [DAYS_OF_WEEK.SUNDAY]: 'Duminică',
} as const

export const WORK_SCHEDULE_MESSAGES = {
  VALIDATION: {
    DAY_OF_WEEK_REQUIRED: 'Ziua săptămânii este obligatorie.',
    DAY_OF_WEEK_INVALID: 'Ziua săptămânii trebuie să fie între 0 și 6.',
    START_TIME_REQUIRED: 'Ora de început este obligatorie.',
    END_TIME_REQUIRED: 'Ora de sfârșit este obligatorie.',
    END_TIME_AFTER_START: 'Ora de sfârșit trebuie să fie după ora de început.',
    TIME_FORMAT_INVALID: 'Formatul orei nu este valid. Folosiți HH:MM.',
    STYLIST_ID_REQUIRED: 'ID-ul stilistului este obligatoriu.',
    ID_REQUIRED: 'ID-ul programului este obligatoriu.',
    TIME_OVERLAP: 'Acest interval se suprapune cu un interval existent în aceeași zi.',
  },
  SUCCESS: {
    CREATED: 'Intervalul de program a fost adăugat cu succes.',
    UPDATED: 'Intervalul de program a fost actualizat cu succes.',
    DELETED: 'Intervalul de program a fost șters cu succes.',
  },
  ERROR: {
    NOT_FOUND: 'Intervalul de program nu a fost găsit.',
    CREATE_FAILED: 'Nu s-a putut crea intervalul de program.',
    UPDATE_FAILED: 'Nu s-a putut actualiza intervalul de program.',
    DELETE_FAILED: 'Nu s-a putut șterge intervalul de program.',
    OVERLAP_EXISTS: 'Există deja un interval în această perioadă.',
    UNAUTHORIZED_ACCESS: 'Nu aveți permisiunea să accesați acest program.',
    UNAUTHORIZED_MODIFY: 'Nu aveți permisiunea să modificați programul altor stiliști.',
  },
  UI: {
    PAGE_TITLE: 'Programul meu de lucru',
    PAGE_DESCRIPTION: 'Gestionează intervalele tale de lucru pentru fiecare zi a săptămânii.',
    SCHEDULE_OVERVIEW_TITLE: 'Programul săptămânal',
    INTERVALS_COUNT: (count: number) => `${count} ${count === 1 ? 'interval configurat' : 'intervale configurate'}`,
    NO_INTERVALS_SET: 'Niciun interval configurat încă',
    ADD_BUTTON: 'Adaugă Interval',
    EDIT_BUTTON: 'Editează',
    DELETE_BUTTON: 'Șterge',
    SAVE_BUTTON: 'Salvează',
    CANCEL_BUTTON: 'Anulează',
    ADD_TITLE: 'Adaugă interval nou',
    EDIT_TITLE: 'Editează interval',
    DELETE_CONFIRM_TITLE: 'Șterge interval',
    DELETE_CONFIRM_DESC: 'Ești sigur că vrei să ștergi acest interval? Această acțiune nu poate fi anulată.',
    DAY_LABEL: 'Ziua',
    START_TIME_LABEL: 'Ora de început',
    END_TIME_LABEL: 'Ora de sfârșit',
    NO_SCHEDULE_TITLE: 'Niciun program setat',
    NO_SCHEDULE_DESC: 'Adaugă primul interval pentru a-ți configura programul de lucru.',
    LOADING_ADD: 'Se adaugă...',
    LOADING_UPDATE: 'Se actualizează...',
    LOADING_DELETE: 'Se șterge...',
    TIME_PLACEHOLDER: 'HH:MM',
  },
} as const
