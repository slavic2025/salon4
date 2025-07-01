// src/lib/safe-action.ts
'use server'

import { z } from 'zod'

import { createLogger } from '@/lib/logger'

const logger = createLogger('SafeAction')

// Definim o structură standard pentru răspunsul unei acțiuni
export type ActionResponse<TInput, TData> = {
  validationErrors?: Partial<Record<keyof TInput, string[]>>
  serverError?: string
  data?: TData
}

/**
 * O funcție-fabrică de nivel înalt pentru a crea Server Actions sigure și validate.
 * Gestionează validarea cu Zod, logging-ul și formatarea erorilor.
 *
 * @template TInput - Tipul input-ului, inferat din schema Zod.
 * @template TData - Tipul datelor returnate la succes.
 * @param schema - Schema Zod pentru validarea input-ului.
 * @param handler - Funcția (business logic) care se execută dacă validarea are succes.
 * @returns O Server Action sigură și tipizată.
 */
export function createSafeAction<TInput extends z.ZodType, TData>(
  schema: TInput,
  handler: (input: z.infer<TInput>) => Promise<ActionResponse<z.infer<TInput>, TData>>,
) {
  return async (input: z.infer<TInput>): Promise<ActionResponse<z.infer<TInput>, TData>> => {
    // Pas 1: Validarea input-ului cu schema Zod
    const validationResult = schema.safeParse(input)

    if (!validationResult.success) {
      // Dacă validarea eșuează, formatăm erorile și le returnăm
      const validationErrors = validationResult.error.flatten().fieldErrors as ActionResponse<
        TInput,
        TData
      >['validationErrors']

      logger.warn('Action validation failed.', { errors: validationErrors })

      return {
        validationErrors,
      }
    }

    // Pas 2: Executarea logicii de business
    try {
      // Apelăm handler-ul cu datele validate și returnăm direct rezultatul său.
      return await handler(validationResult.data)
    } catch (error) {
      // Pas 3: Gestionarea erorilor neașteptate (exceptii)
      logger.error('An unexpected error occurred in safe action handler.', { error })

      return {
        serverError: 'A apărut o eroare neașteptată. Vă rugăm să încercați din nou.',
      }
    }
  }
}
