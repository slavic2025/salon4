// src/lib/errors.ts (Varianta finală, "Best Practice")

/**
 * Opțiuni pentru constructorul AppError, aliniate cu standardul `Error`.
 */
interface AppErrorOptions {
  /** Eroarea originală care a cauzat această problemă, pentru un context de debugging mai bun. */
  cause?: unknown
}

/**
 * O clasă de bază pentru toate erorile specifice aplicației.
 * Folosește proprietatea standard `cause` pentru a împacheta eroarea originală.
 */
export class AppError extends Error {
  public readonly cause?: unknown

  constructor(message: string, options?: AppErrorOptions) {
    super(message)
    // Asigură că 'this' este corect în contextul moștenirii
    Object.setPrototypeOf(this, new.target.prototype)

    this.name = this.constructor.name // Numele erorii devine numele clasei
    this.cause = options?.cause
  }
}

/**
 * O eroare specifică pentru problemele la nivel de bază de date (ex: eșecul unei interogări).
 */
export class DatabaseError extends AppError {
  constructor(message: string, options: { cause: unknown }) {
    super(message, options)
    this.name = 'DatabaseError'
  }
}

/**
 * O eroare semantică pentru a semnala încălcarea constrângerilor de unicitate.
 * Transportă informații specifice despre câmpurile care au cauzat eroarea.
 */
export class UniquenessError extends AppError {
  /** O listă de câmpuri și mesajele de eroare asociate. */
  public readonly fields: Readonly<{ field: string; message: string }[]>

  constructor(message: string, fields: { field: string; message: string }[]) {
    super(message)
    this.name = 'UniquenessError'
    this.fields = fields
  }
}

/**
 * O eroare pentru a semnala că o resursă solicitată nu a fost găsită.
 * Poate fi folosită pentru a returna un status 404.
 */
export class NotFoundError extends AppError {
  constructor(message: string = 'Resursa nu a fost găsită.') {
    super(message)
    this.name = 'NotFoundError'
  }
}
