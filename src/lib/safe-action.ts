// src/lib/safe-action.ts

import { z } from 'zod'

import { createLogger } from '@/lib/logger'

const logger = createLogger('SafeAction')

// Definim o structură standard pentru răspuns
export type ActionResponse<TInput, TData> = {
  validationErrors?: Partial<Record<keyof TInput, string[]>>
  serverError?: string
  data?: TData
}

/**
 * Un helper care execută logica unei acțiuni în mod sigur.
 * Primește schema, input-ul și logica de business (handler).
 */
export async function executeSafeAction<TInput extends z.ZodType, TData>(
  schema: TInput,
  input: z.infer<TInput>,
  handler: (validatedInput: z.infer<TInput>) => Promise<{ data?: TData; serverError?: string }>,
): Promise<ActionResponse<z.infer<TInput>, TData>> {
  // Pas 1: Validarea
  const validationResult = schema.safeParse(input)
  if (!validationResult.success) {
    const validationErrors = validationResult.error.flatten().fieldErrors as ActionResponse<
      TInput,
      TData
    >['validationErrors']
    logger.warn('Action validation failed.', { errors: validationErrors })
    return { validationErrors }
  }

  // Pas 2: Execuția
  try {
    return await handler(validationResult.data)
  } catch (error) {
    logger.error('An unexpected error occurred in safe action handler.', { error })
    return { serverError: 'A apărut o eroare neașteptată. Vă rugăm să încercați din nou.' }
  }
}
