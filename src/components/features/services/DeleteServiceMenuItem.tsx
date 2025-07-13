// src/components/features/services/DeleteServiceMenuItem.tsx
'use client'

import { DeleteMenuItem } from '@/components/shared/DeleteMenuItem'
import { SERVICE_MESSAGES } from '@/core/domains/services/service.constants'
import { deleteServiceAction } from '@/features/services/actions'

type DeleteServiceMenuItemProps = {
  serviceId: string
  serviceName: string
}

export function DeleteServiceMenuItem({ serviceId, serviceName }: DeleteServiceMenuItemProps) {
  return (
    <DeleteMenuItem
      id={serviceId}
      name={serviceName}
      onDelete={(id) => deleteServiceAction({ id })}
      messages={{
        confirmTitle: 'Ești absolut sigur?',
        confirmDescription: (
          <>
            Această acțiune nu poate fi anulată. Serviciul <strong>{serviceName}</strong> va fi șters permanent.
          </>
        ),
        success: SERVICE_MESSAGES.SUCCESS.DELETED,
        validationError: 'Eroare de validare la ștergere.',
        genericError: 'A apărut o eroare la ștergere.',
      }}
    />
  )
}
