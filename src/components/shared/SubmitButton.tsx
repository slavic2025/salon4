'use client'

import { Loader2 } from 'lucide-react'
import React from 'react'

import { Button, type ButtonProps } from '@/components/ui/button'

// Pasul 1: Definim proprietățile. `isPending` este acum singura sursă de adevăr pentru starea butonului.
type SubmitButtonProps = ButtonProps & {
  isPending: boolean
  pendingText?: string
  children: React.ReactNode
}

/**
 * O componentă reutilizabilă pentru butoanele de submit.
 * Afișează o stare de încărcare pe baza proprietății `isPending`.
 * Este o componentă "dumb", controlată complet de părintele său.
 */
export function SubmitButton({ isPending, pendingText = 'Se procesează...', children, ...props }: SubmitButtonProps) {
  // Pasul 2: Am eliminat complet `useFormStatus` și `useEffect`.

  return (
    // Pasul 3: Starea `disabled` și conținutul butonului depind EXCLUSIV de `isPending`.
    <Button type="submit" disabled={isPending} {...props}>
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {pendingText}
        </>
      ) : (
        children
      )}
    </Button>
  )
}
