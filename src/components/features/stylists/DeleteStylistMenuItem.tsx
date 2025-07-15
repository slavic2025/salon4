// src/components/features/stylists/DeleteStylistMenuItem.tsx
'use client'

import { DeleteMenuItem } from '@/components/shared/DeleteMenuItem'
import { STYLIST_MESSAGES } from '@/core/domains/stylists/stylist.constants'
import { deleteStylistAction } from '@/features/stylists/actions'

type DeleteStylistMenuItemProps = {
  stylistId: string
  stylistName: string
}

export function DeleteStylistMenuItem({ stylistId, stylistName }: DeleteStylistMenuItemProps) {
  return (
    <DeleteMenuItem
      id={stylistId}
      onDelete={(id) => deleteStylistAction({ id })}
      messages={{
        confirmTitle: 'Ești absolut sigur?',
        confirmDescription: (
          <>
            Această acțiune nu poate fi anulată. Contul și toate datele asociate stilistului{' '}
            <strong>{stylistName}</strong> vor fi șterse permanent.
          </>
        ),
        success: STYLIST_MESSAGES.SERVER.DELETE_SUCCESS,
        validationError: 'Eroare de validare la ștergere.',
        genericError: 'A apărut o eroare la ștergere.',
      }}
    />
  )
}
