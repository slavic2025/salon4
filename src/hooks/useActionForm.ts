// src/hooks/useActionForm.ts
'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { type z } from 'zod'

import { createLogger } from '@/lib/logger'
import { type ActionResponse } from '@/lib/safe-action'

// Definim tipurile pentru props-urile hook-ului
type UseActionFormProps<TInput extends z.ZodType, TData> = {
  // Acțiunea sigură pe care o vom executa
  action: (input: z.infer<TInput>) => Promise<ActionResponse<z.infer<TInput>, TData>>
  // Callback pentru succes
  onSuccess?: (data: TData | undefined) => void
  // Callback pentru eroare
  onError?: (error: { serverError?: string; validationErrors?: object }) => void
  // Mesaje personalizate pentru toast-uri
  toastMessages?: {
    loading?: string
    success?: string | ((data: TData | undefined) => string)
    error?: string
  }
}

/**
 * Un hook custom pentru a gestiona starea și efectele secundare
 * ale unei Server Action create cu `createSafeAction`.
 *
 * @template TInput - Tipul schemei Zod pentru input.
 * @template TData - Tipul datelor returnate la succes.
 */
export function useActionForm<TInput extends z.ZodType, TData>({
  action,
  onSuccess,
  onError,
  toastMessages,
}: UseActionFormProps<TInput, TData>) {
  const logger = createLogger('useActionForm')
  const [isPending, startTransition] = useTransition()
  const [actionState, setActionState] = useState<ActionResponse<TInput, TData>>({})

  const formSubmit = async (input: z.infer<TInput>): Promise<void> => {
    // Afișăm un toast de încărcare
    const toastId = toast.loading(toastMessages?.loading ?? 'Se procesează...')

    // Folosim `startTransition` pentru a nu bloca UI-ul
    startTransition(async () => {
      const result = await action(input)

      // Actualizăm starea cu rezultatul acțiunii
      setActionState(result)

      // Gestionăm răspunsul
      if (result.serverError || result.validationErrors) {
        // Cazul de eroare
        const errorMessage = result.serverError ?? 'Vă rugăm verificați câmpurile completate.'
        toast.error(toastMessages?.error ?? 'A apărut o eroare', {
          id: toastId,
          description: errorMessage,
        })
        logger.warn('Action failed', { error: result })
        onError?.({
          serverError: result.serverError,
          validationErrors: result.validationErrors,
        })
      } else {
        // Cazul de succes
        const successMessage =
          typeof toastMessages?.success === 'function'
            ? toastMessages.success(result.data)
            : (toastMessages?.success ?? 'Operațiune reușită!')

        toast.success('Succes!', {
          id: toastId,
          description: successMessage,
        })
        logger.info('Action successful', { data: result.data })
        onSuccess?.(result.data)
      }
    })
  }

  return {
    formSubmit,
    isPending,
    state: actionState,
  }
}
