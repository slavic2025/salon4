// src/components/features/stylist-services/DeleteStylistServiceMenuItem.tsx
'use client'

import { DeleteMenuItem } from '@/components/shared/DeleteMenuItem'
import { STYLIST_SERVICE_LINK_MESSAGES } from '@/core/domains/stylist-services/stylist-service.constants'
import { deleteStylistServiceLinkAction } from '@/features/stylist-services/actions'

type DeleteStylistServiceMenuItemProps = {
  stylistId: string
  serviceId: string
  serviceName: string
}

export function DeleteStylistServiceMenuItem({ stylistId, serviceId, serviceName }: DeleteStylistServiceMenuItemProps) {
  return (
    <DeleteMenuItem
      id={serviceId}
      onDelete={() => deleteStylistServiceLinkAction({ stylistId, serviceId })}
      messages={{
        confirmTitle: STYLIST_SERVICE_LINK_MESSAGES.UI.DELETE_CONFIRM_TITLE,
        confirmDescription: (
          <>
            Această acțiune nu poate fi anulată. Serviciul <strong>{serviceName}</strong> va fi eliminat din lista
            stilistului.
          </>
        ),
        success: STYLIST_SERVICE_LINK_MESSAGES.SUCCESS.REMOVED,
        validationError: STYLIST_SERVICE_LINK_MESSAGES.ERROR.VALIDATION,
        genericError: STYLIST_SERVICE_LINK_MESSAGES.ERROR.GENERIC,
      }}
    />
  )
}
